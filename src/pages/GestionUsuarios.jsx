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
    Switch,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Text,
    Spinner,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiPlus, FiEdit, FiTrash2, FiUser } from 'react-icons/fi';
import { usuarioService } from '../services/usuarioService';
import { getUser } from '../services/authService';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Usuario actual (para evitar auto-eliminación)
    const usuarioActual = getUser();

    // Filtros
    const [filtroRol, setFiltroRol] = useState('');
    const [filtroActivo, setFiltroActivo] = useState('');
    const [busqueda, setBusqueda] = useState('');

    // Modal crear/editar
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modoEdicion, setModoEdicion] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rol: 'RECEPCIONISTA',
        activo: true
    });

    // Modal eliminar
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const cancelRef = React.useRef();

    useEffect(() => {
        cargarUsuarios();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [usuarios, filtroRol, filtroActivo, busqueda]);

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const data = await usuarioService.listarTodos();
            setUsuarios(data);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let resultado = [...usuarios];

        if (filtroRol) {
            resultado = resultado.filter(u => u.rol === filtroRol);
        }

        if (filtroActivo !== '') {
            const activo = filtroActivo === 'true';
            resultado = resultado.filter(u => u.activo === activo);
        }

        if (busqueda) {
            resultado = resultado.filter(u =>
                u.username.toLowerCase().includes(busqueda.toLowerCase())
            );
        }

        setUsuariosFiltrados(resultado);
    };

    const abrirModalNuevo = () => {
        setModoEdicion(false);
        setUsuarioEditando(null);
        setFormData({
            username: '',
            password: '',
            rol: 'RECEPCIONISTA',
            activo: true
        });
        onOpen();
    };

    const abrirModalEditar = (usuario) => {
        setModoEdicion(true);
        setUsuarioEditando(usuario);
        setFormData({
            username: usuario.username,
            password: '', // No mostrar password actual
            rol: usuario.rol,
            activo: usuario.activo
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
                username: formData.username,
                rol: formData.rol,
                activo: formData.activo
            };

            // Solo incluir password si se proporciona
            if (formData.password) {
                data.password = formData.password;
            }

            if (modoEdicion) {
                // En modo edición, si no hay password, no lo enviamos
                if (!formData.password) {
                    delete data.password;
                }
                await usuarioService.actualizar(usuarioEditando.idUsuario, data);
                setSuccess('Usuario actualizado exitosamente');
            } else {
                // En modo creación, el password es obligatorio
                if (!formData.password) {
                    setError('La contraseña es obligatoria para nuevos usuarios');
                    return;
                }
                await usuarioService.crear(data);
                setSuccess('Usuario creado exitosamente');
            }

            await cargarUsuarios();
            onClose();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error al guardar usuario:', err);
            setError(err.response?.data?.error || 'Error al guardar el usuario');
        }
    };

    const confirmarEliminar = (usuario) => {
        // Validar que no sea el usuario actual
        if (usuario.idUsuario === usuarioActual.idUsuario) {
            setError('No puedes eliminar tu propio usuario');
            setTimeout(() => setError(''), 3000);
            return;
        }

        // Advertir si es el último admin
        const admins = usuarios.filter(u => u.rol === 'ADMIN');
        if (usuario.rol === 'ADMIN' && admins.length === 1) {
            setError('No puedes eliminar el último administrador del sistema');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setUsuarioAEliminar(usuario);
        onDeleteOpen();
    };

    const handleEliminar = async () => {
        try {
            await usuarioService.eliminar(usuarioAEliminar.idUsuario);
            setSuccess('Usuario eliminado exitosamente');
            await cargarUsuarios();
            onDeleteClose();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            setError(err.response?.data?.error || 'Error al eliminar el usuario');
            onDeleteClose();
        }
    };

    const getRolBadge = (rol) => {
        const config = {
            ADMIN: { color: 'purple', label: 'Administrador' },
            RECEPCIONISTA: { color: 'blue', label: 'Recepcionista' }
        };
        const { color, label } = config[rol] || { color: 'gray', label: rol };
        return <Badge colorScheme={color} fontSize="sm" px={3} py={1} rounded="full">{label}</Badge>;
    };

    const getActivoBadge = (activo) => {
        return activo ? (
            <Badge colorScheme="green" fontSize="sm" px={3} py={1} rounded="full">Activo</Badge>
        ) : (
            <Badge colorScheme="red" fontSize="sm" px={3} py={1} rounded="full">Inactivo</Badge>
        );
    };

    return (
        <Box minH="100vh" className="bg-gradient-to-br from-gray-50 to-gray-100" p={6}>
            <Box maxW="7xl" mx="auto">
                <PageHeader
                    title="Gestión de Usuarios"
                    description="Administra los usuarios del sistema"
                    icon="👥"
                    gradient="bg-gradient-secondary"
                    actions={
                        <Button
                            leftIcon={<FiPlus />}
                            onClick={abrirModalNuevo}
                            colorScheme="purple"
                            size="md"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                        >
                            Nuevo Usuario
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
                                placeholder="Buscar por username..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup size="lg">
                            <InputLeftElement pointerEvents="none">
                                <FiFilter className="text-gray-400" />
                            </InputLeftElement>
                            <Select
                                placeholder="Todos los roles"
                                value={filtroRol}
                                onChange={(e) => setFiltroRol(e.target.value)}
                            >
                                <option value="ADMIN">Administrador</option>
                                <option value="RECEPCIONISTA">Recepcionista</option>
                            </Select>
                        </InputGroup>

                        <InputGroup size="lg">
                            <InputLeftElement pointerEvents="none">
                                <FiUser className="text-gray-400" />
                            </InputLeftElement>
                            <Select
                                placeholder="Todos los estados"
                                value={filtroActivo}
                                onChange={(e) => setFiltroActivo(e.target.value)}
                            >
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </Select>
                        </InputGroup>

                        <Button
                            onClick={() => {
                                setFiltroRol('');
                                setFiltroActivo('');
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
                            <Text mt={4} color="gray.600">Cargando usuarios...</Text>
                        </Box>
                    ) : usuariosFiltrados.length === 0 ? (
                        <Box p={12} textAlign="center">
                            <Text fontSize="xl" color="gray.500">👥 No hay usuarios para mostrar</Text>
                            <Text fontSize="sm" color="gray.400" mt={2}>Intenta ajustar los filtros o crea uno nuevo</Text>
                        </Box>
                    ) : (
                        <Table variant="simple">
                            <Thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Username</Th>
                                    <Th>Rol</Th>
                                    <Th>Estado</Th>
                                    <Th>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {usuariosFiltrados.map((usuario) => (
                                    <Tr key={usuario.idUsuario} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                                        <Td fontWeight="bold">#{usuario.idUsuario}</Td>
                                        <Td>
                                            <Text fontWeight="medium">{usuario.username}</Text>
                                            {usuario.idUsuario === usuarioActual.idUsuario && (
                                                <Badge colorScheme="orange" fontSize="xs" ml={2}>Tú</Badge>
                                            )}
                                        </Td>
                                        <Td>{getRolBadge(usuario.rol)}</Td>
                                        <Td>{getActivoBadge(usuario.activo)}</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <Button
                                                    size="sm"
                                                    leftIcon={<FiEdit />}
                                                    colorScheme="blue"
                                                    onClick={() => abrirModalEditar(usuario)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    leftIcon={<FiTrash2 />}
                                                    colorScheme="red"
                                                    onClick={() => confirmarEliminar(usuario)}
                                                    isDisabled={usuario.idUsuario === usuarioActual.idUsuario}
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
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent>
                    <ModalHeader className="bg-gradient-secondary text-white rounded-t-lg">
                        {modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <form onSubmit={handleSubmit}>
                        <ModalBody py={6}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Ej: usuario123"
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired={!modoEdicion}>
                                    <FormLabel>
                                        Contraseña {modoEdicion && '(dejar vacío para no cambiar)'}
                                    </FormLabel>
                                    <Input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder={modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                                        size="lg"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Rol</FormLabel>
                                    <Select
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleChange}
                                        size="lg"
                                    >
                                        <option value="RECEPCIONISTA">Recepcionista</option>
                                        <option value="ADMIN">Administrador</option>
                                    </Select>
                                </FormControl>

                                <FormControl display="flex" alignItems="center">
                                    <FormLabel mb="0">Usuario Activo</FormLabel>
                                    <Switch
                                        name="activo"
                                        isChecked={formData.activo}
                                        onChange={handleChange}
                                        colorScheme="green"
                                        size="lg"
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" colorScheme="purple">
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
                            Eliminar Usuario
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro de eliminar al usuario <strong>{usuarioAEliminar?.username}</strong>?
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

export default GestionUsuarios;
