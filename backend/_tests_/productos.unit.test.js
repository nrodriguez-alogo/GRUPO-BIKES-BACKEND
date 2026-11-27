import { jest } from '@jest/globals';
import request from 'supertest';

const mockSave = jest.fn();
const mockModeloProductos =
jest.fn().mockImplementation((datos)=>({
    ...datos,
    save: mockSave,
}));
mockModeloProductos.find = jest.fn();
mockModeloProductos.findById = jest.fn();
mockModeloProductos.findByIdAndUpdate = jest.fn();
mockModeloProductos.findByIdAndDelete = jest.fn();

jest.unstable_mockModule('../src/modelos/modeloProductos.js',()=>({
    default:mockModeloProductos,
}));

const mockUploadSingleImage = jest.fn((req, res, callback)=>{
    req.file = {filename:'imagenprueba.jpg'},
    callback(null);    
});
const mockUploadUserImage = jest.fn((req, res, cb)=>{
    req.file = {filename:'imagenprueba.jpg'},
    cb(null);
});
//Código de corrección
const mockUploadImage = jest.fn((req, res, cb)=>{
    req.file = {filename:'imagenprueba.jpg'},
    cb(null);
});
//Hasta aquí
jest.unstable_mockModule('../src/middlewares/resources.js', ()=>({
    uploadSingleImage:mockUploadSingleImage,
    uploadUserImage:mockUploadUserImage,
//Código de corrección
    uploadImage:mockUploadImage,
//Hasta aquí
}));

const {default: modeloProductos} = await import('../src/modelos/modeloProductos.js');
const {default: servidor} = await import('../src/servidor.js');

describe ('PRUEBA DE INTEGRACIÓN', ()=>{
    beforeEach (()=>{
        jest.clearAllMocks();
    });
    //Prueba de leerProductos GET
    test('GET/productos', async()=>{
        //Arrange (preparar)
        const mockProductos = [
            {_id:'1',
                marca: 'Yamaha',
                modelo: 2025,
                precio: 8000000
            },
        ];
        modeloProductos.find.mockResolvedValue(mockProductos);
        //Act (actuar)
        const respuesta = await request(servidor).get('/productos').send();
        //Assert (verificar)
        expect (respuesta.statusCode).toBe(200);
        expect (respuesta.headers['content-type']).toMatch(/json/);
        expect (respuesta.body).toEqual({
            mensaje: 'Productos encontrados correctamente',
                datos: mockProductos
            });
        });
    });