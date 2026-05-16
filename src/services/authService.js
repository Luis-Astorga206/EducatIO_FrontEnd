import clienteAxios from '../config/axiosClient';

const authService = {
    // Función para el login
    login: async (credenciales) => {
        // 'credenciales' es un objeto { email, password }
        const respuesta = await clienteAxios.post('/autenticacion/login', credenciales);//Se manda a llamar a la ruta de autenticacion
        
        // Si el backend responde con éxito, retornamos la data (que trae el JWT)
        return respuesta.data;
    },

    // src/services/authService.js
    restablecerPassword: async (datos) => {
        // La URL debe ser la que definiste en el paso anterior
        const respuesta = await clienteAxios.post('/autenticacion/restablecer-password', datos);
        return respuesta.data;
    },
}

export default authService;