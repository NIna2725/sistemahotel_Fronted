import React from 'react';

const PageHeader = ({ title, description, icon, actions, gradient = "bg-gradient-primary" }) => {
    return (
        <div className={`${gradient} rounded-xl shadow-lg p-6 mb-6 text-white animate-fadeIn`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className="text-5xl md:text-6xl">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
                        {description && (
                            <p className="text-white/90 mt-1 text-sm md:text-base">{description}</p>
                        )}
                    </div>
                </div>
                {actions && (
                    <div className="flex gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
