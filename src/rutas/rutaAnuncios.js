import controladorAnuncios from "../driver/driverAnuncios.js";
import { Router } from "express";//Librería para manejar las rutas de expres
import { uploadImage } from "../middlewares/resources.js";

const rutaAnuncios = Router();//Constante para manejar las rutas del anuncio
rutaAnuncios.post('/', controladorAnuncios.crearAnuncio);
rutaAnuncios.get('/', controladorAnuncios.leerAnuncio);
rutaAnuncios.get('/:id', controladorAnuncios.leerAnuncioId);
rutaAnuncios.delete('/:id', controladorAnuncios.borrarAnuncio);
rutaAnuncios.put('/:id', uploadImage, controladorAnuncios.actualizarAnuncio);


//Exportar por defecto la ruta de alumnos
export default rutaAnuncios;