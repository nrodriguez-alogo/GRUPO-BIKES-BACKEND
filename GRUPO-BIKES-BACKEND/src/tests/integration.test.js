import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import "dotenv/config";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Only this uniquely named database and temporary upload directory are mutated.
const testDb =
  "grupobikes_test_" + randomUUID().replaceAll("-", "").slice(0, 16);
const uploadDir = await mkdtemp(path.join(tmpdir(), "grupobikes-test-"));
process.env.NODE_ENV = "test";
process.env.UPLOAD_DIR = uploadDir;
process.env.JWT_SECRET = "test-only-secret-with-at-least-thirty-two-characters";
process.env.ADMIN_REGISTRATION_CODE = "test-only-admin-invitation";
process.env.SMTP_USER = "mail@example.test";
process.env.SMTP_PASS = "test-only-password";
process.env.MAIL_FROM = "mail@example.test";
const mails = [];
let mailFails = false;
const originalTransport = nodemailer.createTransport;
nodemailer.createTransport = () => ({
  async sendMail(mail) {
    if (mailFails) throw new Error("SMTP unavailable");
    mails.push(mail);
    return { accepted: [mail.to] };
  },
  close() {},
});
const { default: app } = await import("../servidor.js");
const { default: Users } = await import("../modelos/modeloUsuarios.js");
const { default: Products } = await import("../modelos/modeloProductos.js");
const { default: News } = await import("../modelos/modeloNoticias.js");
const { recoveryCode } = await import("../ayudas/recovery.js");
const { generarToken } = await import("../ayudas/funciones.js");
const strong = "Secure-Password9$";
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
  "base64",
);
let base, server;
async function call(route, { method = "GET", data, token, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = "Bearer " + token;
  if (data) headers["Content-Type"] = "application/json";
  const res = await fetch(base + route, {
    method,
    headers,
    body: form || (data ? JSON.stringify(data) : undefined),
  });
  return { status: res.status, body: await res.json(), headers: res.headers };
}
function form(data, image = true) {
  const f = new FormData();
  for (const [k, v] of Object.entries(data)) f.append(k, String(v));
  if (image)
    f.append("imagen", new Blob([png], { type: "image/png" }), "test.png");
  return f;
}
const motorcycle = {
  marca: "Prueba",
  modelo: "Ruta 250",
  descripcion: "Motocicleta de prueba",
  color: "Negro",
  categoria: "Nuevas",
  precio: 12000000,
  estado: "Disponible",
  cilindraje: 250,
};
let normal, admin, productId, newsId;
try {
  await mongoose.connect(process.env.MONGODB, {
    dbName: testDb,
    serverSelectionTimeoutMS: 10000,
  });
  await Promise.all([Users.init(), Products.init(), News.init()]);
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  base = "http://127.0.0.1:" + server.address().port;
  await test("Integración API con MongoDB aislado", async (t) => {
    await t.test(
      "registro vacío responde 400 y la API sigue viva",
      async () => {
        const r = await call("/usuarios", { method: "POST", data: {} });
        assert.equal(r.status, 400);
        assert.equal((await call("/")).status, 200);
      },
    );
    await t.test("registro inicia sesión sin exponer el hash", async () => {
      const r = await call("/usuarios", {
        method: "POST",
        form: form({
          nombre: "Usuario de prueba",
          correo: "USER@example.test",
          contrasena: strong,
          rol: "usuario",
        }),
      });
      assert.equal(r.status, 201);
      assert.equal(r.body.usuario.rol, "usuario");
      assert.equal(r.body.usuario.correo, "user@example.test");
      assert.equal(typeof r.body.datos, "string");
      assert.equal(JSON.stringify(r.body).includes("$2b$"), false);
      normal = r.body;
    });
    await t.test("correo duplicado se rechaza", async () =>
      assert.equal(
        (
          await call("/usuarios", {
            method: "POST",
            data: {
              nombre: "Duplicado",
              correo: "user@example.test",
              contrasena: strong,
            },
          })
        ).status,
        409,
      ),
    );
    await t.test(
      "autoregistro de administrador sin invitación está bloqueado",
      async () =>
        assert.equal(
          (
            await call("/usuarios", {
              method: "POST",
              data: {
                nombre: "Intruso",
                correo: "intruso@example.test",
                contrasena: strong,
                rol: "administrador",
              },
            })
          ).status,
          403,
        ),
    );
    await t.test(
      "invitación válida crea una sesión administradora",
      async () => {
        const r = await call("/usuarios", {
          method: "POST",
          data: {
            nombre: "Admin",
            correo: "admin@example.test",
            contrasena: strong,
            rol: "administrador",
            codigoAdministrador: process.env.ADMIN_REGISTRATION_CODE,
          },
        });
        assert.equal(r.status, 201);
        assert.equal(r.body.usuario.rol, "administrador");
        admin = r.body;
      },
    );
    await t.test(
      "token ausente, falso y rol usuario no pueden publicar",
      async () => {
        for (const [token, status] of [
          [null, 401],
          ["falso.token.jwt", 401],
          [normal.datos, 403],
        ])
          assert.equal(
            (
              await call("/productos", {
                method: "POST",
                token,
                data: motorcycle,
              })
            ).status,
            status,
          );
      },
    );
    await t.test("usuario no lista cuentas ni cambia su rol", async () => {
      assert.equal(
        (await call("/usuarios", { token: normal.datos })).status,
        403,
      );
      assert.equal(
        (
          await call("/usuarios/" + normal.usuario._id, {
            method: "PUT",
            token: normal.datos,
            data: { rol: "administrador" },
          })
        ).status,
        400,
      );
    });
    await t.test("JWT firmado pero con id inexistente se rechaza", async () => {
      const fake = generarToken({ _id: new mongoose.Types.ObjectId() });
      assert.equal((await call("/login/me", { token: fake })).status, 401);
    });
    await t.test(
      "SQL textual y operadores NoSQL no permiten iniciar sesión",
      async () => {
        for (const username of [
          "1 = 1",
          "' OR 1=1 --",
          { $ne: null },
          ["user@example.test"],
        ])
          assert.equal(
            (
              await call("/login", {
                method: "POST",
                data: { username, contrasena: strong },
              })
            ).status,
            400,
          );
        assert.equal(
          (
            await call("/login", {
              method: "POST",
              data: {
                username: "user@example.test",
                contrasena: { $ne: null },
              },
            })
          ).status,
          400,
        );
        assert.equal(
          (
            await call("/login", {
              method: "POST",
              data: { username: "missing@example.test", contrasena: strong },
            })
          ).status,
          401,
        );
      },
    );
    await t.test("credenciales válidas y /me funcionan", async () => {
      assert.equal(
        (
          await call("/login", {
            method: "POST",
            data: { username: "user@example.test", contrasena: strong },
          })
        ).status,
        200,
      );
      const r = await call("/login/me", { token: admin.datos });
      assert.equal(r.body.datos.rol, "administrador");
      assert.equal(r.body.datos.contrasena, undefined);
    });
    await t.test("cada campo de moto es obligatorio en servidor", async () => {
      for (const key of Object.keys(motorcycle)) {
        const data = { ...motorcycle, [key]: "" };
        assert.equal(
          (
            await call("/productos", {
              method: "POST",
              token: admin.datos,
              form: form(data),
            })
          ).status,
          400,
          key,
        );
      }
      assert.equal((await readdir(uploadDir)).length, 1);
      assert.equal((await call("/")).status, 200);
    });
    await t.test(
      "sin imagen, precio negativo o archivo falso devuelve 400",
      async () => {
        assert.equal(
          (
            await call("/productos", {
              method: "POST",
              token: admin.datos,
              form: form(motorcycle, false),
            })
          ).status,
          400,
        );
        assert.equal(
          (
            await call("/productos", {
              method: "POST",
              token: admin.datos,
              form: form({ ...motorcycle, precio: -1 }),
            })
          ).status,
          400,
        );
        const f = form(motorcycle, false);
        f.append(
          "imagen",
          new Blob(["<script>alert(1)</script>"], { type: "image/png" }),
          "fake.png",
        );
        assert.equal(
          (
            await call("/productos", {
              method: "POST",
              token: admin.datos,
              form: f,
            })
          ).status,
          400,
        );
      },
    );
    await t.test("archivo excesivo se rechaza sin tumbar la API", async () => {
      const f = form(motorcycle, false);
      f.append(
        "imagen",
        new Blob([Buffer.alloc(5 * 1024 * 1024 + 1)], { type: "image/png" }),
        "large.png",
      );
      assert.equal(
        (
          await call("/productos", {
            method: "POST",
            token: admin.datos,
            form: f,
          })
        ).status,
        400,
      );
      assert.equal((await call("/")).status, 200);
    });
    await t.test(
      "moto publicada aparece en catálogo público con su imagen",
      async () => {
        const r = await call("/productos", {
          method: "POST",
          token: admin.datos,
          form: form(motorcycle),
        });
        assert.equal(r.status, 201);
        productId = r.body.datos._id;
        const listed = await call("/productos");
        assert.equal(listed.body.datos[0]._id, productId);
        const image = await fetch(base + "/imagenes/" + r.body.datos.imagen);
        assert.equal(image.status, 200);
        assert.equal(image.headers.get("x-content-type-options"), "nosniff");
      },
    );
    await t.test("edición conserva imagen y aplica validación", async () => {
      assert.equal(
        (
          await call("/productos/" + productId, {
            method: "PUT",
            token: admin.datos,
            data: { ...motorcycle, modelo: "Modelo editado" },
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await call("/productos/" + productId, {
            method: "PUT",
            token: admin.datos,
            data: { ...motorcycle, cilindraje: { $gt: 0 } },
          })
        ).status,
        400,
      );
    });
    await t.test("ids inválidos y ausentes responden 400/404", async () => {
      assert.equal((await call("/productos/not-an-id")).status, 400);
      assert.equal(
        (await call("/productos/" + new mongoose.Types.ObjectId())).status,
        404,
      );
    });
    await t.test(
      "noticias requieren administrador y campos completos",
      async () => {
        assert.equal(
          (
            await call("/noticias", {
              method: "POST",
              token: normal.datos,
              form: form({}),
            })
          ).status,
          403,
        );
        assert.equal(
          (
            await call("/noticias", {
              method: "POST",
              token: admin.datos,
              form: form({ titulo: "Incompleto" }),
            })
          ).status,
          400,
        );
      },
    );
    await t.test(
      "noticia publicada aparece con artículo e imagen",
      async () => {
        const r = await call("/noticias", {
          method: "POST",
          token: admin.datos,
          form: form({
            titulo: "Nueva ruta",
            subtitulo: "La comunidad rueda",
            contenido: "Primer párrafo.\n\nSegundo párrafo.",
            autor: "Equipo GB",
          }),
        });
        assert.equal(r.status, 201);
        newsId = r.body.datos._id;
        assert.equal(
          (await call("/noticias")).body.datos[0].contenido,
          "Primer párrafo.\n\nSegundo párrafo.",
        );
      },
    );
    await t.test(
      "generador cumple exactamente 10 caracteres y 2 símbolos",
      () => {
        const seen = new Set();
        for (let i = 0; i < 1000; i++) {
          const code = recoveryCode();
          assert.match(code, /^[a-zA-Z0-9.$-]{10}$/);
          assert.match(code, /[a-z]/);
          assert.match(code, /[A-Z]/);
          assert.match(code, /[0-9]/);
          assert.equal((code.match(/[.$-]/g) || []).length, 2);
          seen.add(code);
        }
        assert.equal(seen.size, 1000);
      },
    );
    await t.test(
      "recuperación envía clave sin cambiar la contraseña",
      async () => {
        const r = await call("/usuarios/olvidarContrasena", {
          method: "POST",
          data: { correo: "user@example.test" },
        });
        assert.equal(r.status, 200);
        assert.equal(mails.length, 1);
        assert.equal(mails[0].to, "user@example.test");
        const code = /es: ([^\n]+)/.exec(mails[0].text)[1];
        const stored = await Users.findById(normal.usuario._id).select(
          "+recoveryHash",
        );
        assert.notEqual(stored.recoveryHash, code);
        assert.equal(
          (
            await call("/login", {
              method: "POST",
              data: { username: "user@example.test", contrasena: strong },
            })
          ).status,
          200,
        );
      },
    );
    await t.test(
      "cuentas desconocidas reciben el mismo mensaje sin correo",
      async () => {
        const r = await call("/usuarios/olvidarContrasena", {
          method: "POST",
          data: { correo: "nobody@example.test" },
        });
        assert.equal(r.status, 200);
        assert.equal(mails.length, 1);
        assert.match(r.body.mensaje, /Si el correo/);
      },
    );
    await t.test(
      "clave errónea falla, clave correcta cambia contraseña e invalida sesiones",
      async () => {
        const code = /es: ([^\n]+)/.exec(mails[0].text)[1];
        assert.equal(
          (
            await call("/usuarios/restablecerContrasena", {
              method: "POST",
              data: {
                correo: "user@example.test",
                codigo: "Wrong123.$",
                contrasena: "New-Password9$",
              },
            })
          ).status,
          400,
        );
        const r = await call("/usuarios/restablecerContrasena", {
          method: "POST",
          data: {
            correo: "user@example.test",
            codigo: code,
            contrasena: "New-Password9$",
          },
        });
        assert.equal(r.status, 200);
        assert.equal(
          (await call("/login/me", { token: normal.datos })).status,
          401,
        );
        assert.equal(
          (
            await call("/login", {
              method: "POST",
              data: { username: "user@example.test", contrasena: strong },
            })
          ).status,
          401,
        );
        assert.equal(
          (
            await call("/login", {
              method: "POST",
              data: {
                username: "user@example.test",
                contrasena: "New-Password9$",
              },
            })
          ).status,
          200,
        );
        assert.equal(
          (
            await call("/usuarios/restablecerContrasena", {
              method: "POST",
              data: {
                correo: "user@example.test",
                codigo: code,
                contrasena: "Another-Password9$",
              },
            })
          ).status,
          400,
        );
      },
    );
    await t.test(
      "fallo SMTP no cambia la contraseña y descarta la clave",
      async () => {
        mailFails = true;
        const r = await call("/usuarios/olvidarContrasena", {
          method: "POST",
          data: { correo: "admin@example.test" },
        });
        mailFails = false;
        assert.equal(r.status, 500);
        const user = await Users.findById(admin.usuario._id).select(
          "+recoveryHash",
        );
        assert.equal(user.recoveryHash, undefined);
        assert.equal(
          (
            await call("/login", {
              method: "POST",
              data: { username: "admin@example.test", contrasena: strong },
            })
          ).status,
          200,
        );
      },
    );
    await t.test("clave vencida se rechaza", async () => {
      await Users.updateOne(
        { _id: admin.usuario._id },
        {
          $set: {
            recoveryHash: "expired",
            recoveryExpires: new Date(Date.now() - 1000),
            recoveryAttempts: 0,
          },
        },
      );
      assert.equal(
        (
          await call("/usuarios/restablecerContrasena", {
            method: "POST",
            data: {
              correo: "admin@example.test",
              codigo: "Expired1.$",
              contrasena: strong,
            },
          })
        ).status,
        400,
      );
    });

    await t.test(
      "cinco intentos incorrectos bloquean la clave aunque luego sea correcta",
      async () => {
        const { hashCode } = await import("../ayudas/recovery.js");
        const code = "Abc12345.$";
        await Users.updateOne(
          { _id: normal.usuario._id },
          {
            $set: {
              recoveryHash: hashCode(code),
              recoveryExpires: new Date(Date.now() + 60000),
              recoveryAttempts: 0,
            },
          },
        );
        for (let i = 0; i < 5; i++)
          assert.equal(
            (
              await call("/usuarios/restablecerContrasena", {
                method: "POST",
                data: {
                  correo: "user@example.test",
                  codigo: "Wrong123.$",
                  contrasena: strong,
                },
              })
            ).status,
            400,
          );
        assert.equal(
          (
            await call("/usuarios/restablecerContrasena", {
              method: "POST",
              data: {
                correo: "user@example.test",
                codigo: code,
                contrasena: strong,
              },
            })
          ).status,
          400,
        );
      },
    );
    await t.test(
      "duplicados antiguos se conservan pero no producen sesiones ambiguas",
      async () => {
        await Users.collection.insertMany([
          {
            nombre: "Antiguo 1",
            correo: "legacy@example.test",
            contrasena: "unused",
            rol: "usuario",
          },
          {
            nombre: "Antiguo 2",
            correo: "LEGACY@example.test",
            contrasena: "unused",
            rol: "usuario",
          },
        ]);
        assert.equal(
          (
            await call("/login", {
              method: "POST",
              data: { username: "legacy@example.test", contrasena: strong },
            })
          ).status,
          409,
        );
        assert.equal(
          (
            await call("/usuarios", {
              method: "POST",
              data: {
                nombre: "Duplicado nuevo",
                correo: "Legacy@example.test",
                contrasena: strong,
              },
            })
          ).status,
          409,
        );
        assert.equal(await Users.countDocuments({ nombre: /^Antiguo/ }), 2);
      },
    );
    await t.test(
      "índice normalizado evita dos cuentas nuevas con el mismo correo",
      async () => {
        await assert.rejects(
          Users.create({
            nombre: "Carrera",
            correo: "user@example.test",
            emailKey: "user@example.test",
            contrasena: "unused",
          }),
          { code: 11000 },
        );
      },
    );
    await t.test("eliminar publicaciones actualiza listados", async () => {
      assert.equal(
        (
          await call("/productos/" + productId, {
            method: "DELETE",
            token: admin.datos,
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await call("/noticias/" + newsId, {
            method: "DELETE",
            token: admin.datos,
          })
        ).status,
        200,
      );
      assert.equal((await call("/productos")).body.datos.length, 0);
      assert.equal((await call("/noticias")).body.datos.length, 0);
    });
    await t.test("cerrar sesión invalida el token en el servidor", async () => {
      assert.equal(
        (await call("/login/logout", { method: "POST", token: admin.datos }))
          .status,
        200,
      );
      assert.equal(
        (await call("/login/me", { token: admin.datos })).status,
        401,
      );
    });
    await t.test("limitación de intentos devuelve 429", async () => {
      let r;
      for (let i = 0; i < 20; i++) {
        r = await call("/login", {
          method: "POST",
          data: { username: "bad", contrasena: "bad" },
        });
        if (r.status === 429) break;
      }
      assert.equal(r.status, 429);
      assert.ok(r.headers.get("retry-after"));
    });
  });
} finally {
  if (server) {
    server.close();
    await once(server, "close");
  }
  if (
    mongoose.connection.readyState === 1 &&
    mongoose.connection.name === testDb &&
    testDb.startsWith("grupobikes_test_")
  )
    await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  nodemailer.createTransport = originalTransport;
  if (
    path.resolve(uploadDir).startsWith(path.resolve(tmpdir()) + path.sep) &&
    path.basename(uploadDir).startsWith("grupobikes-test-")
  )
    await rm(uploadDir, { recursive: true, force: true });
}
