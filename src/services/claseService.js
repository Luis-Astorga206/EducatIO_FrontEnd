import clienteAxios from '../config/axiosClient';

const claseService = {
    obtenerMisClases: async () => {
        // El interceptor de axios ya envía el token automáticamente
        const respuesta = await clienteAxios.get('/clases');
        return respuesta.data;
    },
    crear: async (datos) => {
        const respuesta = await clienteAxios.post('/clases', datos);
        return respuesta.data;
    },
    actualizar: async (codigo, datos) => {
        const res = await clienteAxios.put(`/clases/${codigo}`, datos);
        return res.data;
    },
    eliminar: async (codigo) => {
        const respuesta = await clienteAxios.delete(`/clases/${codigo}`);
        return respuesta.data;
    }   
};

export default claseService;