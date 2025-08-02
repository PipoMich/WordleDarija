import React, { useState } from 'react';
import { Link } from 'react-router-dom';
 // Adjust this path based on your folder structure

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-black text-white px-6 py-4 shadow-md flex items-center justify-between relative z-50 mt-0">
      {/* Left Section: Title */}
      <div className="text-xl font-bold text-green-400 w-1/3">
        Wordle Darija
      </div>

      {/* Center Section: Logo */}
      <div className="w-1/3 flex justify-center">
        <img
          src='/logo.png'
          alt="Logo"
          className="h-12 md:h-20 object-contain"
        />
      </div>

      {/* Right Section: Desktop Links */}
      <div className="hidden md:flex justify-end items-center space-x-6 w-1/3 text-lg">
        <Link to="/hero" className="hover:text-green-400 transition-colors">Play</Link>
        <Link to="/about" className="hover:text-green-400 transition-colors">About</Link>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="md:hidden text-white text-3xl absolute right-6 top-4"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        {menuOpen ? '✕' : '≡'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-black flex flex-col items-center py-4 md:hidden shadow-lg">
          <Link
            to="/hero"
            onClick={() => setMenuOpen(false)}
            className="py-2 text-lg hover:text-green-400 transition-colors"
          >
            Play
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="py-2 text-lg hover:text-green-400 transition-colors"
          >
            About
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
