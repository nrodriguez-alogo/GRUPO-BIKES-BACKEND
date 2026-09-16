import { Router } from "express";
import { 
    obtenerUsuarios, 
    crearUsuario, 
    actualizarUsuario, 
    eliminarUsuario 
} from "../driver/driverUsuario.js";

const rutaUsuarios = Router();

rutaUsuarios.get('/', obtenerUsuarios);
rutaUsuarios.post('/', crearUsuario);
rutaUsuarios.put('/:id', actualizarUsuario);
rutaUsuarios.delete('/:id', eliminarUsuario);

export default rutaUsuarios;