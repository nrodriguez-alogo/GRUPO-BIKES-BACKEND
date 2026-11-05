import mongoose from "mongoose";

mongoose
    .connect(process.env.MONGODB)//Se conecta a través de la variable de entorno
    .then((dato) => {
        console.log("Se encuentra conectado a la base de datos");
    })
    .catch((error) => {
        console.log("Error al conectar", error);
    });