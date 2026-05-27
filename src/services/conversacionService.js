import clienteAxios from '../config/axiosClient';

const conversacionService = {
    obtenerPorClase: async (codigoClase) => {
        const respuesta = await clienteAxios.get(`/clases/${codigoClase}/conversaciones`);
        return respuesta.data;
    }
};

export default conversacionService;
