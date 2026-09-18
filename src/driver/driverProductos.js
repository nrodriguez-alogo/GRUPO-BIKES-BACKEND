import { request } from 'express';
import modeloProductos from '../modelos/modeloProductos.js';
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

                const nuevoProducto = new modeloProductos({
                    modelo: req.body.modelo,
                    marca: req.body.marca,
                    imagen: req.file ? req.file.filename : null,
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
            const productos = await modeloProductos.find();
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
            const producto = await modeloProductos.findById(req.params.id);
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

                const productoExistente = await modeloProductos.findById(req.params.id);
                if (!productoExistente) {
                    if (req.file) fs.unlinkSync(req.file.path);
                    return res.status(404).json({ mensaje: 'Producto no encontrado' });
                }

                let nuevaimagen = productoExistente.imagen;
                if (req.file) {
                    if (productoExistente.imagen) {
                        const rutaimagenAntigua = path.join('imagenes', productoExistente.imagen);
                        if (fs.existsSync(rutaimagenAntigua)) {
                            fs.unlinkSync(rutaimagenAntigua);
                        }
                    }
                    nuevaimagen = req.file.filename;
                }

                const nuevomodeloProductos = {
                    modelo: req.body.modelo || productoExistente.modelo,
                    marca: req.body.marca || productoExistente.marca,
                    imagen: nuevaimagen,
                    descripcion: req.body.descripcion || productoExistente.descripcion,
                    color: req.body.color || productoExistente.color,
                    categoria: req.body.categoria || productoExistente.categoria,
                    precio: req.body.precio || productoExistente.precio,
                    estado: req.body.estado || productoExistente.estado,
                    cilindraje: req.body.cilindraje || productoExistente.cilindraje
                };

                const productoActualizado = await modeloProductos.findByIdAndUpdate(
                    req.params.id,
                    nuevomodeloProductos,
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
            const productoABorrar = await modeloProductos.findByIdAndDelete(req.params.id);
            if (!productoABorrar) {
                return res.status(404).json({ mensaje: 'Producto no encontrado para eliminar.' });
            }

            if (productoABorrar.imagen) {
                const rutaimagen = path.join('imagenes', productoABorrar.imagen);
                if (fs.existsSync(rutaimagen)) {
                    fs.unlinkSync(rutaimagen);
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