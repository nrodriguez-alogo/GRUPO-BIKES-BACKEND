import { Router } from "express";
import controller from "../driver/driverUsuario.js";
import { requestRecovery, resetPassword } from "../driver/driverRecovery.js";
import { authenticate, admin, ownerOrAdmin } from "../middlewares/auth.js";
import { receiveImage } from "../middlewares/resources.js";
import { id } from "../ayudas/validacion.js";
import { rateLimit } from "../middlewares/rate-limit.js";
const router = Router();
router.post("/", rateLimit({ max: 10 }), receiveImage, controller.crearUsuario);
router.post("/olvidarContrasena", rateLimit({ max: 5 }), requestRecovery);
router.post("/restablecerContrasena", rateLimit({ max: 10 }), resetPassword);
router.use(authenticate);
router.get("/", admin, controller.leerUsuario);
router.get("/:id", id, ownerOrAdmin, controller.leerUsuarioId);
router.put(
  "/:id",
  id,
  ownerOrAdmin,
  rateLimit({ max: 20 }),
  receiveImage,
  controller.actualizarUsuario,
);
router.delete("/:id", id, admin, controller.borrarUsuario);
export default router;
