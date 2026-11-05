import "dotenv/config";//dotenv trae la configuración de la variable de entorno. Se importa toda la configuración del env
import "./conexion.js";//Se importa la "conexión" para que se establezca con la base de datos

import servidor from "./servidor.js";//Se importa el servidor
servidor.listen(3002, () => {//Se le indica el puerto al que va a escuchar
    console.log("El servidor está conextado a http://localhost:3002");
});