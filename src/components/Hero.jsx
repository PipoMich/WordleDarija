import React, { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { GAME_STATES, KEYBOARD_ROWS, WORDS } from "/constants/index.js";
import HowToPlaymodal from "./HowToPlaymodal";
import CongratulationsModal from "./CongratulationsModal";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function LockModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-xl z-60">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          🚫 Mab9ach t9dar tel3ab lyoum!
        </h2>
        <p className="mb-4 text-gray-700">
          Khasssek tsenn lyoum jdid bach tel3ab. Hadi hiya lkalima dial lyom.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Close
          </button>
          <button
            onClick={() => navigate("/about")}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            About Page
          </button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameState, setGameState] = useState(GAME_STATES.PLAYING);
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const [showModal, setShowModal] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [invalidGuess, setInvalidGuess] = useState(false);

  const currentRowRef = useRef(null);

  const getTodayString = useCallback(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }, []);

  const isUserLocked = useCallback(() => {
    const lockData = JSON.parse(localStorage.getItem("wordleLock"));
    if (!lockData) return false;
    return lockData.locked && lockData.date === getTodayString();
  }, [getTodayString]);

  const startNewGame = useCallback(() => {
    if (isUserLocked()) {
      setGameState(GAME_STATES.LOST);
      setShowLockModal(true);
      return;
    }

    const getDailyWord = () => {
      const startDate = new Date("2024-01-01");
      const today = new Date();
      const daysPassed = Math.floor(
        (today - startDate) / (1000 * 60 * 60 * 24)
      );
      const index = daysPassed % WORDS.length;
      return WORDS[index];
    };

    const dailyWord = getDailyWord();
    setTargetWord(dailyWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameState(GAME_STATES.PLAYING);
    setKeyboardStatus({});
    setShowCongrats(false);
    setShowLockModal(false);
    setInvalidGuess(false);
    console.log("Daily word:", dailyWord);
  }, [isUserLocked]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const updateKeyboardStatus = useCallback(
    (guess, result) => {
      const newStatus = { ...keyboardStatus };

      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const status = result[i];
        const currentStatus = newStatus[letter];

        if (
          status === "correct" ||
          (status === "present" && currentStatus !== "correct") ||
          !currentStatus
        ) {
          newStatus[letter] = status;
        }
      }

      setKeyboardStatus(newStatus);
    },
    [keyboardStatus]
  );

  const checkGuess = useCallback(
    (guess) => {
      const result = [];

      for (let i = 0; i < 5; i++) {
        if (guess[i] === targetWord[i]) {
          result.push("correct");
        } else if (targetWord.includes(guess[i])) {
          result.push("present");
        } else {
          result.push("absent");
        }
      }

      return result;
    },
    [targetWord]
  );

  const submitGuess = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING) return;

    if (currentGuess.length !== 5) {
      // Shake animation for incomplete guess
      if (currentRowRef.current) {
        const row = currentRowRef.current;
        gsap.fromTo(
          row,
          { x: 0 },
          {
            x: 10,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power1.inOut",
          }
        );
      }
      return; // Don't submit incomplete guess
    }

    if (!WORDS.includes(currentGuess)) {
      setInvalidGuess(true);

      if (currentRowRef.current) {
        const tiles = currentRowRef.current.children;

        gsap.to(tiles, {
          backgroundColor: "#960505",
          borderColor: "#960505",
          duration: 0,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        });

        gsap.fromTo(
          currentRowRef.current,
          { x: 0 },
          {
            x: 10,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power1.inOut",
          }
        );
      }
      return;
    }

    if (currentRowRef.current) {
      const tiles = currentRowRef.current.children;

      const tl = gsap.timeline({
        onComplete: proceedWithGuess,
      });

      tl.to(tiles, {
        rotationY: 180,
        duration: 0.3,
        stagger: 0.15,
        ease: "power2.inOut",
      }).to(tiles, {
        rotationY: 0,
        duration: 0.3,
        stagger: 0.15,
        ease: "power2.inOut",
      });
    } else {
      proceedWithGuess();
    }

    function proceedWithGuess() {
      const result = checkGuess(currentGuess);
      const newGuesses = [...guesses, { word: currentGuess, result }];

      setGuesses(newGuesses);
      updateKeyboardStatus(currentGuess, result);

      if (currentGuess === targetWord) {
        setGameState(GAME_STATES.WON);
        setShowCongrats(true);
        // Lock user for the day when they win
        localStorage.setItem(
          "wordleLock",
          JSON.stringify({
            locked: true,
            date: getTodayString(),
          })
        );
      } else if (newGuesses.length >= 6) {
        setGameState(GAME_STATES.LOST);
        localStorage.setItem(
          "wordleLock",
          JSON.stringify({
            locked: true,
            date: getTodayString(),
          })
        );
        setShowLockModal(true);
      }

      setCurrentGuess("");
    }
  }, [
    currentGuess,
    gameState,
    checkGuess,
    guesses,
    updateKeyboardStatus,
    targetWord,
    getTodayString,
  ]);

  const handleKeyPress = useCallback(
    (key) => {
      if (gameState !== GAME_STATES.PLAYING) return;

      if (invalidGuess) {
        setInvalidGuess(false);
        if (currentRowRef.current) {
          const tiles = currentRowRef.current.children;
          gsap.set(tiles, { backgroundColor: "", borderColor: "" });
        }
      }

      if (key === "ENTER") {
        submitGuess();
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (
        key.length === 1 &&
        /[A-Z]/.test(key) &&
        currentGuess.length < 5
      ) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, gameState, submitGuess, invalidGuess]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const getTileClass = (status) => {
    const baseClass =
      "w-14 h-14 border-2 flex items-center justify-center text-xl font-bold uppercase transition-all duration-300";

    switch (status) {
      case "correct":
        return `${baseClass} bg-green-500 border-green-500 text-black`;
      case "present":
        return `${baseClass} bg-yellow-500 border-yellow-500 text-black`;
      case "absent":
        return `${baseClass} bg-gray-500 border-gray-500 text-black`;
      default:
        return `${baseClass} border-gray-300 ${
          currentGuess ? "border-gray-500" : ""
        }`;
    }
  };

  const getKeyClass = (key) => {
    const baseClass =
      "px-3 py-4 m-1 rounded font-semibold text-sm transition-all duration-200 hover:opacity-80";
    const status = keyboardStatus[key];

    if (key === "ENTER" || key === "BACKSPACE") {
      return `${baseClass} bg-gray-400 text-black px-6`;
    }

    switch (status) {
      case "correct":
        return `${baseClass} bg-green-500 text-black`;
      case "present":
        return `${baseClass} bg-yellow-500 text-black`;
      case "absent":
        return `${baseClass} bg-gray-500 text-black`;
      default:
        return `${baseClass} bg-gray-200 text-black hover:bg-gray-300`;
    }
  };

  const renderGrid = () => {
    const rows = [];

    for (let i = 0; i < 6; i++) {
      const row = [];
      const guess = guesses[i];
      const isCurrentRow =
        i === guesses.length && gameState === GAME_STATES.PLAYING;

      for (let j = 0; j < 5; j++) {
        let letter = "";
        let status = "";

        if (guess) {
          letter = guess.word[j];
          status = guess.result[j];
        } else if (isCurrentRow && j < currentGuess.length) {
          letter = currentGuess[j];
        }

        row.push(
          <div key={j} className={getTileClass(status)}>
            {letter}
          </div>
        );
      }

      rows.push(
        <div
          key={i}
          ref={isCurrentRow ? currentRowRef : null}
          className="flex gap-2 justify-center"
        >
          {row}
        </div>
      );
    }

    return rows;
  };

  const renderKeyboard = () => {
    return KEYBOARD_ROWS.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center">
        {row.map((key) => (
          <button
            key={key}
            className={getKeyClass(key)}
            onClick={() => handleKeyPress(key)}
          >
            {key === "BACKSPACE" ? "⌫" : key}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative select-none">
      <Navbar />
      {showModal && <HowToPlaymodal onClose={() => setShowModal(false)} />}
      {showCongrats && (
        <CongratulationsModal
          guesses={guesses.length}
          onClose={() => {
            setShowCongrats(false);
            startNewGame();
          }}
        />
      )}
      {showLockModal && <LockModal onClose={() => setShowLockModal(false)} />}

      <div className="w-full max-w-md mt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Wordle Darija
          </h1>
          <p className="text-gray-600">Qele3 5-Horof endk 6 Mohawalat</p>
        </div>

        <div className="mb-8 space-y-1">{renderGrid()}</div>

        {gameState !== GAME_STATES.PLAYING && (
          <div className="text-center mb-6 pointer-events-none opacity-50">
            {gameState === GAME_STATES.WON ? (
              <div className="text-green-600">
                <p className="text-xl font-bold">🎉 NADDDDDIIIIIII!</p>
                <p>Jebtiha f {guesses.length} Mohawalat!</p>
              </div>
            ) : (
              <div className="text-red-600">
                <p className="text-xl font-bold">
                  Khserti Al3iyan zeyer meana!
                </p>
                <p className="mt-2 font-semibold text-sm">
                  Ghadi t9dar tel3ab mra okhra melli kalima jdid tla3.
                </p>
              </div>
            )}
          </div>
        )}

        <div
          className={`space-y-1 ${
            gameState !== GAME_STATES.PLAYING
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          {renderKeyboard()}
        </div>

        <div
          className={`mt-8 text-sm text-gray-600 text-center space-y-1 ${
            gameState !== GAME_STATES.PLAYING
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          <p>🟩 Shiha o fblastha</p>
          <p>🟨 Shiha o machi fblastha</p>
          <p>⬜ Makaymach</p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
