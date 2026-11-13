import Users from "../modelos/modeloUsuarios.js";
import bcrypt from "bcrypt";
import { email, fail } from "../ayudas/validacion.js";
import { session, publicUser } from "../ayudas/funciones.js";
const dummyHash = await bcrypt.hash("Not-a-real-account-password-7$", 12);
export default {
  async login(req, res) {
    const correo = email(req.body?.username);
    const password = req.body?.contrasena;
    if (
      typeof password !== "string" ||
      !password ||
      Buffer.byteLength(password) > 72
    )
      fail(400, "Ingresa tu contraseña.");
    const candidates = await Users.find({ correo })
      .collation({ locale: "en", strength: 2 })
      .limit(2)
      .select("+contrasena +tokenVersion");
    if (candidates.length > 1)
      fail(
        409,
        "Hay varias cuentas con este correo. Contacta al responsable de Grupo Bikes para unificarlas.",
      );
    const user = candidates[0];
    const ok = await bcrypt.compare(password, user?.contrasena || dummyHash);
    if (!user || !ok) fail(401, "Correo o contraseña incorrectos.");
    res.json(session(user));
  },
  validarToken(req, res) {
    res.json({ resultado: "bien", datos: publicUser(req.user) });
  },
};
