import { Router } from "express";
import controladorProducto from "../driver/driverProductos.js";

const rutaProductos = Router();

rutaProductos.post('/', controladorProducto.crearProducto);
rutaProductos.get('/', controladorProducto.leerProductos);
rutaProductos.get('/:id', controladorProducto.leerProductoId);
rutaProductos.put('/:id', controladorProducto.actualizarProducto);
rutaProductos.delete('/:id', controladorProducto.borrarProducto);

export default rutaProductos;