import React, { useState } from 'react';

const FiltrosHabitacion = ({ onFiltrosChange }) => {
    const [filtros, setFiltros] = useState({
        tipo: '',
        soloLimpias: false,
        tieneAireAcondicionado: false,
        cercaAscensor: false
    });

    const handleChangeTipo = (e) => {
        const nuevosFiltros = { ...filtros, tipo: e.target.value };
        setFiltros(nuevosFiltros);
        aplicarFiltros(nuevosFiltros);
    };

    const handleChangeCheckbox = (campo) => {
        const nuevosFiltros = { ...filtros, [campo]: !filtros[campo] };
        setFiltros(nuevosFiltros);
        aplicarFiltros(nuevosFiltros);
    };

    const aplicarFiltros = (nuevosFiltros) => {
        const filtrosAPI = {
            estado: 'DISPONIBLE' // Siempre mostrar solo disponibles
        };

        if (nuevosFiltros.tipo) {
            filtrosAPI.tipo = nuevosFiltros.tipo;
        }

        if (nuevosFiltros.soloLimpias) {
            filtrosAPI.estadoLimpieza = 'LIMPIA';
        }

        if (nuevosFiltros.tieneAireAcondicionado) {
            filtrosAPI.tieneAireAcondicionado = true;
        }

        if (nuevosFiltros.cercaAscensor) {
            filtrosAPI.cercaAscensor = true;
        }

        onFiltrosChange(filtrosAPI);
    };

    const limpiarFiltros = () => {
        const filtrosVacios = {
            tipo: '',
            soloLimpias: false,
            tieneAireAcondicionado: false,
            cercaAscensor: false
        };
        setFiltros(filtrosVacios);
        onFiltrosChange({ estado: 'DISPONIBLE' });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
                <button
                    onClick={limpiarFiltros}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Limpiar
                </button>
            </div>

            <div className="space-y-3">
                {/* Filtro por tipo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Habitación
                    </label>
                    <select
                        value={filtros.tipo}
                        onChange={handleChangeTipo}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Todos los tipos</option>
                        <option value="SIMPLE">Simple</option>
                        <option value="DOBLE">Doble</option>
                        <option value="MATRIMONIAL">Matrimonial</option>
                        <option value="SUITE">Suite</option>
                        <option value="FAMILIAR">Familiar</option>
                    </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filtros.soloLimpias}
                            onChange={() => handleChangeCheckbox('soloLimpias')}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Solo habitaciones limpias</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filtros.tieneAireAcondicionado}
                            onChange={() => handleChangeCheckbox('tieneAireAcondicionado')}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Con aire acondicionado</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filtros.cercaAscensor}
                            onChange={() => handleChangeCheckbox('cercaAscensor')}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Cerca del ascensor</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default FiltrosHabitacion;
