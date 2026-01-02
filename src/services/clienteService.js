import axios from 'axios';

const API_URL = 'http://localhost:8082/api/clientes';

export const clienteService = {
    // Listar todos los clientes
    listarTodos: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al listar clientes:', error);
            throw error;
        }
    },

    // Obtener cliente por ID
    obtenerPorId: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener cliente:', error);
            throw error;
        }
    }
};
