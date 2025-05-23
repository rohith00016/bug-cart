import React from 'react';

const LoginPromptModal = ({ onClose, onLogin, onSignup }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-md w-[90%] max-w-md p-6 sm:p-8 relative">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">You are not logged in</h2>
        <p className="text-sm text-gray-600 mt-2">Please login or signup to proceed with checkout.</p>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={onLogin}
            className="bg-black text-white px-5 py-2 text-sm rounded hover:bg-gray-800 transition"
          >
            Login
          </button>
          <button
            onClick={onSignup}
            className="border border-gray-400 text-sm px-5 py-2 rounded hover:bg-slate-100 transition"
          >
            Signup
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;
