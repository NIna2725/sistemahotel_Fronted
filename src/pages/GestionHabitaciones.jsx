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
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    SimpleGrid,
    InputGroup,
    InputLeftElement,
    Checkbox,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Text,
    Spinner,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiPlus, FiEdit, FiTrash2, FiHome } from 'react-icons/fi';
import { habitacionService } from '../services/habitacionService';

const GestionHabitaciones = () => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Filtros
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroPiso, setFiltroPiso] = useState('');
    const [busqueda, setBusqueda] = useState('');

    // Modal crear/editar
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modoEdicion, setModoEdicion] = useState(false);
    const [habitacionActual, setHabitacionActual] = useState(null);
    const [formData, setFormData] = useState({
        numeroHabitacion: '',
        tipo: '',
        piso: '',
        precioTotal: '',
        estado: 'DISPONIBLE',
        estadoLimpieza: 'LIMPIA',
        tipoVista: 'INTERIOR',
        cercaAscensor: false,
        tieneAireAcondicionado: false,
        capacidadPersonas: 1,
        coordenadaX: 0,
        coordenadaY: 0,
        observaciones: ''
    });

    // Modal eliminar
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [habitacionAEliminar, setHabitacionAEliminar] = useState(null);
    const cancelRef = React.useRef();

    useEffect(() => {
        cargarHabitaciones();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [habitaciones, filtroTipo, filtroPiso, busqueda]);

    const cargarHabitaciones = async () => {
        try {
            setLoading(true);
            const data = await habitacionService.listarTodas();
            setHabitaciones(data);
        } catch (err) {
            console.error('Error al cargar habitaciones:', err);
            setError('Error al cargar las habitaciones');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let resultado = [...habitaciones];

        if (filtroTipo) {
            resultado = resultado.filter(h => h.tipo === filtroTipo);
        }

        if (filtroPiso) {
            resultado = resultado.filter(h => h.piso === parseInt(filtroPiso));
        }

        if (busqueda) {
            resultado = resultado.filter(h =>
                h.numeroHabitacion.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        setHabitacionesFiltradas(resultado);
    };

    const abrirModalNueva = () => {
        setModoEdicion(false);
        setHabitacionActual(null);
        setFormData({
            numeroHabitacion: '',
            tipo: '',
            piso: '',
            precioTotal: '',
            estado: 'DISPONIBLE',
            estadoLimpieza: 'LIMPIA',
            tipoVista: 'INTERIOR',
            cercaAscensor: false,
            tieneAireAcondicionado: false,
            capacidadPersonas: 1,
            coordenadaX: 0,
            coordenadaY: 0,
            observaciones: ''
        });
        onOpen();
    };

    const abrirModalEditar = (habitacion) => {
        setModoEdicion(true);
        setHabitacionActual(habitacion);
        setFormData({
            numeroHabitacion: habitacion.numeroHabitacion,
            tipo: habitacion.tipo,
            piso: habitacion.piso,
            precioTotal: habitacion.precioTotal,
            estado: habitacion.estado,
            estadoLimpieza: habitacion.estadoLimpieza || 'LIMPIA',
            tipoVista: habitacion.tipoVista || 'INTERIOR',
            cercaAscensor: habitacion.cercaAscensor || false,
            tieneAireAcondicionado: habitacion.tieneAireAcondicionado || false,
            capacidadPersonas: habitacion.capacidadPersonas || 1,
            coordenadaX: habitacion.coordenadaX || 0,
            coordenadaY: habitacion.coordenadaY || 0,
            observaciones: habitacion.observaciones || ''
        });
        onOpen();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = {
                ...formData,
                piso: parseInt(formData.piso),
                precioTotal: parseFloat(formData.precioTotal),
                capacidadPersonas: parseInt(formData.capacidadPersonas),
                coordenadaX: parseInt(formData.coordenadaX),
                coordenadaY: parseInt(formData.coordenadaY)
            };

            if (modoEdicion) {
                await habitacionService.actualizar(habitacionActual.idHabitacion, data);
                setSuccess('Habitación actualizada exitosamente');
            } else {
                await habitacionService.crear(data);
                setSuccess('Habitación creada exitosamente');
            }

            await cargarHabitaciones();
            onClose();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error al guardar habitación:', err);
            setError(err.response?.data?.error || 'Error al guardar la habitación');
        }
    };

    const confirmarEliminar = (habitacion) => {
        setHabitacionAEliminar(habitacion);
        onDeleteOpen();
    };

    const handleEliminar = async () => {
        try {
            await habitacionService.eliminar(habitacionAEliminar.idHabitacion);
            setSuccess('Habitación eliminada exitosamente');
            await cargarHabitaciones();
            onDeleteClose();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error al eliminar habitación:', err);
            setError(err.response?.data?.error || 'Error al eliminar la habitación');
            onDeleteClose();
        }
    };

    const getEstadoBadge = (estado) => {
        const config = {
            DISPONIBLE: { color: 'green', label: 'Disponible' },
            OCUPADA: { color: 'red', label: 'Ocupada' },
            MANTENIMIENTO: { color: 'gray', label: 'Mantenimiento' }
        };
        const { color, label } = config[estado] || { color: 'gray', label: estado };
        return <Badge colorScheme={color} fontSize="sm" px={3} py={1} rounded="full">{label}</Badge>;
    };

    return (
        <Box minH="100vh" className="bg-gradient-to-br from-gray-50 to-gray-100" p={6}>
            <Box maxW="7xl" mx="auto">
                <PageHeader
                    title="Gestión de Habitaciones"
                    description="Administra todas las habitaciones del hotel"
                    icon="🏨"
                    gradient="bg-gradient-primary"
                    actions={
                        <Button
                            leftIcon={<FiPlus />}
                            onClick={abrirModalNueva}
                            colorScheme="blue"
                            size="md"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                        >
                            Nueva Habitación
                        </Button>
                    }
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
                    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                        <InputGroup size="lg">
                            <InputLeftElement pointerEvents="none">
                                <FiSearch className="text-gray-400" />
                            </InputLeftElement>
                            <Input
                                placeholder="Buscar por número..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup size="lg">
                            <InputLeftElement pointerEvents="none">
                                <FiFilter className="text-gray-400" />
                            </InputLeftElement>
                            <Select
                                placeholder="Todos los tipos"
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                            >
                                <option value="SIMPLE">Simple</option>
                                <option value="DOBLE">Doble</option>
                                <option value="MATRIMONIAL">Matrimonial</option>
                                <option value="SUITE">Suite</option>
                                <option value="FAMILIAR">Familiar</option>
                            </Select>
                        </InputGroup>

                        <InputGroup size="lg">
                            <InputLeftElement pointerEvents="none">
                                <FiHome className="text-gray-400" />
                            </InputLeftElement>
                            <Select
                                placeholder="Todos los pisos"
                                value={filtroPiso}
                                onChange={(e) => setFiltroPiso(e.target.value)}
                            >
                                <option value="1">Piso 1</option>
                                <option value="2">Piso 2</option>
                                <option value="3">Piso 3</option>
                                <option value="4">Piso 4</option>
                            </Select>
                        </InputGroup>

                        <Button
                            onClick={() => {
                                setFiltroTipo('');
                                setFiltroPiso('');
                                setBusqueda('');
                            }}
                            size="lg"
                            variant="outline"
                        >
                            Limpiar Filtros
                        </Button>
                    </SimpleGrid>
                </Box>

                {/* Tabla */}
                <Box bg="white" rounded="2xl" boxShadow="xl" overflowX="auto" className="animate-fadeIn">
                    {loading ? (
                        <Box p={12} textAlign="center">
                            <Spinner size="xl" color="purple.500" thickness="4px" />
                            <Text mt={4} color="gray.600">Cargando habitaciones...</Text>
                        </Box>
                    ) : habitacionesFiltradas.length === 0 ? (
                        <Box p={12} textAlign="center">
                            <Text fontSize="xl" color="gray.500">🏨 No hay habitaciones para mostrar</Text>
                            <Text fontSize="sm" color="gray.400" mt={2}>Intenta ajustar los filtros o crea una nueva</Text>
                        </Box>
                    ) : (
                        <Table variant="simple">
                            <Thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                                <Tr>
                                    <Th>Número</Th>
                                    <Th>Tipo</Th>
                                    <Th>Piso</Th>
                                    <Th>Precio</Th>
                                    <Th>Estado</Th>
                                    <Th>Capacidad</Th>
                                    <Th>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {habitacionesFiltradas.map((habitacion) => (
                                    <Tr key={habitacion.idHabitacion} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                                        <Td fontWeight="bold">{habitacion.numeroHabitacion}</Td>
                                        <Td>
                                            <Badge colorScheme="purple">{habitacion.tipo}</Badge>
                                        </Td>
                                        <Td>Piso {habitacion.piso}</Td>
                                        <Td fontWeight="semibold" color="green.600">S/ {habitacion.precioTotal}</Td>
                                        <Td>{getEstadoBadge(habitacion.estado)}</Td>
                                        <Td>{habitacion.capacidadPersonas || 1} personas</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <Button
                                                    size="sm"
                                                    leftIcon={<FiEdit />}
                                                    colorScheme="blue"
                                                    onClick={() => abrirModalEditar(habitacion)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    leftIcon={<FiTrash2 />}
                                                    colorScheme="red"
                                                    onClick={() => confirmarEliminar(habitacion)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </Box>
            </Box>

            {/* Modal Crear/Editar */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent>
                    <ModalHeader className="bg-gradient-primary text-white rounded-t-lg">
                        {modoEdicion ? 'Editar Habitación' : 'Nueva Habitación'}
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <form onSubmit={handleSubmit}>
                        <ModalBody py={6}>
                            <VStack spacing={4}>
                                <SimpleGrid columns={2} spacing={4} w="full">
                                    <FormControl isRequired>
                                        <FormLabel>Número de Habitación</FormLabel>
                                        <Input
                                            name="numeroHabitacion"
                                            value={formData.numeroHabitacion}
                                            onChange={handleChange}
                                            placeholder="Ej: 101"
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select
                                            name="tipo"
                                            value={formData.tipo}
                                            onChange={handleChange}
                                            placeholder="Seleccione tipo"
                                        >
                                            <option value="SIMPLE">Simple</option>
                                            <option value="DOBLE">Doble</option>
                                            <option value="MATRIMONIAL">Matrimonial</option>
                                            <option value="SUITE">Suite</option>
                                            <option value="FAMILIAR">Familiar</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Piso</FormLabel>
                                        <Select
                                            name="piso"
                                            value={formData.piso}
                                            onChange={handleChange}
                                            placeholder="Seleccione piso"
                                        >
                                            <option value="1">Piso 1</option>
                                            <option value="2">Piso 2</option>
                                            <option value="3">Piso 3</option>
                                            <option value="4">Piso 4</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Precio por Noche</FormLabel>
                                        <Input
                                            name="precioTotal"
                                            type="number"
                                            step="0.01"
                                            value={formData.precioTotal}
                                            onChange={handleChange}
                                            placeholder="Ej: 100.00"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Capacidad</FormLabel>
                                        <Input
                                            name="capacidadPersonas"
                                            type="number"
                                            value={formData.capacidadPersonas}
                                            onChange={handleChange}
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Estado</FormLabel>
                                        <Select
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleChange}
                                        >
                                            <option value="DISPONIBLE">Disponible</option>
                                            <option value="OCUPADA">Ocupada</option>
                                            <option value="MANTENIMIENTO">Mantenimiento</option>
                                        </Select>
                                    </FormControl>
                                </SimpleGrid>

                                <SimpleGrid columns={2} spacing={4} w="full">
                                    <Checkbox
                                        name="cercaAscensor"
                                        isChecked={formData.cercaAscensor}
                                        onChange={handleChange}
                                    >
                                        Cerca del ascensor
                                    </Checkbox>

                                    <Checkbox
                                        name="tieneAireAcondicionado"
                                        isChecked={formData.tieneAireAcondicionado}
                                        onChange={handleChange}
                                    >
                                        Aire acondicionado
                                    </Checkbox>
                                </SimpleGrid>

                                <FormControl>
                                    <FormLabel>Observaciones</FormLabel>
                                    <Input
                                        name="observaciones"
                                        value={formData.observaciones}
                                        onChange={handleChange}
                                        placeholder="Observaciones adicionales"
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-gradient-primary" color="white">
                                {modoEdicion ? 'Actualizar' : 'Crear'}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            {/* AlertDialog Eliminar */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Habitación
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro de eliminar la habitación <strong>{habitacionAEliminar?.numeroHabitacion}</strong>?
                            Esta acción no se puede deshacer.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={handleEliminar} ml={3}>
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default GestionHabitaciones;
