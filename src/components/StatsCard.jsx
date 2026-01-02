import React from 'react';

const StatsCard = ({
    title,
    value,
    icon,
    gradient = "from-blue-500 to-blue-600",
    trend,
    trendValue
}) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 card-hover animate-fadeIn">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <span>{trend === 'up' ? '↑' : '↓'}</span>
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl text-white text-3xl`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
