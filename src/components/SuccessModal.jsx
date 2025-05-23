import React from 'react';
import { assets } from '../assets/assets';

const SuccessModal = ({ message = "Order Placed Successfully!", subMessage = "Thank you for your purchase.", onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%] max-w-sm">
        <img src={assets.quality_icon} alt="Success" className="mx-auto w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold text-green-600 mb-2">{message}</h2>
        <p className="text-gray-600 mb-6">{subMessage}</p>
        <button
          onClick={onClose}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
