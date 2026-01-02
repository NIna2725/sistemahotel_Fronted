import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Button,
    HStack,
    Alert,
    AlertIcon,
    AlertDescription,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Text,
    VStack,
    Select,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { reservaService } from '../services/reservaService';

const ListaReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [reservasFiltradas, setReservasFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        cargarReservas();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [reservas, filtroEstado, busqueda]);

    const cargarReservas = async () => {
        try {
            setLoading(true);
            const data = await reservaService.listarTodas();
            setReservas(data);
            setReservasFiltradas(data);
        } catch (err) {
            console.error('Error al cargar reservas:', err);
            setError('Error al cargar las reservas');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let resultado = [...reservas];

        if (filtroEstado) {
            resultado = resultado.filter(r => r.estado === filtroEstado);
        }

        if (busqueda) {
            resultado = resultado.filter(r =>
                r.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                r.cliente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
                r.habitacion.numeroHabitacion.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        setReservasFiltradas(resultado);
    };

    const getEstadoBadge = (estado) => {
        const config = {
            PENDIENTE: { color: 'yellow', label: 'Pendiente' },
            CONFIRMADA: { color: 'blue', label: 'Confirmada' },
            CANCELADA: { color: 'red', label: 'Cancelada' },
            COMPLETADA: { color: 'green', label: 'Completada' }
        };
        const { color, label } = config[estado] || { color: 'gray', label: estado };
        return <Badge colorScheme={color} fontSize="sm" px={3} py={1} rounded="full">{label}</Badge>;
    };

    const handleAccion = async (reserva, accion) => {
        setError('');
        setSuccess('');

        try {
            let mensaje = '';
            switch (accion) {
                case 'confirmar':
                    await reservaService.confirmar(reserva.idReserva);
                    mensaje = 'Reserva confirmada exitosamente';
                    break;
                case 'cancelar':
                    await reservaService.cancelar(reserva.idReserva);
                    mensaje = 'Reserva cancelada exitosamente';
                    break;
                case 'completar':
                    await reservaService.completar(reserva.idReserva);
                    mensaje = 'Reserva completada exitosamente';
                    break;
                default:
                    break;
            }
            setSuccess(mensaje);
            await cargarReservas();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error al realizar acción:', err);
            setError(err.response?.data?.error || 'Error al realizar la acción');
        }
    };

    const abrirDetalle = (reserva) => {
        setReservaSeleccionada(reserva);
        onOpen();
    };

    const calcularNoches = (checkIn, checkOut) => {
        const inicio = new Date(checkIn);
        const fin = new Date(checkOut);
        const diffTime = fin - inicio;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <Box minH="100vh" className="bg-gradient-to-br from-gray-50 to-gray-100" p={6}>
            <Box maxW="7xl" mx="auto">
                <PageHeader
                    title="Lista de Reservas"
                    description="Gestiona y visualiza todas las reservas del hotel"
                    icon="📋"
                    gradient="bg-gradient-sunset"
                />

                {success && (
                    <Alert status="success" mb={6} rounded="xl" className="animate-fadeIn">
                        <AlertIcon />
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert status="error" mb={6} rounded="xl" className="animate-fadeIn">
                        <AlertIcon />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Filtros */}
                <Box bg="white" rounded="2xl" boxShadow="lg" p={6} mb={6} className="animate-fadeIn">
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <InputGroup size="lg">
                            <InputLeftElement pointerEvents="none">
                                <FiSearch className="text-gray-400" />
                            </InputLeftElement>
                            <Input
                                placeholder="Buscar por cliente o habitación..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup size="lg">
                            <InputLeftElement pointerEvents="none">
                                <FiFilter className="text-gray-400" />
                            </InputLeftElement>
                            <Select
                                placeholder="Todos los estados"
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                            >
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="CONFIRMADA">Confirmada</option>
                                <option value="CANCELADA">Cancelada</option>
                                <option value="COMPLETADA">Completada</option>
                            </Select>
                        </InputGroup>

                        <Button
                            leftIcon={<FiRefreshCw />}
                            onClick={cargarReservas}
                            className="bg-gradient-sunset"
                            color="white"
                            size="lg"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                        >
                            Actualizar
                        </Button>
                    </SimpleGrid>
                </Box>

                {/* Tabla de reservas */}
                <Box bg="white" rounded="2xl" boxShadow="xl" overflowX="auto" className="animate-fadeIn">
                    {loading ? (
                        <Box p={12} textAlign="center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <Text color="gray.600">Cargando reservas...</Text>
                        </Box>
                    ) : reservasFiltradas.length === 0 ? (
                        <Box p={12} textAlign="center">
                            <Text fontSize="xl" color="gray.500">📋 No hay reservas para mostrar</Text>
                            <Text fontSize="sm" color="gray.400" mt={2}>Intenta ajustar los filtros</Text>
                        </Box>
                    ) : (
                        <Table variant="simple">
                            <Thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Cliente</Th>
                                    <Th>Habitación</Th>
                                    <Th>Check-In</Th>
                                    <Th>Check-Out</Th>
                                    <Th>Noches</Th>
                                    <Th>Precio Total</Th>
                                    <Th>Estado</Th>
                                    <Th>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {reservasFiltradas.map((reserva) => (
                                    <Tr key={reserva.idReserva} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                                        <Td fontWeight="semibold">#{reserva.idReserva}</Td>
                                        <Td>
                                            <Text fontWeight="medium">{reserva.cliente.nombre} {reserva.cliente.apellido}</Text>
                                            <Text fontSize="sm" color="gray.500">{reserva.cliente.email}</Text>
                                        </Td>
                                        <Td>
                                            <Badge colorScheme="purple">{reserva.habitacion.numeroHabitacion}</Badge>
                                        </Td>
                                        <Td>{new Date(reserva.fechaCheckIn).toLocaleDateString()}</Td>
                                        <Td>{new Date(reserva.fechaCheckOut).toLocaleDateString()}</Td>
                                        <Td>
                                            <Badge colorScheme="blue">{calcularNoches(reserva.fechaCheckIn, reserva.fechaCheckOut)}</Badge>
                                        </Td>
                                        <Td fontWeight="bold" color="green.600">S/ {reserva.precioTotal}</Td>
                                        <Td>{getEstadoBadge(reserva.estado)}</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <Button size="sm" onClick={() => abrirDetalle(reserva)} variant="outline">
                                                    Ver
                                                </Button>
                                                {reserva.estado === 'PENDIENTE' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="blue"
                                                            onClick={() => handleAccion(reserva, 'confirmar')}
                                                        >
                                                            Confirmar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="red"
                                                            onClick={() => handleAccion(reserva, 'cancelar')}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </>
                                                )}
                                                {reserva.estado === 'CONFIRMADA' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="green"
                                                            onClick={() => handleAccion(reserva, 'completar')}
                                                        >
                                                            Completar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="red"
                                                            onClick={() => handleAccion(reserva, 'cancelar')}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </>
                                                )}
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </Box>
            </Box>

            {/* Modal de detalle */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent>
                    <ModalHeader className="bg-gradient-sunset text-white rounded-t-lg">
                        Detalle de Reserva #{reservaSeleccionada?.idReserva}
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody py={6}>
                        {reservaSeleccionada && (
                            <VStack align="stretch" spacing={4}>
                                <Box p={4} bg="gray.50" rounded="lg">
                                    <Text fontWeight="bold" mb={2}>Estado:</Text>
                                    {getEstadoBadge(reservaSeleccionada.estado)}
                                </Box>
                                <Box p={4} bg="blue.50" rounded="lg">
                                    <Text fontWeight="bold" mb={2}>Cliente:</Text>
                                    <Text fontSize="lg">{reservaSeleccionada.cliente.nombre} {reservaSeleccionada.cliente.apellido}</Text>
                                    <Text fontSize="sm" color="gray.600">{reservaSeleccionada.cliente.email}</Text>
                                </Box>
                                <Box p={4} bg="purple.50" rounded="lg">
                                    <Text fontWeight="bold" mb={2}>Habitación:</Text>
                                    <Text fontSize="lg">{reservaSeleccionada.habitacion.numeroHabitacion} - {reservaSeleccionada.habitacion.tipo}</Text>
                                    <Text fontSize="sm" color="gray.600">Piso {reservaSeleccionada.habitacion.piso}</Text>
                                </Box>
                                <Box p={4} bg="green.50" rounded="lg">
                                    <Text fontWeight="bold" mb={2}>Fechas:</Text>
                                    <Text>Check-In: {new Date(reservaSeleccionada.fechaCheckIn).toLocaleDateString()}</Text>
                                    <Text>Check-Out: {new Date(reservaSeleccionada.fechaCheckOut).toLocaleDateString()}</Text>
                                    <Text>Noches: {calcularNoches(reservaSeleccionada.fechaCheckIn, reservaSeleccionada.fechaCheckOut)}</Text>
                                </Box>
                                <Box p={4} bg="yellow.50" rounded="lg">
                                    <Text fontWeight="bold" mb={2}>Precio Total:</Text>
                                    <Text fontSize="2xl" fontWeight="bold" color="green.600">S/ {reservaSeleccionada.precioTotal}</Text>
                                </Box>
                                {reservaSeleccionada.observaciones && (
                                    <Box p={4} bg="gray.50" rounded="lg">
                                        <Text fontWeight="bold" mb={2}>Observaciones:</Text>
                                        <Text>{reservaSeleccionada.observaciones}</Text>
                                    </Box>
                                )}
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} colorScheme="purple">Cerrar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ListaReservas;
