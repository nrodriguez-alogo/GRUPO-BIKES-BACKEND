import Products from "../modelos/modeloProductos.js";
import { product } from "../ayudas/validacion.js";
import { crud } from "./crud.js";
export default crud(Products, product);
