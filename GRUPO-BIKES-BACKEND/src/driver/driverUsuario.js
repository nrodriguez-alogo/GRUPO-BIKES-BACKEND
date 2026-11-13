import Users from "../modelos/modeloUsuarios.js";
import bcrypt from "bcrypt";
import { timingSafeEqual, createHash } from "node:crypto";
import { storeImage, removeImage } from "../middlewares/resources.js";
import { email, password, text, fail } from "../ayudas/validacion.js";
import { session, publicUser } from "../ayudas/funciones.js";
function allowedAdmin(code) {
  const expected = process.env.ADMIN_REGISTRATION_CODE;
  return (
    expected &&
    typeof code === "string" &&
    timingSafeEqual(
      createHash("sha256").update(code).digest(),
      createHash("sha256").update(expected).digest(),
    )
  );
}
export default {
  async crearUsuario(req, res) {
    const body = req.body || {};
    const nombre = text(body.nombre, "Nombre", 100);
    const correo = email(body.correo);
    const plain = password(body.contrasena);
    const rol = body.rol || "usuario";
    if (!["usuario", "administrador"].includes(rol)) fail(400, "Rol inválido.");
    if (rol === "administrador" && !allowedAdmin(body.codigoAdministrador))
      fail(403, "El código de invitación de administrador es inválido.");
    if (await Users.exists({ correo }).collation({ locale: "en", strength: 2 }))
      fail(409, "Ya existe una cuenta con ese correo.");
    const hash = await bcrypt.hash(plain, 12);
    const imagen = req.file
      ? await storeImage(req, "usuarios")
      : "usuarios/default-user.svg";
    const user = await Users.create({
      nombre,
      correo,
      emailKey: correo,
      contrasena: hash,
      rol,
      imagen,
    });
    res.status(201).json(session(user));
  },
  async leerUsuario(req, res) {
    res.json({ datos: await Users.find().sort({ _id: -1 }).limit(100) });
  },
  async leerUsuarioId(req, res) {
    const user = await Users.findById(req.params.id);
    if (!user) fail(404, "Cuenta no encontrada.");
    res.json({ datos: publicUser(user) });
  },
  async actualizarUsuario(req, res) {
    const body = req.body || {};
    if (body.rol !== undefined)
      fail(400, "No se permite cambiar el rol desde este formulario.");
    const user = await Users.findById(req.params.id);
    if (!user) fail(404, "Cuenta no encontrada.");
    const data = {};
    if (body.nombre !== undefined)
      data.nombre = text(body.nombre, "Nombre", 100);
    if (body.correo !== undefined) {
      data.correo = email(body.correo);
      if (
        await Users.exists({
          _id: { $ne: user._id },
          correo: data.correo,
        }).collation({ locale: "en", strength: 2 })
      )
        fail(409, "Ya existe una cuenta con ese correo.");
      data.emailKey = data.correo;
    }
    if (body.contrasena !== undefined) {
      if (String(req.user._id) !== req.params.id)
        fail(
          403,
          "Usa la recuperación para cambiar la contraseña de otra cuenta.",
        );
      const current = await Users.findById(req.params.id).select("+contrasena");
      if (
        typeof body.contrasenaActual !== "string" ||
        !(await bcrypt.compare(body.contrasenaActual, current.contrasena))
      )
        fail(401, "La contraseña actual no es correcta.");
      data.contrasena = await bcrypt.hash(password(body.contrasena), 12);
      data.tokenVersion = (req.user.tokenVersion || 0) + 1;
      data.recoveryHash = null;
      data.recoveryExpires = null;
    }
    if (req.file) data.imagen = await storeImage(req, "usuarios");
    if (!Object.keys(data).length) fail(400, "No se recibieron cambios.");
    const updated = await Users.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );
    if (data.imagen) await removeImage(user.imagen);
    res.json({ datos: publicUser(updated), mensaje: "Cuenta actualizada." });
  },
  async borrarUsuario(req, res) {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) fail(404, "Cuenta no encontrada.");
    await removeImage(user.imagen);
    res.json({ mensaje: "Cuenta eliminada." });
  },
};
