import Users from "../modelos/modeloUsuarios.js";
import { verificarToken } from "../ayudas/funciones.js";
export async function authenticate(req, res, next) {
  const match = /^Bearer ([A-Za-z0-9_.-]+)$/.exec(
    req.headers.authorization || "",
  );
  if (!match)
    return res.status(401).json({ mensaje: "Inicia sesión para continuar." });
  let payload;
  try {
    payload = verificarToken(match[1]);
  } catch {
    return res.status(401).json({ mensaje: "La sesión expiró o es inválida." });
  }
  if (!/^[a-f0-9]{24}$/i.test(payload.id || ""))
    return res.status(401).json({ mensaje: "Sesión inválida." });
  const user = await Users.findById(payload.id).select("+tokenVersion");
  if (!user || (user.tokenVersion || 0) !== payload.version)
    return res.status(401).json({ mensaje: "La sesión ya no es válida." });
  req.user = user;
  next();
}
export function admin(req, res, next) {
  if (req.user?.rol !== "administrador")
    return res
      .status(403)
      .json({ mensaje: "Esta operación requiere una cuenta administradora." });
  next();
}
export function ownerOrAdmin(req, res, next) {
  if (
    req.user.rol !== "administrador" &&
    String(req.user._id) !== req.params.id
  )
    return res
      .status(403)
      .json({ mensaje: "No tienes permiso para acceder a esta cuenta." });
  next();
}
