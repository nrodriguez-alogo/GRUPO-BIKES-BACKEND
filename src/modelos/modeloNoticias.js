//titulo, subtitulo, contenido, imagen, autor
import {Schema, model} from "mongoose";

const esquemaNoticias = new Schema({
    titulo: { type: String, required: true, trim: true },
    subtitulo: { type: String, required: true, trim: true },
    contenido: { type: String, required: true, trim: true },
    autor: { type: String, },
    imagen: { type: String, required: true, }
});

export default model('noticias', esquemaNoticias);