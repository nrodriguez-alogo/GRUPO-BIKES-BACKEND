import jwt from "jsonwebtoken";
import { jwtSecret } from "../config.js";
export function generarToken(user) {
  return jwt.sign(
    { id: String(user._id || user.id), version: user.tokenVersion || 0 },
    jwtSecret(),
    {
      algorithm: "HS256",
      expiresIn: "1h",
      issuer: "grupo-bikes",
      audience: "grupo-bikes-web",
    },
  );
}
export function verificarToken(token) {
  return jwt.verify(token, jwtSecret(), {
    algorithms: ["HS256"],
    issuer: "grupo-bikes",
    audience: "grupo-bikes-web",
  });
}
export function publicUser(user) {
  return {
    _id: String(user._id),
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol,
    imagen: user.imagen,
  };
}
export function session(user) {
  return {
    resultado: "bien",
    mensaje: "Sesión iniciada.",
    datos: generarToken(user),
    usuario: publicUser(user),
  };
}
