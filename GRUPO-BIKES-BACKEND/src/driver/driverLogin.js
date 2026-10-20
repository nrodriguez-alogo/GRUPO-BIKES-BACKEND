import modeloUsuarios from "../modelos/modeloUsuarios.js";
import { generarToken, verificarToken } from "../ayudas/funciones.js";
import bcrypt from "bcrypt";

const controladorLogin = {
    login: async(req, res)=>{
        try {
const{correo, contrasena}=req.body;
const encontrarUsuario = await modeloUsuarios.findOne({correo:correo});
const validacionContrasena = await bcrypt.compare(contrasena, encontrarUsuario.contrasena);
if (validacionContrasena){
    const token = await generarToken (
        {
            id : encontrarUsuario._id,
            nombre: encontrarUsuario.nombre,
            imagen: encontrarUsuario.imagen,
            rol: encontrarUsuario.rol, /* SE DEBE USAR EN POSTMAN "CORREO" y "CONTRASENA" */
        });
        res.json({
            mensaje: `Bienvenido ${encontrarUsuario.nombre}`,
            datos: token,
        });
    }
     else {res.json({mensaje:'Contrasena o usuario incorrecto',
        datos:null,
     });
    }
        } catch (error) {
            res.json({
                mensaje: 'Error al logear',
                datos: error.message,
            });
            
        }
    },
validarToken: async (req, res) =>{
    try {
        const token2 = req.params.token;
        const validar = await verificarToken(token2);
        if (validar && validar.id) {
            res.json({ mensaje: 'Token valido', datos: validar });
        } else {
            res.status(401).json({ mensaje: 'Token inválido', datos: null });
        }
    
    } catch (error) {
        res.json({
            mensaje: 'Ocurrio un error al validar el token',
            datos: error.message,
        });
    }
}
}
export default controladorLogin;