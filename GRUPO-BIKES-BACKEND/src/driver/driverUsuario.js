import { request } from 'express';
import modeloUsuarios from '../modelos/modeloUsuarios.js';
import { uploadImage } from '../middlewares/resources.js';
import fs from 'fs';
import path from 'path';
import bcrypt from "bcrypt";
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const controladorUsuario = {
    crearUsuario: async (req, res) => {
        try {
            uploadImage(req, res, async (error) => {
                if (error) {
                    return res.status(400).json({
                        mensaje: 'ocurrio error al cargar la imagen',
                        datos: error
                    });
                }
                console.log('Keys:', Object.keys(req.body));
                const contrasenaHash = await bcrypt.hash(req.body.contrasena, 10);
                const nuevoUsuario = new modeloUsuarios ({
                    nombre: req.body.nombre, 
                    correo: req.body.correo,
                    imagen: req.body.file,
                    contrasena: contrasenaHash,
                    rol: req.body.rol || 'usuario'
                });

                const guardarUsuario = await nuevoUsuario.save();

                res.status(201).json({
                    mensaje: 'usuario creado exitosamente',
                    datos: guardarUsuario
                });
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'ocurrio error creando el usuario',
                datos: error.message
            });
        }
    },
    leerUsuario: async (req, res) => {
        try {
            const usuario = await modeloUsuarios.find();
            res.status(200).json({
                mensaje: 'usuario encontrado exitosamente',
                datos: usuario
            });
        } catch (error) {
            res.status(500).json ({
                mensaje: 'error buscando el usuario (posiblemente no existe o esta mal escrita)',
                datos: error.message
            });
        }
    },

    leerUsuarioId: async (req, res) => {
        try{
            const usuario = await modeloUsuarios.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ mensaje: 'usuario definitivamente no encontrado xd'});  
            }
            res.status(200).json({
                mensaje: 'usuario encontrado :v',
                datos: usuario
            });
        } catch (error) {
            res.status(500).json ({
                mensaje: 'error buscando el ID (posiblemente no existe o esta mal escrita)',
                datos: error.message
            });
        }
    },

    actualizarUsuario: async (req, res) => {
        try {
            uploadImage(req, res, async (error) => {
                if (error) {
                    return res.status(400).json({ mensaje: 'error actaulizando el usuario, verifique', datos: error});
                }

                const usuarioExistente = await modeloUsuarios.findById(req.params.id);
                if (!usuarioExistente) {
                    if (req.file) fs.unlinkSync(req.file.path);
                    return res.status(404).json({mensaje: 'usuario no encontrado'});
                }
                
                let nuevaimagen1 = usuarioExistente.imagen;
                if (req.file) {
                    if (usuarioExistente.imagen) {
                        const rutaImagenAntigua1 = path.join('imagenes', usuarioExistente.imagen);
                        if (fs.existsSync(rutaImagenAntigua1)) {
                            fs.unlinkSync(rutaImagenAntigua1);
                        }
                    }
                    nuevaimagen1 = req.file.filename;
                }

                const nuevoModeloUsuario = {
                    nombre: req.body.nombre || usuarioExistente.nombre,
                    correo: req.body.correo || usuarioExistente.correo,
                    imagen: nuevaimagen1,
                    contrasena: req.body.contrasena || usuarioExistente.contrasena,
                    rol: req.body.rol || usuarioExistente.rol,
                };

                const usuarioActualizado = await modeloUsuarios.findByIdAndUpdate(
                    req.params.id,
                    nuevoModeloUsuario,
                 { new: true, runValidations: true }
                );

                res.status(200).json({
                    mensaje: 'usuario actializado',
                    datos: usuarioActualizado
                });
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error encontrado, solucionelo rapidamente',
                datos: error.message
            });
        }
    },
    
    borrarUsuario: async (req, res) => {
        try{
            const usuarioBorrar = await modeloUsuarios.findByIdAndDelete(req.params.id);
            if (!usuarioBorrar) {
                return res.status(404).json({mensaje: 'usuario no encontrado'});
            }

            if (usuarioBorrar.imagen) {
                const rutaImagen = path.join('imagen', usuarioBorrar.imagen);
                if (fs.existsSync(rutaImagen)) {
                    fs.unlinkSync(rutaImagen);
                }
            }
            
            res.status(200).json({
                mensaje: 'elminado usuario correctametne',
                datos: null
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'error eliminando cliente'
            });
        }
    }
};

function generarContrasenaAleatoria(){
    return crypto.randomBytes(6).toString('hex'); //La función "ramdomBytes" genera un dato aleatorio. Cuántos datos?
}

export const olvidarContrasena = async (req, res)=> {
    try {
        //Enviar solicitud para verificar si el correo ya existe en la base de datos
        const {correo} = req.body;
        const user = await modeloUsuarios.findOne({correo});
        if(!user){
            res.json({
            resultado:'mistake',
            mensaje: 'El correo ingresado no se encuentra en la base de datos',
            data: null
            });
        }
        //Generar clave temporal y encriptada
        const newContra = generarContrasenaAleatoria();
        const hashContrasena = await bcrypt.hash(newContra, 10);
        user.contrasena = hashContrasena;
        await user.save();//Se guarda la clave encriptada directamente en la bese de datos
        //Realizar la configuración del servicio del correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.EMAIL_NODE,
                pass: process.env.PASS_NODE,
            }
                        
        });
        //Configurar contendio del correo
        const mailOptions = {
            from: process.env.EMAIL_NODE,
            to: correo,  //email que puso el usuario
            subject: 'Recuperación de contraseña',
            text: `Hola ${user.name}, \n\n Tu nueva contraseña temporal es: ${newContra}\n\nRecuerda actualizar tú contraseña en tú perfil por seguridad.\n\nSaludos desde el área de soporte` //Lo que el usuari ve
        }

        await transporter.sendMail(mailOptions);
        res.json({
            resultado:'fine',
            mensaje: 'Se ha enviado una nueva contraseña al correo registrado',
            });
         
    } catch (error) {
        console.log('Error al generar contraseña')
        res.json({
            resultado:'mistake',
            mensaje: 'Error interno en el servidor', error: error.mensaje,
            });
    }
}

export default controladorUsuario;