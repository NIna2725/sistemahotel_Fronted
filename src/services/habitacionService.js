import axios from 'axios';

const API_URL = 'http://localhost:8082/api/habitaciones';

export const habitacionService = {
    // ===== Métodos existentes =====

    // Listar todas las habitaciones
    listarTodas: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error al listar habitaciones:', error);
            throw error;
        }
    },

    // Obtener habitación por ID
    obtenerPorId: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener habitación:', error);
            throw error;
        }
    },

    // Listar habitaciones disponibles
    listarDisponibles: async () => {
        try {
            const response = await axios.get(`${API_URL}/disponibles`);
            return response.data;
        } catch (error) {
            console.error('Error al listar habitaciones disponibles:', error);
            throw error;
        }
    },

    // ===== Nuevos métodos para asignación visual =====

    // Obtener habitaciones para el mapa visual
    getMapaHabitaciones: async (piso = null) => {
        try {
            const url = piso ? `${API_URL}/mapa?piso=${piso}` : `${API_URL}/mapa`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error al obtener mapa de habitaciones:', error);
            throw error;
        }
    },

    // Filtrar habitaciones por múltiples criterios
    filtrarHabitaciones: async (filtros) => {
        try {
            const params = new URLSearchParams();

            if (filtros.tipo) params.append('tipo', filtros.tipo);
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.estadoLimpieza) params.append('estadoLimpieza', filtros.estadoLimpieza);
            if (filtros.piso) params.append('piso', filtros.piso);
            if (filtros.tieneAireAcondicionado !== undefined)
                params.append('tieneAireAcondicionado', filtros.tieneAireAcondicionado);
            if (filtros.cercaAscensor !== undefined)
                params.append('cercaAscensor', filtros.cercaAscensor);
            if (filtros.tipoVista) params.append('tipoVista', filtros.tipoVista);

            const response = await axios.get(`${API_URL}/filtrar?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error al filtrar habitaciones:', error);
            throw error;
        }
    },

    // Obtener habitaciones disponibles por tipo
    getDisponiblesPorTipo: async (tipo) => {
        try {
            const response = await axios.get(`${API_URL}/tipo/${tipo}/disponibles`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener habitaciones disponibles por tipo:', error);
            throw error;
        }
    },

    // Obtener habitaciones por piso
    getPorPiso: async (piso) => {
        try {
            const response = await axios.get(`${API_URL}/piso/${piso}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener habitaciones por piso:', error);
            throw error;
        }
    },

    // Obtener habitaciones disponibles por piso
    getDisponiblesPorPiso: async (piso) => {
        try {
            const response = await axios.get(`${API_URL}/piso/${piso}/disponibles`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener habitaciones disponibles por piso:', error);
            throw error;
        }
    },

    // Actualizar estado de limpieza
    actualizarEstadoLimpieza: async (id, estadoLimpieza) => {
        try {
            const response = await axios.put(`${API_URL}/${id}/estado-limpieza`, {
                estadoLimpieza
            });
            return response.data;
        } catch (error) {
            console.error('Error al actualizar estado de limpieza:', error);
            throw error;
        }
    },

    // Verificar si está disponible y limpia
    verificarDisponibleLimpia: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}/disponible-limpia`);
            return response.data.disponibleLimpia;
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
            throw error;
        }
    }
};
