import {uploadImage} from '../middlewares/resources.js';
import modeloNoticias from "../modelos/modeloNoticias.js";

const controladorAnuncios = {
    crearAnuncio: async (req, res)=>{
        try {
            uploadImage (req, res , async (error)=>{
                if(error){
                    return res.json({
                        mensaje: 'Ocurrió un error al cargar la imagen',
                        datos: error
                    });
               }
               const nuevoAnuncio = new modeloNoticias({
                    titulo:req.body.nombre,
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
    }
}

        export default controladorAnuncios;