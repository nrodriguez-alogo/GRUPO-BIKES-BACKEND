import modeloProducto from '../modelos/modeloProductos.js';
import { uploadImage } from '../middlewares/resources.js';
import fs from 'fs';
import path from 'path';

const controladorProducto = {
    crearProducto: async (req, res) => {
        try {
            uploadImage(req, res, async (error) => {
                if (error) {
                    return res.status(400).json({
                        mensaje: 'Ocurrió un error al cargar la imagen',
                        datos: error
                    });
                }

                const nuevoProducto = new modeloProducto({
                    modelo: req.body.modelo,
                    marca: req.body.marca,
                    foto: req.file ? req.file.filename : null,
                    descripcion: req.body.descripcion,
                    color: req.body.color,
                    categoria: req.body.categoria,
                    precio: req.body.precio,
                    estado: req.body.estado,
                    cilindraje: req.body.cilindraje
                });

                const guardarProducto = await nuevoProducto.save();

                res.status(201).json({
                    mensaje: 'Producto creado satisfactoriamente',
                    datos: guardarProducto
                });
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Ocurrió un error al crear el producto',
                datos: error.message
            });
        }
    },

    leerProductos: async (req, res) => {
        try {
            const productos = await modeloProducto.find();
            res.status(200).json({
                mensaje: 'Productos encontrados correctamente',
                datos: productos
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener los productos',
                datos: error.message
            });
        }
    },

    leerProductoId: async (req, res) => {
        try {
            const producto = await modeloProducto.findById(req.params.id);
            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
            res.status(200).json({
                mensaje: 'Producto encontrado',
                datos: producto
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al buscar el producto',
                datos: error.message
            });
        }
    },

    actualizarProducto: async (req, res) => {
        try {
            uploadImage(req, res, async (error) => {
                if (error) {
                    return res.status(400).json({ mensaje: 'Error al procesar la imagen', datos: error });
                }

                const productoExistente = await modeloProducto.findById(req.params.id);
                if (!productoExistente) {
                    if (req.file) fs.unlinkSync(req.file.path);
                    return res.status(404).json({ mensaje: 'Producto no encontrado' });
                }

                let nuevaFoto = productoExistente.foto;
                if (req.file) {
                    if (productoExistente.foto) {
                        const rutaFotoAntigua = path.join('imagenes', productoExistente.foto);
                        if (fs.existsSync(rutaFotoAntigua)) {
                            fs.unlinkSync(rutaFotoAntigua);
                        }
                    }
                    nuevaFoto = req.file.filename;
                }

                const nuevoModeloProducto = {
                    modelo: req.body.modelo || productoExistente.modelo,
                    marca: req.body.marca || productoExistente.marca,
                    foto: nuevaFoto,
                    descripcion: req.body.descripcion || productoExistente.descripcion,
                    color: req.body.color || productoExistente.color,
                    categoria: req.body.categoria || productoExistente.categoria,
                    precio: req.body.precio || productoExistente.precio,
                    estado: req.body.estado || productoExistente.estado,
                    cilindraje: req.body.cilindraje || productoExistente.cilindraje
                };

                const productoActualizado = await modeloProducto.findByIdAndUpdate(
                    req.params.id,
                    nuevoModeloProducto,
                    { new: true, runValidators: true }
                );

                res.status(200).json({
                    mensaje: 'Producto actualizado correctamente',
                    datos: productoActualizado
                });
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al actualizar el producto',
                datos: error.message
            });
        }
    },

    borrarProducto: async (req, res) => {
        try {
            const productoABorrar = await modeloProducto.findByIdAndDelete(req.params.id);
            if (!productoABorrar) {
                return res.status(404).json({ mensaje: 'Producto no encontrado para eliminar.' });
            }

            if (productoABorrar.foto) {
                const rutaFoto = path.join('imagenes', productoABorrar.foto);
                if (fs.existsSync(rutaFoto)) {
                    fs.unlinkSync(rutaFoto);
                }
            }

            res.status(200).json({
                mensaje: 'Producto eliminado correctamente.',
                datos: null
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al eliminar el producto',
                datos: error.message
            });
        }
    }
};

export default controladorProducto;