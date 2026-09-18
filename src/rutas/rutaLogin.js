import { Router } from "express";
import controladorLogin from "../driver/driverLogin";

const rutalogin = Router();
rutalogin.post('/', controladorLogin,login);
rutalogin.get('/token/:token2', controladorLogin. validarToken);

export default rutalogin;
