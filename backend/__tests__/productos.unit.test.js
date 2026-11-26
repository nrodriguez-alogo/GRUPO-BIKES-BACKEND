import { beforeEach, describe, expect, jest, test} from '@jest/globals';
//1. Simular multer (uploadSingleImage)
jest.unstable_mockModule('../src/middlewares/resources.js', ()=>({
    uploadSingleImage: jest.fn((req, res, callback)=> callback(null)),
}));
const mockSave = jest.fn();
const mockModeloProductos = jest.fn().mockImplementation((datos)=>({
    ...datos,
    save: mockSave,
}));
mockModeloProductos.find = jest.fn();
mockModeloProductos.findById = jest.fn();
mockModeloProductos.findByIdAndUpdate = jest.fn();
mockModeloProductos.findByIdAndDelete = jest.fn();

jest.unstable_mockModule('../src/modelos/modeloProductos.js', ()=>({
    default: mockModeloProductos, 
    }));

    //2. Importar dinamicamente
    const {uploadSingleImage} = await import('../src/middlewares/resources.js');
    const { default: modeloProductos} = await import ('../src/modelos/modeloProductos.js');
    const { default: driverProductos} = await import('../src/driver/driverProductos.js');

    describe('PRUEBA UNITARIA: driverProductos', ()=>{
        beforeEach(() =>{
            jest.clearAllMocks();
        });

    //Prueba 1 leerProductos
    test('leerProductos debe responder mensaje: "Productos encontrados correctamente" y lista de productos', async()=>{
        //Arrange (preparar)
        const productosFalsos = [
            {_id:'1', marca: 'Yamaha', modelo: 2025, precio: 8000000},
            {_id:'2', marca: 'Susuki', modelo: 2022, precio: 6000000},
        ];
        // programamos que devolvera mongoDB falso cuando llamen a find()
        modeloProductos.find.mockResolvedValue(productosFalsos);
            const req = {query: {}};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()};
            // Act (actuar)
            await driverProductos.leerProductos(req, res);
            //Assert (verificar)
            expect(modeloProductos.find).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                mensaje: 'Productos encontrados correctamente',
                datos: productosFalsos,
            });
    });


    });