import axios from 'axios';

const API_URL = 'http://localhost:8082/api/usuarios';

export const usuarioService = {
    // Listar todos los usuarios
    listarTodos: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // Obtener usuario por ID
    obtenerPorId: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    // Crear nuevo usuario
    crear: async (usuarioData) => {
        const response = await axios.post(API_URL, usuarioData);
        return response.data;
    },

    // Actualizar usuario
    actualizar: async (id, usuarioData) => {
        const response = await axios.put(`${API_URL}/${id}`, usuarioData);
        return response.data;
    },

    // Eliminar usuario
    eliminar: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};
