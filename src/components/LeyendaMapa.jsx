import React from 'react';
import { FaSnowflake } from 'react-icons/fa';
import { MdElevator, MdLandscape } from 'react-icons/md';

const LeyendaMapa = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Leyenda</h3>

            {/* Estados */}
            <div className="mb-5">
                <p className="text-sm font-medium text-gray-600 mb-3">Estados</p>
                <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded flex-shrink-0 border-2 border-green-600"></div>
                        <span className="text-sm text-gray-700">Disponible - Limpia</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-yellow-500 rounded flex-shrink-0 border-2 border-yellow-600"></div>
                        <span className="text-sm text-gray-700">Disponible - Sucia</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-red-500 rounded flex-shrink-0 border-2 border-red-600"></div>
                        <span className="text-sm text-gray-700">Ocupada</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-500 rounded flex-shrink-0 border-2 border-gray-600"></div>
                        <span className="text-sm text-gray-700">Mantenimiento</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-blue-500 rounded flex-shrink-0 border-2 border-blue-600"></div>
                        <span className="text-sm text-gray-700">Seleccionada</span>
                    </div>
                </div>
            </div>

            {/* Iconos */}
            <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-600 mb-3">Características</p>
                <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                        <FaSnowflake className="text-blue-500 text-base flex-shrink-0" />
                        <span className="text-sm text-gray-700">Aire acondicionado</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MdElevator className="text-gray-600 text-base flex-shrink-0" />
                        <span className="text-sm text-gray-700">Cerca del ascensor</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MdLandscape className="text-green-600 text-base flex-shrink-0" />
                        <span className="text-sm text-gray-700">Con vista</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeyendaMapa;
