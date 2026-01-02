import React from 'react';
import { FaSnowflake } from 'react-icons/fa';
import { MdElevator, MdLandscape } from 'react-icons/md';

const HabitacionCard = ({ habitacion, seleccionada, onClick }) => {
    // Determinar color según estado
    const getColorEstado = () => {
        if (seleccionada) return 'bg-blue-500 border-blue-600';

        if (habitacion.estado === 'OCUPADA') {
            return 'bg-red-500 border-red-600 cursor-not-allowed';
        }

        if (habitacion.estado === 'MANTENIMIENTO') {
            return 'bg-gray-500 border-gray-600 cursor-not-allowed';
        }

        // DISPONIBLE
        if (habitacion.estadoLimpieza === 'LIMPIA') {
            return 'bg-green-500 border-green-600 hover:bg-green-600 cursor-pointer';
        } else if (habitacion.estadoLimpieza === 'SUCIA') {
            return 'bg-yellow-500 border-yellow-600 hover:bg-yellow-600 cursor-pointer';
        } else {
            return 'bg-orange-400 border-orange-500 hover:bg-orange-500 cursor-pointer';
        }
    };

    const esClickeable = habitacion.estado === 'DISPONIBLE';

    const handleClick = () => {
        if (esClickeable && onClick) {
            onClick(habitacion);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
                relative p-3 rounded-lg border-2 transition-all duration-200
                ${getColorEstado()}
                ${seleccionada ? 'ring-4 ring-blue-300 scale-105' : ''}
                ${esClickeable ? 'transform hover:scale-105' : 'opacity-75'}
                min-h-[80px] flex flex-col justify-between
            `}
        >
            {/* Número de habitación */}
            <div className="text-white font-bold text-lg text-center">
                {habitacion.numeroHabitacion}
            </div>

            {/* Iconos de características */}
            <div className="flex justify-center gap-2 mt-2">
                {habitacion.tieneAireAcondicionado && (
                    <FaSnowflake className="text-white text-sm" title="Aire acondicionado" />
                )}
                {habitacion.cercaAscensor && (
                    <MdElevator className="text-white text-sm" title="Cerca del ascensor" />
                )}
                {habitacion.tipoVista && habitacion.tipoVista !== 'SIN_VISTA' && (
                    <MdLandscape className="text-white text-sm" title={habitacion.tipoVista} />
                )}
            </div>

            {/* Indicador de estado de limpieza (solo si está disponible) */}
            {habitacion.estado === 'DISPONIBLE' && habitacion.estadoLimpieza === 'SUCIA' && (
                <div className="absolute top-1 right-1 bg-white rounded-full px-2 py-0.5">
                    <span className="text-xs font-semibold text-yellow-700">🧹</span>
                </div>
            )}

            {/* Indicador de mantenimiento */}
            {habitacion.estado === 'MANTENIMIENTO' && (
                <div className="absolute top-1 right-1 bg-white rounded-full px-2 py-0.5">
                    <span className="text-xs font-semibold">⚠️</span>
                </div>
            )}
        </div>
    );
};

export default HabitacionCard;
