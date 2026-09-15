import multer from "multer";
import path from "path";

const storage = multer.diskStorage({   //constante para hacer la configuración de almacenamiento
    destination: 'imagenes',// Las propiedades se asignan con : y comillas simples para el destino
    filename: (req,file,callback)=>{
        const extension = path.extname(file.originalname);//Extrae solamente la extensión
        const nameWithoutExt = path.basename(file.originalname, extension).replace(/\s+/g,'-').toLowerCase();//Extrae el nombre del archivo sin la extensión
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');//Para establecer la fecha y hora
        const uniqueName = `${nameWithoutExt}${timestamp}${extension}`;//Para generar el nombre completo
           
        callback(null,uniqueName); 
    },
});

export const uploadImage = multer({storage}).single('imagen'); //Constante para exportar el middleware