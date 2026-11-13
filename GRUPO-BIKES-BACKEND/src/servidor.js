import express from "express";
import cors from "cors";
import { IMAGE_ROOT, allowedOrigins } from "./config.js";
import productos from "./rutas/rutaProductos.js";
import usuarios from "./rutas/rutaUsuarios.js";
import noticias from "./rutas/rutaAnuncios.js";
import marcas from "./rutas/rutaMarcas.js";
import login from "./rutas/rutaLogin.js";
import { errors } from "./middlewares/errors.js";
import { rateLimit } from "./middlewares/rate-limit.js";
export function createServer() {
  const app = express();
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    });
    next();
  });
  app.use(
    cors({
      origin: allowedOrigins(),
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(rateLimit({ max: 300, windowMs: 60000 }));
  app.use(express.json({ limit: "64kb" }));
  app.use(express.urlencoded({ extended: false, limit: "64kb" }));
  app.use(
    "/imagenes",
    express.static(IMAGE_ROOT, {
      dotfiles: "deny",
      index: false,
      maxAge: "1d",
      setHeaders: (res) =>
        res.set("Content-Security-Policy", "default-src 'none'; sandbox"),
    }),
  );
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.get("/", (req, res) =>
    res.json({ mensaje: "API de Grupo Bikes disponible." }),
  );
  app.use("/productos", productos);
  app.use("/usuarios", usuarios);
  app.use("/noticias", noticias);
  app.use("/marcas", marcas);
  app.use("/login", login);
  app.use((req, res) =>
    res.status(404).json({ mensaje: "Ruta no encontrada." }),
  );
  app.use(errors);
  return app;
}
export default createServer();
