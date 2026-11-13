import Users from "../modelos/modeloUsuarios.js";
import bcrypt from "bcrypt";
import { email, password, fail } from "../ayudas/validacion.js";
import { recoveryCode, hashCode } from "../ayudas/recovery.js";
import { mailer, sendRecovery } from "../ayudas/mail.js";
const selection =
  "+recoveryHash +recoveryExpires +recoveryIssuedAt +recoveryAttempts";
const generic = {
  mensaje:
    "Si el correo está registrado, recibirás una clave de recuperación. Revisa también la carpeta de spam.",
};
export async function requestRecovery(req, res) {
  const correo = email(req.body?.correo);
  const transport = mailer();
  transport.close();
  const candidates = await Users.find({ correo })
    .collation({ locale: "en", strength: 2 })
    .limit(2)
    .select(selection);
  if (candidates.length > 1)
    fail(
      409,
      "Hay varias cuentas con este correo. Contacta al responsable de Grupo Bikes para unificarlas.",
    );
  const user = candidates[0];
  if (!user) return res.json(generic);
  if (
    user.recoveryIssuedAt &&
    Date.now() - user.recoveryIssuedAt.getTime() < 60000
  )
    return res.json(generic);
  const code = recoveryCode(),
    hash = hashCode(code),
    now = new Date();
  const claimed = await Users.findOneAndUpdate(
    { _id: user._id, recoveryIssuedAt: user.recoveryIssuedAt || null },
    {
      $set: {
        recoveryHash: hash,
        recoveryExpires: new Date(Date.now() + 15 * 60000),
        recoveryIssuedAt: now,
        recoveryAttempts: 0,
      },
    },
    { returnDocument: "after" },
  );
  if (!claimed) return res.json(generic);
  try {
    await sendRecovery(user, code);
  } catch (error) {
    await Users.updateOne(
      { _id: user._id, recoveryHash: hash },
      { $unset: { recoveryHash: 1, recoveryExpires: 1, recoveryIssuedAt: 1 } },
    );
    throw error;
  }
  res.json(generic);
}
export async function resetPassword(req, res) {
  const correo = email(req.body?.correo);
  const code = req.body?.codigo;
  const plain = password(req.body?.contrasena);
  if (typeof code !== "string" || !/^[A-Za-z0-9.\-$]{10}$/.test(code))
    fail(400, "La clave debe tener 10 caracteres.");
  const candidates = await Users.find({ correo })
    .collation({ locale: "en", strength: 2 })
    .limit(2);
  if (candidates.length !== 1) fail(400, "Clave inválida o vencida.");
  const user = await Users.findOneAndUpdate(
    {
      _id: candidates[0]._id,
      recoveryExpires: { $gt: new Date() },
      recoveryAttempts: { $lt: 5 },
    },
    { $inc: { recoveryAttempts: 1 } },
    { returnDocument: "after" },
  ).select(selection);
  if (!user || !user.recoveryHash || hashCode(code) !== user.recoveryHash)
    fail(
      400,
      "Clave inválida, vencida o sin intentos disponibles. Solicita una nueva.",
    );
  const hash = await bcrypt.hash(plain, 12);
  const changed = await Users.findOneAndUpdate(
    {
      _id: user._id,
      recoveryHash: user.recoveryHash,
      recoveryExpires: { $gt: new Date() },
    },
    {
      $set: { contrasena: hash },
      $inc: { tokenVersion: 1 },
      $unset: {
        recoveryHash: 1,
        recoveryExpires: 1,
        recoveryIssuedAt: 1,
        recoveryAttempts: 1,
      },
    },
  );
  if (!changed) fail(400, "La clave venció o ya fue utilizada.");
  res.json({
    mensaje: "Contraseña actualizada. Inicia sesión con tu nueva contraseña.",
  });
}
