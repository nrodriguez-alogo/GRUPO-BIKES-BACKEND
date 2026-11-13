export function fail(status, mensaje) {
  const e = new Error(mensaje);
  e.status = status;
  throw e;
}
export function text(value, name, max = 200, min = 1) {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  )
    fail(400, name + ": campo obligatorio o longitud inválida.");
  return value.trim().replace(/\r\n?/g, "\n");
}
export function email(value) {
  const v = text(value, "Correo", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    fail(400, "Correo electrónico inválido.");
  return v;
}
export function password(value) {
  if (
    typeof value !== "string" ||
    value.length < 8 ||
    Buffer.byteLength(value, "utf8") > 72 ||
    !/[a-z]/.test(value) ||
    !/[A-Z]/.test(value) ||
    !/[0-9]/.test(value) ||
    !/[^a-zA-Z0-9\s]/.test(value) ||
    /\s/.test(value)
  )
    fail(
      400,
      "La contraseña necesita 8 caracteres como mínimo, mayúscula, minúscula, número y símbolo (máximo 72 bytes).",
    );
  return value;
}
export function number(value, name, max) {
  if (
    !["number", "string"].includes(typeof value) ||
    String(value).trim() === "" ||
    !Number.isFinite(Number(value)) ||
    Number(value) <= 0 ||
    Number(value) > max
  )
    fail(400, name + ": debe ser un número positivo válido.");
  return Number(value);
}
export function id(req, res, next) {
  if (!/^[a-f0-9]{24}$/i.test(req.params.id))
    return res.status(400).json({ mensaje: "Identificador inválido." });
  next();
}
export function product(body) {
  const data = {};
  for (const k of [
    "marca",
    "modelo",
    "descripcion",
    "color",
    "categoria",
    "estado",
  ])
    data[k] = text(body[k], k, k === "descripcion" ? 2000 : 100);
  if (!["Nuevas", "Usadas"].includes(data.categoria))
    fail(400, "Categoría inválida.");
  data.precio = number(body.precio, "Precio", 1e12);
  data.cilindraje = number(body.cilindraje, "Cilindraje", 10000);
  return data;
}
export function article(body) {
  return {
    titulo: text(body.titulo, "Título", 160),
    subtitulo: text(body.subtitulo, "Subtítulo", 300),
    contenido: text(body.contenido, "Artículo", 30000),
    autor: text(body.autor, "Autor", 100),
  };
}
