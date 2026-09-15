import modeloNoticias from "../modelos/modeloNoticias";

const controladorAnuncios = {
    crearAnuncio : async (req, res)=>{
        try {
            const nuevoAnuncio = new modeloNoticias({
                    titulo:req.body.nombre,
                    subtitulo:req.body.subtitulo,
                    contenido:req.body.contenido,
                    autor:req.body.autor,
                    imagen:req.file.filename
                });

        }


/*titulo: { type: String, required: true, trim: true },
    subtitulo: { type: String, required: true, trim: true },
    contenido: { type: String, required: true, trim: true },
    imagenNoticias: { type: String, required: true, },
    autor: { type: String, 