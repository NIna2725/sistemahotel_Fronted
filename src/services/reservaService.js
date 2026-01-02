import axios from 'axios';

const API_URL = 'http://localhost:8082/api/reservas';

export const reservaService = {
    // Listar todas las reservas
    listarTodas: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al listar reservas:', error);
            throw error;
        }
    },

    // Obtener reserva por ID
    obtenerPorId: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener reserva:', error);
            throw error;
        }
    },

    // Obtener reservas por cliente
    obtenerPorCliente: async (clienteId) => {
        try {
            const response = await axios.get(`${API_URL}/cliente/${clienteId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener reservas del cliente:', error);
            throw error;
        }
    },

    // Obtener reservas por habitación
    obtenerPorHabitacion: async (habitacionId) => {
        try {
            const response = await axios.get(`${API_URL}/habitacion/${habitacionId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener reservas de la habitación:', error);
            throw error;
        }
    },

    // Obtener reservas activas
    obtenerActivas: async () => {
        try {
            const response = await axios.get(`${API_URL}/activas`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener reservas activas:', error);
            throw error;
        }
    },

    // Verificar disponibilidad
    verificarDisponibilidad: async (habitacionId, checkIn, checkOut) => {
        try {
            const response = await axios.get(`${API_URL}/disponibilidad`, {
                params: {
                    habitacionId,
                    checkIn,
                    checkOut
                }
            });
            return response.data.disponible;
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
            throw error;
        }
    },

    // Crear nueva reserva
    crear: async (reservaData) => {
        try {
            const response = await axios.post(API_URL, reservaData);
            return response.data;
        } catch (error) {
            console.error('Error al crear reserva:', error);
            throw error;
        }
    },

    // Actualizar estado de reserva
    actualizarEstado: async (id, estado) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/estado`, { estado });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            throw error;
        }
    },

    // Confirmar reserva
    confirmar: async (id) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/confirmar`);
            return response.data;
        } catch (error) {
            console.error('Error al confirmar reserva:', error);
            throw error;
        }
    },

    // Cancelar reserva
    cancelar: async (id) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/cancelar`);
            return response.data;
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            throw error;
        }
    },

    // Completar reserva
    completar: async (id) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/completar`);
            return response.data;
        } catch (error) {
            console.error('Error al completar reserva:', error);
            throw error;
        }
    },

    // Eliminar reserva
    eliminar: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar reserva:', error);
            throw error;
        }
    }
};
