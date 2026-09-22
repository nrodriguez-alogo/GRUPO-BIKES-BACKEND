import modeloUsuarios from "../modelos/modeloUsuarios.js";
import { generarToken, verificarToken } from "../ayudas/funciones.js";
import bcrypt from "bcrypt";

const controladorLogin = {
    login: async(req, res)=>{
        console.log(req.body);
        try {
/*revisar nombre de usuario*/const{username, contrasena}=req.body;
console.log('1. Entró al login');
const encontrarUsuario = await modeloUsuarios
.findOne({correo:username})
.select('+contrasena');

console.log('3. Usuario encontrado:', encontrarUsuario.contrasena);
console.log('data (Postman):', contrasena);
console.log('hash (MongoDB):', encontrarUsuario.contrasena);

const validacionContrasena = await bcrypt.compare(contrasena, encontrarUsuario.contrasena);
console.log('4. Contrasena válida:', validacionContrasena);

if (validacionContrasena){
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
        if(validar && validacion.id){
            res.json({
                mensaje: 'Token invalido',
                datos: null,
            });

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