import { request } from 'express';
import modeloUsuarios from '../modelos/modeloUsuarios.js';
import { uploadImage } from '../middlewares/resources.js';
import fs from 'fs';
import path from 'path';

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

                const nuevoUsuario = new modeloUsuarios ({
                    nombre: req.body.nombre,
                    correo: req.body.correo,
                    imagen: req.file ? req.file.filename : null,
                    contraseña: req.body.contraseña,
                    rol: req.body.rol
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
                mensaje: 'usuarioencontrado exitosamente',
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
                    return res.status(400).json({ mensaje: 'eror actaulizando el usuario, verifique', datos: error});
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
                    contraseña: req.body.contraseña || usuarioExistente.contraseña,
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

export default controladorUsuario;