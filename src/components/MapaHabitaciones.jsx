import React, { useState, useEffect } from 'react';
import HabitacionCard from './HabitacionCard';
import { habitacionService } from '../services/habitacionService';

const MapaHabitaciones = ({ pisoActual, filtros, onSeleccionarHabitacion }) => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarHabitaciones();
    }, [pisoActual, filtros]);

    const cargarHabitaciones = async () => {
        setCargando(true);
        try {
            let data;

            // Si hay filtros aplicados, usar el endpoint de filtrado
            if (Object.keys(filtros).length > 0) {
                const filtrosConPiso = { ...filtros };
                if (pisoActual) {
                    filtrosConPiso.piso = pisoActual;
                }
                data = await habitacionService.filtrarHabitaciones(filtrosConPiso);
            } else {
                // Si no hay filtros, obtener por piso o todas
                data = await habitacionService.getMapaHabitaciones(pisoActual);
            }

            setHabitaciones(data);
        } catch (error) {
            console.error('Error al cargar habitaciones:', error);
        } finally {
            setCargando(false);
        }
    };

    const handleSeleccionarHabitacion = (habitacion) => {
        setHabitacionSeleccionada(habitacion);
        if (onSeleccionarHabitacion) {
            onSeleccionarHabitacion(habitacion);
        }
    };

    // Agrupar habitaciones por coordenadas
    const agruparPorCoordenadas = () => {
        const grupos = {};
        habitaciones.forEach(hab => {
            const key = `${hab.coordenadaY}-${hab.coordenadaX}`;
            if (!grupos[key]) {
                grupos[key] = [];
            }
            grupos[key].push(hab);
        });
        return grupos;
    };

    // Obtener dimensiones del grid
    const getDimensionesGrid = () => {
        if (habitaciones.length === 0) return { filas: 0, columnas: 0 };

        const maxY = Math.max(...habitaciones.map(h => h.coordenadaY || 0));
        const maxX = Math.max(...habitaciones.map(h => h.coordenadaX || 0));

        return { filas: maxY + 1, columnas: maxX + 1 };
    };

    const { filas, columnas } = getDimensionesGrid();
    const grupos = agruparPorCoordenadas();

    if (cargando) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando habitaciones...</span>
                </div>
            </div>
        );
    }

    if (habitaciones.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">No se encontraron habitaciones</p>
                    <p className="text-sm mt-1">Intenta ajustar los filtros</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Mapa de Habitaciones {pisoActual ? `- Piso ${pisoActual}` : ''}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {habitaciones.length} habitación{habitaciones.length !== 1 ? 'es' : ''} encontrada{habitaciones.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Grid de habitaciones */}
            <div
                className="grid gap-6"
                style={{
                    gridTemplateColumns: `repeat(${columnas}, minmax(100px, 1fr))`,
                    gridTemplateRows: `repeat(${filas}, auto)`
                }}
            >
                {Array.from({ length: filas }).map((_, y) =>
                    Array.from({ length: columnas }).map((_, x) => {
                        const key = `${y}-${x}`;
                        const habitacionesEnPosicion = grupos[key] || [];

                        if (habitacionesEnPosicion.length === 0) {
                            return <div key={key} className="min-h-[100px]"></div>;
                        }

                        // Si hay múltiples habitaciones en la misma posición, mostrar la primera
                        const habitacion = habitacionesEnPosicion[0];

                        return (
                            <HabitacionCard
                                key={habitacion.idHabitacion}
                                habitacion={habitacion}
                                seleccionada={habitacionSeleccionada?.idHabitacion === habitacion.idHabitacion}
                                onClick={handleSeleccionarHabitacion}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MapaHabitaciones;
