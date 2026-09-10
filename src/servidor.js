import express from 'express';
import morgan from 'morgan';

const servidor = express();
servidor.use(morgan("dev"));//Se establece una palabra "dev", para iniciar el proceso de la conexión al servidor
servidor.use(express.json());//Se utiliza para que se entiendan las respuestas en formato .json
//Primer "endpoint"
servidor.get('/', (req, res) => {//La ruta que se va a tomar para cuando se envíen requerimientos (req) y se espere una respuesta (res).
/*ESPACIO PARA ENDPOINTS*/
    respuesta.status(404).send("No encontrado");
});

export default servidor;
