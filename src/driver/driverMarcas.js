import { request } from 'express';
import modeloMarcas from '../modelos/modeloMarcas.js';
import { uploadImage } from '../middlewares/resources.js';
import fs from 'fs';
import path from 'path';

const contMarca = {
    crearMarca : async (req, res) => {
        try {

            uploadImage (req, res, async (error)=>{
                if(error){
                    return res.json({
                        mensaje: 'Ocurrio un error cargando la imagen',
                        datos: error
                    });
                }

                const nuevaMarca = new modeloMarcas({
                    nombre: req.body.nombre,
                    paisOrigen: req.body.paisOrigen,
                    empresa: req.body.empresa,
                    imagen: req.file.filename,
                    descripcion: req.body.descripcion
                })

                const guardarMarca = await nuevaMarca.save();

                res.json({
                    mensaje: 'Marca creada.',
                    datos: guardarMarca
                });
            
            });

        } catch (error) {
            res.json({
                mensaje: 'Ocurrió un error al crear la marca.',
                datos: error
            })
        }
        },
    
    

    leerMarca : async (req, res) => {
        try {
            const marcaEncontrada = await modeloMarcas.findById(req.params.id);
            if(marcaEncontrada.id){
                res.json({
                    mensaje: 'Marca encontrada',
                    datos: marcaEncontrada,
                })
            }
        } catch (error) {
            res.json({
                mensaje: 'Ocurrió un error al buscar la marca',
                datos: error,
            })
        }

    },

    actualizarMarca : async (req, res) => {
       try {
            const actualizarFoto = await modeloMarcas.findById(
                req.params.id
            );
            if(!actualizarFoto){
                if(req.file){
                    fs.unlinkSync(req.file.path);
                }
                res.json({
                    mensaje: 'Marca no encontrada',
                    datos: null,
                });
            }
            if(req.file){
                if(actualizarFoto.imagen){
                    const actualizarLogo = path.join('imagenes', actualizarFoto.imagen);
                    if(fs.existsSync(actualizarLogo)){
                        fs.unlinkSync(actualizarLogo);
                    }
                }
            }
            const nuevoModeloMarca = {
                nombre: req.body.nombre,
                paisOrigen: req.body.paisOrigen,
                empresa: req.body.empresa,
                imagen: req.file ? req.file.filename : actualizarFoto.imagen,
                descripcion: req.body.descripcion
            }

            const actualizarMarca = await modeloMarcas.findByIdAndUpdate(
                req.params.id, nuevoModeloMarca,{
                    new: true
                });
            return res.json({
                mensaje: 'Marca actualizada',
                datos: actualizarMarca,
            });
            console.log(nuevoModeloMarca);
            console.log(actualizarMarca);

       } catch (error) {
            res.json({
                mensaje: 'Error al actualizar la marca',
                datos: error
            })
       } 

    },

    eliminarMarca : async (req, res) => {
        try {
        const marcaParaEliminar = await modeloMarcas.findByIdAndDelete(
            req.params.id
        );

        if(!marcaParaEliminar){
            res.json({
                mensaje: "Marca no encontrada para eliminar.",
                datos: error,
            })
        }

        if(marcaParaEliminar.imagen){
            const rutaFoto = path.join('imagenes', marcaParaEliminar.imagen);

            if(fs.existsSync(rutaFoto)){
                fs.unlinkSync(rutaFoto);
            }
        }

        res.json({
            mensaje: "Marca eliminada correctamente.",
            datos: null,
        });

       } catch (error) {
            res.json({
                mensaje: "Error al eliminar la marca",
                datos: error,
            });
       } 
    },

    leerMarcas : async (req, res) => {
        try {
            const marcasEncontradas = await modeloMarcas.find();
            
                res.json({
                    mensaje: 'Marcas encontradas',
                    datos: marcasEncontradas,
                })
        
        } catch (error) {
            res.json({
                mensaje: 'Ocurrió un error al buscar la marca',
                datos: error,
            })
        }

    },
}


export default contMarca;