import React from "react";

const AlertMessage = ({ message, type, onClose }) => {
    return (
        <div className={`p-4 rounded-md ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} mb-4`}>
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button onClick={onClose} className="text-lg font-bold">&times;</button>
            </div>
        </div>
    );
};

export default AlertMessage;
