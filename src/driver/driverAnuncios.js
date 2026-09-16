import {uploadImage} from '../middlewares/resources.js';
import modeloNoticias from "../modelos/modeloNoticias.js";
import fs from 'fs';
import path from 'path';

const controladorAnuncios = {//Controlador anuncios
    crearAnuncio: async (req, res)=>{//Metodo para crear anuncios
        try {
            uploadImage (req, res , async (error)=>{
                if(error){
                    return res.json({
                        mensaje: 'Ocurrió un error al cargar la imagen',
                        datos: error
                    });
               }
               const nuevoAnuncio = new modeloNoticias({
                    titulo:req.body.titulo,
                    subtitulo:req.body.subtitulo,
                    contenido:req.body.contenido,
                    autor:req.body.autor,
                    imagen:req.file.filename
                });
                const guardarAnuncio = await nuevoAnuncio.save();

                res.json ({
                    mensaje:'Nuevo anuncio creado satisfactoriamente',
                    datos: guardarAnuncio
                });
            });
        } catch (error) {
              res.json ({
                    mensaje:'Ocurrio un error al crear el anuncio',
                    datos: error
                }); 
        }
    },
    leerAnuncio: async (req, res)=>{
        try {
            const leerAnunciosEnontrados = await modeloNoticias.find();
            res.json({
                mensaje: 'Anuncios encontrados correctamente',
                data: leerAnunciosEnontrados,
            })

        } catch (error) {
            res.json({
                mensaje: 'Error al encontrar los anuncios',
                data: error,
            });
        }
    },

    leerAnuncioId: async(req, res)=>{
        try {
            const encontrarAnuncio = await modeloNoticias.findById(req.params.id);
            if(encontrarAnuncio._id){
                res.json({
                    mensaje:'Anuncio encontrado',
                    datos: encontrarAnuncio,
                });
            }
        } catch (error) {
            res.json({
               mensaje:'Ocurrio un error encontrando el anuncio',
                datos: error, 
            });
        }
    },
    actualizarAnuncio: async (req, res) => {
        try {
            const anuncioActualizado = await modeloNoticias.findById(//Se busca el anuncio por el id
                req.params.id
            );//Cuando se encuentra por id, se envía el requerimiento a los parametros del id
            if (!anuncioActualizado) {//Si no existe el anuncio
                if (req.file){
                    fs.unlinkSync(req.file.path);//No existe (unlinkSync)
                }
                res.json({
                    mensaje: 'Anuncio no encontrado',
                    datos: null,
                });
            }  
            if (req.file){//Si existe el anuncio
                if (anuncioActualizado.imagen) {//Si ecneuntra el anuncio y tiene una imagen
                    const actualizarImagen = path.join('imagenes', anuncioActualizado.imagen);//Se crea la constante para cambiar la ruta de esa imagen antigua
                    if (fs.existsSync(actualizarImagen)) {
                        fs.unlinkSync(actualizarImagen);//fs va a quitar la imagen antigua y la reemplazará con la actual
                    }
                }
            }
            const nuevoModeloNoticia = {
                titulo: req.body.titulo,
                subtitulo:req.body.subtitulo,
                contenido:req.body.contenido,
                imagen:req.file ? req.file.filename: anuncioActualizado.imagen,
                autor:req.body
            };

            const modeloNoticiActualizado = await modeloNoticias.findByIdAndUpdate(
                req.params.id, nuevoModeloNoticia, {
                new: true
            });
            return res.json({
                mensaje: 'Anuncio actualizado',
                datos: modeloNoticiActualizado,
            });
            
        } catch (error) {
            res.json({
                mensaje: 'Error al actualizar el anuncio',
                datos: error,
            });
            
            
        }
    },
    borrarAnuncio: async(req, res) =>{
        try {
            const anuncioABorrar = await modeloNoticias.findByIdAndDelete(
                req.params.id
            );
            if(!anuncioABorrar){
                res.json({
                mensaje: "Anuncio no encontrado para eliminar.",
                datos: error,
            })
        }
        if(anuncioABorrar.imagen){
            const rutaImagen = path.join('imagenes', anuncioABorrar.imagen);

            if(fs.existsSync(rutaImagen)){
                fs.unlinkSync(rutaImagen);
            }
        } 

        res.json({
            mensaje: "Anuncio eliminado correctamente.",
            datos: null,
        });
    } catch (error) {
        res.json({
                mensaje: "Error al eliminar el anuncio.",
                datos: error,
            });
       } 
    }
}

//Exportar por defecto la constante controlador anuncios
        export default controladorAnuncios;