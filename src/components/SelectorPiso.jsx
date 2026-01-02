import React from 'react';

const SelectorPiso = ({ pisoActual, onCambioPiso, habitacionesPorPiso = {} }) => {
    const pisos = [1, 2, 3, 4];

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Seleccionar Piso</h3>

            <div className="flex gap-2">
                {pisos.map((piso) => {
                    const disponibles = habitacionesPorPiso[piso] || 0;
                    const esActivo = pisoActual === piso;

                    return (
                        <button
                            key={piso}
                            onClick={() => onCambioPiso(piso)}
                            className={`
                                flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200
                                ${esActivo
                                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                            `}
                        >
                            <div className="text-center">
                                <div className="text-lg">Piso {piso}</div>
                                {disponibles > 0 && (
                                    <div className={`text-xs mt-1 ${esActivo ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {disponibles} disponible{disponibles !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Botón para ver todos */}
            <button
                onClick={() => onCambioPiso(null)}
                className={`
                    w-full mt-3 py-2 px-4 rounded-lg font-medium transition-all duration-200
                    ${pisoActual === null
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                `}
            >
                Ver Todos los Pisos
            </button>
        </div>
    );
};

export default SelectorPiso;
