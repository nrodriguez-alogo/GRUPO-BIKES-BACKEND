import { Router } from "express";
import controladorUsuario from "../driver/driverUsuario.js";

const rutaUsuarios = Router();

rutaUsuarios.post('/', controladorUsuario.crearUsuario);
rutaUsuarios.get('/', controladorUsuario.leerUsuario);
rutaUsuarios.get('/:id', controladorUsuario.leerUsuarioId);
rutaUsuarios.put('/:id',  controladorUsuario.actualizarUsuario);
rutaUsuarios.delete('/:id', controladorUsuario.borrarUsuario);

export default rutaUsuarios;