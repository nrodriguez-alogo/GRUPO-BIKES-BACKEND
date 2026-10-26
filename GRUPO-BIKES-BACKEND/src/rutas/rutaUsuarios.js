import { Router } from "express";
import controladorUsuario, {olvidarContrasena} from "../driver/driverUsuario.js";



const rutaUsuarios = Router();

rutaUsuarios.post('/', controladorUsuario.crearUsuario);
rutaUsuarios.get('/', controladorUsuario.leerUsuario);
rutaUsuarios.get('/:id', controladorUsuario.leerUsuarioId);
rutaUsuarios.put('/:id',  controladorUsuario.actualizarUsuario);
rutaUsuarios.delete('/:id', controladorUsuario.borrarUsuario);
rutaUsuarios.post('/olvidarContrasena', olvidarContrasena);

export default rutaUsuarios;