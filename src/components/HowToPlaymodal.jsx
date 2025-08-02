import React, { useEffect } from 'react'

const HowToPlaymodal = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#121213] text-white p-6 rounded-lg max-w-md w-full relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-2">How To Play</h2>
        <p className="mb-4">Guess the Wordle in 6 tries.</p>
        <ul className="mb-4 list-disc list-inside text-sm space-y-1">
          <li>Each guess must be a valid 5-letter word.</li>
          <li>The color of the tiles will change to show how close your guess was.</li>
        </ul>

        <p className="text-sm font-bold mb-1">Examples</p>

        <div className="mb-2 flex items-center space-x-1">
          <div className="w-8 h-8 bg-green-600 text-black font-bold flex items-center justify-center rounded">W</div>
          <span className="text-sm">W is in the word and in the correct spot.</span>
        </div>

        <div className="mb-2 flex items-center space-x-1">
          <div className="w-8 h-8 bg-yellow-400 text-black font-bold flex items-center justify-center rounded">I</div>
          <span className="text-sm">I is in the word but in the wrong spot.</span>
        </div>

        <div className="mb-2 flex items-center space-x-1">
          <div className="w-8 h-8 bg-gray-600 text-white font-bold flex items-center justify-center rounded">U</div>
          <span className="text-sm">U is not in the word in any spot.</span>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          A new puzzle is released daily at midnight.
        </p>
      </div>
    </div>
  )
}

export default HowToPlaymodal
