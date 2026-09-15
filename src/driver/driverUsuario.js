// src/driver/driverUsuario.js
import Usuario from '../modelos/modeloUsuarios.js'; // Importante incluir la extensión .js si usas ES Modules nativos

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
    }
};

// Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
    try {
        // Mongoose aplicará automáticamente las validaciones de match, required y enum aquí
        const nuevoUsuario = new Usuario(req.body);
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        // Si falla alguna expresión regular o campo requerido, caerá en este bloque
        res.status(400).json({ mensaje: 'Error de validación al crear el usuario', error: error.message });
    }
};

// Actualizar un usuario por ID
export const actualizarUsuario = async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            // runValidators: true obliga a Mongoose a validar las expresiones regulares (match) y enums también al actualizar
            { new: true, runValidators: true } 
        );
        
        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
    }
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        
        if (!usuarioEliminado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message });
    }
};