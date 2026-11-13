import { removeImage } from "./resources.js";
export async function errors(error, req, res, next) {
  if (req.savedImage) await removeImage(req.savedImage);
  if (res.headersSent) return next(error);
  let status = error.status || 500;
  let mensaje = error.message;
  if (error.code === 11000) {
    status = 409;
    mensaje = "Ya existe una cuenta con ese correo.";
  } else if (error.name === "ValidationError" || error.name === "CastError") {
    status = 400;
    mensaje = "Revisa los campos obligatorios y sus valores.";
  } else if (error.name === "MulterError") {
    status = 400;
    mensaje =
      error.code === "LIMIT_FILE_SIZE"
        ? "La imagen no puede superar 5 MB."
        : "El archivo o formulario no es válido.";
  }
  if (status >= 500) {
    mensaje =
      "El servicio no está disponible en este momento. Intenta nuevamente.";
    console.error("Error de servicio:", error.name);
  }
  res.status(status).json({ resultado: "error", mensaje });
}
