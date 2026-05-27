import clienteAxios from '../config/axiosClient';

const asistenciaService = {
    obtenerMisAsistencias: async (codigoClase) => {
        const respuesta = await clienteAxios.get(`/clases/${codigoClase}/mis-asistencias`);
        return respuesta.data;
    },
    
    obtenerAsistenciasAlumnos: async (codigoClase) => {
        const respuesta = await clienteAxios.get(`/clases/${codigoClase}/asistencias-alumnos`);
        return respuesta.data;
    }
};

export default asistenciaService;
