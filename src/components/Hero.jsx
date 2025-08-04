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
    return lockData?.locked && lockData?.date === getTodayString();
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
      const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      return WORDS[daysPassed % WORDS.length];
    };

    setTargetWord(getDailyWord());
    setGuesses([]);
    setCurrentGuess("");
    setGameState(GAME_STATES.PLAYING);
    setKeyboardStatus({});
    setShowCongrats(false);
    setShowLockModal(false);
    setInvalidGuess(false);
  }, [isUserLocked]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const updateKeyboardStatus = useCallback((guess, result) => {
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
  }, [keyboardStatus]);

  const checkGuess = useCallback(
  (guess) => {
    const result = Array(5).fill("absent");
    const targetArr = targetWord.split("");
    const guessArr = guess.split("");
    const usedTargetLetters = Array(5).fill(false);

    // First pass: correct letters
    for (let i = 0; i < 5; i++) {
      if (guessArr[i] === targetArr[i]) {
        result[i] = "correct";
        usedTargetLetters[i] = true;
      }
    }

    // Second pass: present letters
    for (let i = 0; i < 5; i++) {
      if (result[i] === "correct") continue;
      for (let j = 0; j < 5; j++) {
        if (!usedTargetLetters[j] && guessArr[i] === targetArr[j]) {
          result[i] = "present";
          usedTargetLetters[j] = true;
          break;
        }
      }
    }

    return result;
  },
  [targetWord]
);

  const submitGuess = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING || currentGuess.length !== 5) {
      if (currentRowRef.current) {
        const row = currentRowRef.current;
        gsap.fromTo(row, { x: 0 }, { x: 10, duration: 0.1, repeat: 3, yoyo: true });
      }
      return;
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
        });
        gsap.fromTo(currentRowRef.current, { x: 0 }, { x: 10, duration: 0.1, repeat: 3, yoyo: true });
      }
      return;
    }

    const proceedWithGuess = () => {
      const result = checkGuess(currentGuess);
      const newGuesses = [...guesses, { word: currentGuess, result }];
      setGuesses(newGuesses);
      updateKeyboardStatus(currentGuess, result);

      if (currentGuess === targetWord) {
        setGameState(GAME_STATES.WON);
        setShowCongrats(true);
      } else if (newGuesses.length >= 6) {
        setGameState(GAME_STATES.LOST);
        setShowLockModal(true);
      }

      localStorage.setItem("wordleLock", JSON.stringify({ locked: true, date: getTodayString() }));
      setCurrentGuess("");
    };

    if (currentRowRef.current) {
      const tiles = currentRowRef.current.children;
      const tl = gsap.timeline({ onComplete: proceedWithGuess });
      tl.to(tiles, { rotationY: 180, duration: 0.3, stagger: 0.15 })
        .to(tiles, { rotationY: 0, duration: 0.3, stagger: 0.15 });
    } else {
      proceedWithGuess();
    }
  }, [currentGuess, gameState, guesses, targetWord, checkGuess, updateKeyboardStatus, getTodayString]);

  const handleKeyPress = useCallback((key) => {
    if (gameState !== GAME_STATES.PLAYING) return;
    if (invalidGuess && currentRowRef.current) {
      const tiles = currentRowRef.current.children;
      gsap.set(tiles, { backgroundColor: "", borderColor: "" });
      setInvalidGuess(false);
    }

    if (key === "ENTER") submitGuess();
    else if (key === "BACKSPACE") setCurrentGuess(prev => prev.slice(0, -1));
    else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameState, submitGuess, invalidGuess]);

  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toUpperCase();
      if (["ENTER", "BACKSPACE"].includes(key) || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyPress]);

  const renderGrid = () => {
    return Array.from({ length: 6 }).map((_, i) => {
      const guess = guesses[i];
      const isCurrent = i === guesses.length && gameState === GAME_STATES.PLAYING;

      return (
        <div key={i} className="row" ref={isCurrent ? currentRowRef : null}>
          {Array.from({ length: 5 }).map((_, j) => {
            const letter = guess?.word[j] || (isCurrent && currentGuess[j]) || "";
            const status = guess?.result[j] || "";
            return (
              <div key={j} className={`cell ${status || "empty"}`}>
                {letter}
              </div>
            );
          })}
        </div>
      );
    });
  };

  const renderKeyboard = () => {
    return KEYBOARD_ROWS.map((row, i) => (
      <div key={i} className="row">
        {row.map((key) => {
          const status = keyboardStatus[key];
          const specialKey = key === "ENTER" ? "enter" : key === "BACKSPACE" ? "backspace" : "";
          return (
            <button
              key={key}
              className={`${specialKey} ${status || ""}`}
              onClick={() => handleKeyPress(key)}
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </button>
          );
        })}
      </div>
    ));
  };

  return (
    <div id="hero">
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

      <div id="game-title">
        <h1>Wordle Darija</h1>
        <p>Qele3 5-Horof endk 6 Mohawalat</p>
      </div>

      <div id="game-grid">{renderGrid()}</div>

      {gameState !== GAME_STATES.PLAYING && (
        <div className="text-center opacity-50">
          {gameState === GAME_STATES.WON ? (
            <div className="text-green-600">
              <p className="text-xl font-bold">🎉 NADDDDDIIIIIII!</p>
              <p>Jebtiha f {guesses.length} Mohawalat!</p>
            </div>
          ) : (
            <div className="text-red-600">
              <p className="text-xl font-bold">Khserti Al3iyan zeyer meana!</p>
              <p className="mt-2 font-semibold text-sm">
                Ghadi t9dar tel3ab mra okhra melli kalima jdid tla3.
              </p>
            </div>
          )}
        </div>
      )}

      <div id="keyboard">{renderKeyboard()}</div>

      <div id="legend">
        <p>🟩 Shiha o fblastha</p>
        <p>🟨 Shiha o machi fblastha</p>
        <p>⬜ Makaymach</p>
      </div>
    </div>
  );
}

export default Hero;
