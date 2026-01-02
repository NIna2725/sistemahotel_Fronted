import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapaHabitaciones from '../components/MapaHabitaciones';
import FiltrosHabitacion from '../components/FiltrosHabitacion';
import SelectorPiso from '../components/SelectorPiso';
import LeyendaMapa from '../components/LeyendaMapa';
import ModalDetalleHabitacion from '../components/ModalDetalleHabitacion';
import { habitacionService } from '../services/habitacionService';

const AsignacionHabitaciones = () => {
    const navigate = useNavigate();
    const [pisoActual, setPisoActual] = useState(1);
    const [filtros, setFiltros] = useState({ estado: 'DISPONIBLE' });
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [habitacionesPorPiso, setHabitacionesPorPiso] = useState({});
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        disponibles: 0,
        ocupadas: 0,
        mantenimiento: 0
    });

    useEffect(() => {
        cargarConteosPorPiso();
        cargarEstadisticas();
    }, []);

    const cargarConteosPorPiso = async () => {
        try {
            const conteos = {};
            for (let piso = 1; piso <= 4; piso++) {
                const habitaciones = await habitacionService.getDisponiblesPorPiso(piso);
                conteos[piso] = habitaciones.length;
            }
            setHabitacionesPorPiso(conteos);
        } catch (error) {
            console.error('Error al cargar conteos por piso:', error);
        }
    };

    const cargarEstadisticas = async () => {
        try {
            const todas = await habitacionService.listarTodas();
            const stats = {
                total: todas.length,
                disponibles: todas.filter(h => h.estado === 'DISPONIBLE').length,
                ocupadas: todas.filter(h => h.estado === 'OCUPADA').length,
                mantenimiento: todas.filter(h => h.estado === 'MANTENIMIENTO').length
            };
            setEstadisticas(stats);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const handleCambioPiso = (piso) => {
        setPisoActual(piso);
    };

    const handleFiltrosChange = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
    };

    const handleSeleccionarHabitacion = (habitacion) => {
        setHabitacionSeleccionada(habitacion);
        setModalAbierto(true);
    };

    const handleCerrarModal = () => {
        setModalAbierto(false);
        setHabitacionSeleccionada(null);
    };

    const handleAsignarHabitacion = (habitacion) => {
        // Aquí puedes integrar con el flujo de reservas
        // Por ahora, simplemente navegamos a la página de reservas con la habitación seleccionada
        console.log('Habitación asignada:', habitacion);

        // Opción 1: Navegar a reservas con el ID de la habitación
        navigate('/reservas', { state: { habitacionSeleccionada: habitacion } });

        // Opción 2: Mostrar mensaje de éxito y cerrar modal
        // alert(`Habitación ${habitacion.numeroHabitacion} asignada correctamente`);
        // handleCerrarModal();
        // cargarConteosPorPiso(); // Recargar conteos
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header con estadísticas */}
                <div className="mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                                    <span className="text-4xl">🏨</span>
                                    Mapa de Habitaciones
                                </h1>
                                <p className="text-gray-600 mt-1">Visualiza y asigna habitaciones de forma interactiva</p>
                            </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                <div className="text-sm text-blue-600 font-medium">Total</div>
                                <div className="text-2xl font-bold text-blue-700">{estadisticas.total}</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                <div className="text-sm text-green-600 font-medium">Disponibles</div>
                                <div className="text-2xl font-bold text-green-700">{estadisticas.disponibles}</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                                <div className="text-sm text-red-600 font-medium">Ocupadas</div>
                                <div className="text-2xl font-bold text-red-700">{estadisticas.ocupadas}</div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-300">
                                <div className="text-sm text-gray-600 font-medium">Mantenimiento</div>
                                <div className="text-2xl font-bold text-gray-700">{estadisticas.mantenimiento}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selector de Piso */}
                <div className="mb-6">
                    <SelectorPiso
                        pisoActual={pisoActual}
                        onCambioPiso={handleCambioPiso}
                        habitacionesPorPiso={habitacionesPorPiso}
                    />
                </div>

                {/* Layout principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filtros y Leyenda (sidebar) */}
                    <div className="lg:col-span-1 space-y-4">
                        <FiltrosHabitacion onFiltrosChange={handleFiltrosChange} />
                        <LeyendaMapa />
                    </div>

                    {/* Mapa de habitaciones */}
                    <div className="lg:col-span-3">
                        <MapaHabitaciones
                            pisoActual={pisoActual}
                            filtros={filtros}
                            onSeleccionarHabitacion={handleSeleccionarHabitacion}
                        />
                    </div>
                </div>


            </div>

            {/* Modal de detalle */}
            <ModalDetalleHabitacion
                habitacion={habitacionSeleccionada}
                isOpen={modalAbierto}
                onClose={handleCerrarModal}
                onAsignar={handleAsignarHabitacion}
            />
        </div>
    );
};

export default AsignacionHabitaciones;
