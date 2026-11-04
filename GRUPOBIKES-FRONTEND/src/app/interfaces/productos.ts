export interface Productos {
//Agregar id. Para consultar los datos del productoi registrado en la base de datos
 _id?: string;
 marca: string;
 modelo: string;
 descripcion: string;
 imagen: string;
 color: string;
 categoria: string;
 precio:number;
 estado: string;
 cilindraje: number
}

export interface ApiProductos{
    resultado: string;
    mensaje: string;
    data: Productos[];
}


