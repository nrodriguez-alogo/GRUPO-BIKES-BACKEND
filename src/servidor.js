import express from 'express';
import morgan from 'morgan';
import path from 'path';

// Importación de rutas
import marcasRoutes from './rutas/rutaMarcas.js';
import rutaAnuncios from './rutas/rutaAnuncios.js';
import rutaProductos from './rutas/rutaProductos.js';
import rutaUsuarios from './rutas/rutaUsuarios.js';

const servidor = express();

// Middlewares globales
servidor.use(morgan("dev")); // Logger para desarrollo
servidor.use(express.json()); // Middleware para parsear JSON
servidor.use(express.urlencoded({ extended: true })); // Para manejar datos en formato urlencoded

// Servidor estático para la carpeta de imágenes subidas por Multer
servidor.use('/imagenes', express.static(path.resolve('imagenes')));

// --- ENDPOINTS ---
servidor.use('/marcas', marcasRoutes);
servidor.use('/noticias', rutaAnuncios);
servidor.use('/productos', rutaProductos);
servidor.use('/usuarios', rutaUsuarios);

// Ruta raíz
servidor.get('/', (req, res) => {
    res.status(200).json({ mensaje: "API ejecutándose correctamente" });
});

// Ruta por defecto para manejar endpoints no encontrados (404)
servidor.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

export default servidor;