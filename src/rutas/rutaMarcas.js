import contMarca from "../driver/driverMarcas.js";
import { Router } from "express";
import { uploadImage } from "../middlewares/resources.js";


const marcasRoutes = Router();

marcasRoutes.post('/', contMarca.crearMarca);
marcasRoutes.get('/:id', contMarca.leerMarca);
marcasRoutes.put('/:id', uploadImage, contMarca.actualizarMarca);
marcasRoutes.delete('/:id', contMarca.eliminarMarca);

export default marcasRoutes;
