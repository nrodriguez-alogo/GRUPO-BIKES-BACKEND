import nodemailer from "nodemailer";
import { fail } from "./validacion.js";
export function mailer() {
  const user = process.env.SMTP_USER || process.env.EMAIL_NODE;
  const pass = process.env.SMTP_PASS || process.env.PASS_NODE;
  if (!user || !pass || (!process.env.MAIL_FROM && !process.env.EMAIL_NODE))
    fail(503, "El servicio de correo no está configurado.");
  return nodemailer.createTransport({
    ...(process.env.SMTP_HOST
      ? {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
        }
      : { service: "gmail" }),
    auth: { user, pass },
    requireTLS: process.env.SMTP_SECURE !== "true",
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });
}
export async function sendRecovery(user, code) {
  const transport = mailer();
  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.EMAIL_NODE,
      to: user.correo,
      subject: "Tu clave de recuperación de Grupo Bikes",
      text:
        "Hola " +
        user.nombre +
        ",\n\nTu clave de recuperación es: " +
        code +
        "\n\nVence en 15 minutos y solo se puede usar una vez. Ingrésala en Recuperar cuenta y elige una nueva contraseña. Si no solicitaste este correo, ignóralo. Tu contraseña no ha cambiado.",
    });
  } finally {
    transport.close();
  }
}
