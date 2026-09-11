//país de origen, empresa, logo, descripción, nombre
import { Schema } from "mongoose";

const esquemaMarcas = new Schema({
    nombre: { type: String, required: true, trim: true },
    paisOrigen: { type: String, required: true, trim: true },
    empresa: { type: String, required: true, trim: true },
    logo: { type: String, required: true, },
    descripción: { type: String, required: true, trim: true },
});

export default model('marca', esquemaMarcas);
