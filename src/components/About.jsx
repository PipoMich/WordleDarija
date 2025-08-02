import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Make sure the path is correct

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4 text-green-400">About Wordle Darija 🇲🇦</h1>
          <p className="mb-6 text-gray-300 text-lg">
            Wordle Darija hiya version mn l3ba Wordle, walakin b kalimat mn Darija (Maktoobin b Latin). 3endk 6 mohawalat bach tchouf chi kelma li fiha 5 horouf.
          </p>
          <p className="mb-6 text-gray-400">
            Made with ❤️ f Morocco, hadi l3ba li katjma3 bin taalim, l7ib, o lma3rifa. Wach t9der tchouf lkalma dial nhar? 🌟
          </p>

          <p className="mb-10 text-sm text-gray-500 italic">
            Created by <span className="text-white font-semibold">RICH ONE MILLIARDS</span> – All rights reserved © 2025
          </p>

          <button
            onClick={() => navigate('/hero')}
            className="px-6 py-2 bg-green-500 text-black rounded font-semibold hover:bg-green-600 transition-colors"
          >
            ⬅ Back to Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;

