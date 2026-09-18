import modeloUsuarios from "../modelos/modeloUsuarios.js";
import { generarToken, verificarToken } from "../ayudas/funciones.js";
import bcrypt from "bcrypt";

const controladorLogin = {
    login: async(req, res)=>{
        try {
/*revisar nombre de usuario*/const{username, contraseña}=req.body;
const encontrarUsuario = await modeloUsuarios.findOne({
    correo:username,//Se asigna el correo como "username"
});
const validacionContraseña = bcrypt.compare(contraseña, encontrarUsuario.contraseña);
if (validacionContraseña){
    const token = await generarToken (
        {
            id : encontrarUsuario._id,
            nombre: encontrarUsuario.nombre,
            imagen: encontrarUsuario.imagen,
            rol: encontrarUsuario.rol,
        });
        res.json({
            mensaje: `Bienvenido ${encontrarUsuario.nombre}`,
            datos: token,
        });
    }
     else {res.json({mensaje:'Contraseña o usuario incorrecto',
        datos:null,
     });
    }
        } catch (error) {
            res.json({
                mensaje: 'Error al logear',
                datos: error,
            });
            
        }
    },


validarToken: async (req, res) =>{
    try {
        const token2 = req.param.token;
        const validar = await verificarToken(token2);
        if(validar && validacion.id){
            res.json({
                mensaje: 'Token invalido',
                datos: null,
            });

        }
    
    } catch (error) {
        res.json({
            mensaje: 'Ocurrio un error al validar el token',
            datos: error,
        });
        
    }
}
}

export default controladorLogin;