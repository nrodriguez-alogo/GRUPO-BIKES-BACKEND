import path from "node:path";
import { fileURLToPath } from "node:url";
export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const IMAGE_ROOT = path.resolve(
  process.env.UPLOAD_DIR || path.join(ROOT, "imagenes"),
);
export function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Configura JWT_SECRET con al menos 32 caracteres.");
  return secret;
}
export const allowedOrigins = () =>
  (
    process.env.FRONTEND_ORIGINS ||
    "http://localhost:4200,http://127.0.0.1:4200"
  )
    .split(",")
    .map((x) => x.trim());
