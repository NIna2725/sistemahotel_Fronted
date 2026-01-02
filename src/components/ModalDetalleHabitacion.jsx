import React from 'react';

const ModalDetalleHabitacion = ({ habitacion, isOpen, onClose, onAsignar }) => {
    if (!isOpen || !habitacion) return null;

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(precio);
    };

    const getEstadoTexto = (estado) => {
        const estados = {
            'DISPONIBLE': 'Disponible',
            'OCUPADA': 'Ocupada',
            'MANTENIMIENTO': 'En Mantenimiento'
        };
        return estados[estado] || estado;
    };

    const getLimpiezaTexto = (limpieza) => {
        const limpiezas = {
            'LIMPIA': 'Limpia',
            'SUCIA': 'Sucia',
            'EN_LIMPIEZA': 'En Limpieza'
        };
        return limpiezas[limpieza] || limpieza;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Habitación {habitacion.numeroHabitacion}</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-blue-100 text-sm mt-1">{habitacion.tipo}</p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Información básica */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Piso</p>
                            <p className="font-semibold text-gray-800">{habitacion.piso}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Capacidad</p>
                            <p className="font-semibold text-gray-800">
                                {habitacion.capacidadPersonas} persona{habitacion.capacidadPersonas !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Estado</p>
                            <p className={`font-semibold ${habitacion.estado === 'DISPONIBLE' ? 'text-green-600' :
                                    habitacion.estado === 'OCUPADA' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                {getEstadoTexto(habitacion.estado)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Limpieza</p>
                            <p className={`font-semibold ${habitacion.estadoLimpieza === 'LIMPIA' ? 'text-green-600' :
                                    habitacion.estadoLimpieza === 'SUCIA' ? 'text-yellow-600' : 'text-orange-600'
                                }`}>
                                {getLimpiezaTexto(habitacion.estadoLimpieza)}
                            </p>
                        </div>
                    </div>

                    {/* Características */}
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Características</p>
                        <div className="flex flex-wrap gap-2">
                            {habitacion.tieneAireAcondicionado && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                    ❄️ Aire acondicionado
                                </span>
                            )}
                            {habitacion.cercaAscensor && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                    🛗 Cerca del ascensor
                                </span>
                            )}
                            {habitacion.tipoVista && habitacion.tipoVista !== 'SIN_VISTA' && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                    🏔️ Vista: {habitacion.tipoVista}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Precio */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Precio por noche</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {formatearPrecio(habitacion.precioTotal)}
                        </p>
                    </div>

                    {/* Observaciones */}
                    {habitacion.observaciones && (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Observaciones</p>
                            <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded border border-yellow-200">
                                {habitacion.observaciones}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 rounded-b-lg flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                    >
                        Cancelar
                    </button>
                    {habitacion.estado === 'DISPONIBLE' && (
                        <button
                            onClick={() => onAsignar(habitacion)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Asignar Habitación
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalDetalleHabitacion;
