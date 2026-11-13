import { Router } from "express";
import controller from "../driver/driverLogin.js";
import { authenticate } from "../middlewares/auth.js";
import { rateLimit } from "../middlewares/rate-limit.js";
const router = Router();
router.post("/", rateLimit({ max: 15 }), controller.login);
router.get("/me", authenticate, controller.validarToken);
router.post("/logout", authenticate, async (req, res) => {
  const { default: Users } = await import("../modelos/modeloUsuarios.js");
  await Users.updateOne({ _id: req.user._id }, { $inc: { tokenVersion: 1 } });
  res.json({ mensaje: "Sesión cerrada." });
});
export default router;
