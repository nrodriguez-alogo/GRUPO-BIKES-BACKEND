import { Router } from "express";
import controladorLogin from "../driver/driverLogin.js";

const rutalogin = Router();
rutalogin.post('/', controladorLogin.login);
rutalogin.post('/token/:token', controladorLogin. validarToken);

export default rutalogin;
