import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import {
    Box,
    FormControl,
    FormLabel,
    Select,
    Input,
    Textarea,
    Button,
    VStack,
    Alert,
    AlertIcon,
    AlertDescription,
    Text,
    SimpleGrid,
    InputGroup,
    InputLeftElement,
    Badge,
} from '@chakra-ui/react';
import { FiUser, FiHome, FiCalendar, FiFileText, FiDollarSign } from 'react-icons/fi';
import { reservaService } from '../services/reservaService';
import { clienteService } from '../services/clienteService';
import { habitacionService } from '../services/habitacionService';

const Reservas = () => {
    const [clientes, setClientes] = useState([]);
    const [habitaciones, setHabitaciones] = useState([]);
    const [form, setForm] = useState({
        clienteId: '',
        habitacionId: '',
        fechaCheckIn: '',
        fechaCheckOut: '',
        observaciones: ''
    });
    const [precioEstimado, setPrecioEstimado] = useState(null);
    const [noches, setNoches] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [clientesData, habitacionesData] = await Promise.all([
                clienteService.listarTodos(),
                habitacionService.listarTodas()
            ]);
            setClientes(clientesData);
            setHabitaciones(habitacionesData);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar clientes y habitaciones');
        }
    };

    useEffect(() => {
        if (form.habitacionId && form.fechaCheckIn && form.fechaCheckOut) {
            calcularPrecio();
        } else {
            setPrecioEstimado(null);
            setNoches(0);
        }
    }, [form.habitacionId, form.fechaCheckIn, form.fechaCheckOut]);

    const calcularPrecio = () => {
        const habitacion = habitaciones.find(h => h.idHabitacion === parseInt(form.habitacionId));
        if (!habitacion) return;

        const checkIn = new Date(form.fechaCheckIn);
        const checkOut = new Date(form.fechaCheckOut);
        const diffTime = checkOut - checkIn;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            setNoches(diffDays);
            const precio = habitacion.precioTotal * diffDays;
            setPrecioEstimado(precio);
        } else {
            setNoches(0);
            setPrecioEstimado(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!form.clienteId || !form.habitacionId || !form.fechaCheckIn || !form.fechaCheckOut) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (new Date(form.fechaCheckOut) <= new Date(form.fechaCheckIn)) {
            setError('La fecha de check-out debe ser posterior al check-in');
            return;
        }

        setSubmitting(true);

        try {
            const reservaData = {
                clienteId: parseInt(form.clienteId),
                habitacionId: parseInt(form.habitacionId),
                fechaCheckIn: form.fechaCheckIn,
                fechaCheckOut: form.fechaCheckOut,
                observaciones: form.observaciones
            };

            await reservaService.crear(reservaData);

            setSuccess(true);
            setForm({
                clienteId: '',
                habitacionId: '',
                fechaCheckIn: '',
                fechaCheckOut: '',
                observaciones: ''
            });
            setPrecioEstimado(null);
            setNoches(0);

            const habitacionesData = await habitacionService.listarTodas();
            setHabitaciones(habitacionesData);

            setTimeout(() => setSuccess(false), 5000);

        } catch (err) {
            console.error('Error al crear reserva:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Error al crear la reserva. Intenta nuevamente.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getHabitacionInfo = (habitacionId) => {
        return habitaciones.find(h => h.idHabitacion === parseInt(habitacionId));
    };

    return (
        <Box minH="100vh" className="bg-gradient-to-br from-gray-50 to-gray-100" p={6}>
            <Box maxW="5xl" mx="auto">
                <PageHeader
                    title="Nueva Reserva"
                    description="Crea una nueva reserva de habitación"
                    icon="📅"
                    gradient="bg-gradient-success"
                />

                {success && (
                    <Alert status="success" mb={6} rounded="xl" className="animate-fadeIn">
                        <AlertIcon />
                        <AlertDescription>
                            ¡Reserva creada exitosamente!
                        </AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert status="error" mb={6} rounded="xl" className="animate-fadeIn">
                        <AlertIcon />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Box bg="white" rounded="2xl" boxShadow="xl" p={8} className="animate-fadeIn">
                    <Box as="form" onSubmit={handleSubmit}>
                        <VStack spacing={6} align="stretch">
                            {/* Cliente y Habitación */}
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                <FormControl isRequired>
                                    <FormLabel fontWeight="semibold">Cliente</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FiUser className="text-gray-400" />
                                        </InputLeftElement>
                                        <Select
                                            name="clienteId"
                                            value={form.clienteId}
                                            onChange={handleChange}
                                            placeholder="Seleccione un cliente"
                                            disabled={submitting}
                                            size="lg"
                                        >
                                            {clientes.map(cliente => (
                                                <option key={cliente.idCliente} value={cliente.idCliente}>
                                                    {cliente.nombre} {cliente.apellido} - {cliente.numeroDocumento}
                                                </option>
                                            ))}
                                        </Select>
                                    </InputGroup>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontWeight="semibold">Habitación</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FiHome className="text-gray-400" />
                                        </InputLeftElement>
                                        <Select
                                            name="habitacionId"
                                            value={form.habitacionId}
                                            onChange={handleChange}
                                            placeholder="Seleccione una habitación"
                                            disabled={submitting}
                                            size="lg"
                                        >
                                            {habitaciones
                                                .filter(h => h.estado === 'DISPONIBLE')
                                                .map(habitacion => (
                                                    <option key={habitacion.idHabitacion} value={habitacion.idHabitacion}>
                                                        {habitacion.numeroHabitacion} - {habitacion.tipo} - Piso {habitacion.piso} - S/ {habitacion.precioTotal}
                                                    </option>
                                                ))}
                                        </Select>
                                    </InputGroup>
                                </FormControl>
                            </SimpleGrid>

                            {/* Fechas */}
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                <FormControl isRequired>
                                    <FormLabel fontWeight="semibold">Fecha Check-In</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FiCalendar className="text-gray-400" />
                                        </InputLeftElement>
                                        <Input
                                            type="date"
                                            name="fechaCheckIn"
                                            value={form.fechaCheckIn}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            disabled={submitting}
                                            size="lg"
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontWeight="semibold">Fecha Check-Out</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FiCalendar className="text-gray-400" />
                                        </InputLeftElement>
                                        <Input
                                            type="date"
                                            name="fechaCheckOut"
                                            value={form.fechaCheckOut}
                                            onChange={handleChange}
                                            min={form.fechaCheckIn || new Date().toISOString().split('T')[0]}
                                            disabled={submitting}
                                            size="lg"
                                        />
                                    </InputGroup>
                                </FormControl>
                            </SimpleGrid>

                            {/* Resumen de precio */}
                            {precioEstimado !== null && noches > 0 && (
                                <Box className="bg-gradient-success rounded-xl p-6 text-white animate-fadeIn">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Text fontSize="sm" opacity={0.9}>Número de noches</Text>
                                            <Text fontSize="2xl" fontWeight="bold">{noches}</Text>
                                        </div>
                                        <div className="text-right">
                                            <Text fontSize="sm" opacity={0.9}>Total a pagar</Text>
                                            <Text fontSize="3xl" fontWeight="bold">
                                                S/ {precioEstimado.toFixed(2)}
                                            </Text>
                                        </div>
                                    </div>
                                </Box>
                            )}

                            {/* Observaciones */}
                            <FormControl>
                                <FormLabel fontWeight="semibold">Observaciones</FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <FiFileText className="text-gray-400" />
                                    </InputLeftElement>
                                    <Textarea
                                        name="observaciones"
                                        value={form.observaciones}
                                        onChange={handleChange}
                                        placeholder="Observaciones adicionales (opcional)"
                                        rows={4}
                                        disabled={submitting}
                                        pl="10"
                                    />
                                </InputGroup>
                            </FormControl>

                            {/* Botón de envío */}
                            <Button
                                type="submit"
                                className="bg-gradient-success"
                                color="white"
                                size="lg"
                                w="full"
                                isLoading={submitting}
                                loadingText="Creando reserva..."
                                mt={4}
                                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                                transition="all 0.2s"
                            >
                                Crear Reserva
                            </Button>
                        </VStack>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Reservas;
