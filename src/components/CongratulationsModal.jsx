import React from 'react';
import { useNavigate } from 'react-router-dom';

function CongratulationsModal({ onClose, guesses }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 BRAVO!</h2>
        <p className="mb-2">
          Jebtiha f <span className="font-bold">{guesses} mohawala!</span>
        </p>
        <p className="text-gray-700">Wach t7eb tel3ab 3awd tani?</p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-500 text-black rounded font-semibold hover:bg-green-600 transition-colors"
          >
            OK
          </button>

          <button
            onClick={() => navigate('/about')}
            className="px-6 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition-colors"
          >
            ➤ Go to About Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default CongratulationsModal;
