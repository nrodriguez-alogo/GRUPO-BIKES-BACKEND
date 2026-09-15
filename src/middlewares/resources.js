import multer from "multer";
import path from "path";

const storage = multer.diskStorage({   //constante para hacer la configuración de almacenamiento
    destination: 'imagenes'
})