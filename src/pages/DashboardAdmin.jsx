import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import { Box, SimpleGrid, VStack, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { FiUsers, FiCalendar, FiHome, FiDollarSign } from 'react-icons/fi';
import { clienteService } from '../services/clienteService';
import { reservaService } from '../services/reservaService';
import { habitacionService } from '../services/habitacionService';

const DashboardAdmin = () => {
    const [stats, setStats] = useState({
        totalClientes: 0,
        reservasActivas: 0,
        habitacionesDisponibles: 0,
        ingresosMes: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            setLoading(true);
            setError('');

            // Cargar datos en paralelo
            const [clientes, reservas, habitaciones] = await Promise.all([
                clienteService.listarTodos(),
                reservaService.listarTodas(),
                habitacionService.listarTodas()
            ]);

            // Calcular estadísticas
            const totalClientes = clientes.length;

            // Reservas activas (PENDIENTE + CONFIRMADA)
            const reservasActivas = reservas.filter(
                r => r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA'
            ).length;

            // Habitaciones disponibles
            const habitacionesDisponibles = habitaciones.filter(
                h => h.estado === 'DISPONIBLE'
            ).length;

            // Ingresos del mes actual
            const mesActual = new Date().getMonth();
            const añoActual = new Date().getFullYear();

            const ingresosMes = reservas
                .filter(r => {
                    const fechaReserva = new Date(r.fechaCreacion);
                    return fechaReserva.getMonth() === mesActual &&
                        fechaReserva.getFullYear() === añoActual &&
                        (r.estado === 'CONFIRMADA' || r.estado === 'COMPLETADA');
                })
                .reduce((total, r) => total + parseFloat(r.precioTotal || 0), 0);

            setStats({
                totalClientes,
                reservasActivas,
                habitacionesDisponibles,
                ingresosMes
            });

        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
            setError('Error al cargar las estadísticas del dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box minH="100vh" className="bg-gradient-to-br from-gray-50 to-gray-100" p={6}>
                <Box maxW="7xl" mx="auto" textAlign="center" py={20}>
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                    <Text mt={4} color="gray.600">Cargando estadísticas...</Text>
                </Box>
            </Box>
        );
    }

    return (
        <Box minH="100vh" className="bg-gradient-to-br from-gray-50 to-gray-100" p={6}>
            <Box maxW="7xl" mx="auto">
                <PageHeader
                    title="Dashboard Administrativo"
                    description="Panel de control y estadísticas del hotel"
                    icon="📊"
                    gradient="bg-gradient-primary"
                />

                {error && (
                    <Alert status="error" mb={6} rounded="xl">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                {/* Estadísticas principales */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
                    <StatsCard
                        title="Clientes Registrados"
                        value={stats.totalClientes}
                        icon={<FiUsers />}
                        gradient="from-blue-500 to-blue-600"
                    />

                    <StatsCard
                        title="Reservas Activas"
                        value={stats.reservasActivas}
                        icon={<FiCalendar />}
                        gradient="from-green-500 to-green-600"
                    />

                    <StatsCard
                        title="Habitaciones Disponibles"
                        value={stats.habitacionesDisponibles}
                        icon={<FiHome />}
                        gradient="from-purple-500 to-purple-600"
                    />

                    <StatsCard
                        title="Ingresos del Mes"
                        value={`S/ ${stats.ingresosMes.toFixed(2)}`}
                        icon={<FiDollarSign />}
                        gradient="from-orange-500 to-orange-600"
                    />
                </SimpleGrid>

                {/* Información adicional */}
                <Box bg="white" rounded="2xl" boxShadow="xl" p={8} className="animate-fadeIn">
                    <VStack align="stretch" spacing={4}>
                        <Text fontSize="2xl" fontWeight="bold" className="text-gradient">
                            Bienvenido, Administrador
                        </Text>
                        <Text color="gray.600">
                            Desde este panel puedes gestionar todo el sistema del hotel. Usa el menú lateral para acceder a:
                        </Text>
                        <VStack align="stretch" mt={4} spacing={3}>
                            <Box p={4} bg="purple.50" rounded="lg" borderLeft="4px solid" borderColor="purple.500">
                                <Text fontWeight="semibold" color="purple.700">
                                    📋 Gestión de Habitaciones
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Crear, editar y administrar todas las habitaciones del hotel
                                </Text>
                            </Box>

                            <Box p={4} bg="blue.50" rounded="lg" borderLeft="4px solid" borderColor="blue.500">
                                <Text fontWeight="semibold" color="blue.700">
                                    👥 Gestión de Usuarios
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Administrar recepcionistas y otros usuarios del sistema
                                </Text>
                            </Box>

                            <Box p={4} bg="green.50" rounded="lg" borderLeft="4px solid" borderColor="green.500">
                                <Text fontWeight="semibold" color="green.700">
                                    📅 Reservas
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Ver y gestionar todas las reservas del hotel
                                </Text>
                            </Box>

                            <Box p={4} bg="orange.50" rounded="lg" borderLeft="4px solid" borderColor="orange.500">
                                <Text fontWeight="semibold" color="orange.700">
                                    🗺️ Mapa de Habitaciones
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Visualización interactiva del estado de las habitaciones
                                </Text>
                            </Box>
                        </VStack>
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardAdmin;
