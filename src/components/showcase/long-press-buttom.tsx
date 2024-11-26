import React, { useState, useEffect } from "react";
import { Moon, Sun, Minus, Plus } from "lucide-react";
import LongPressButton from "../re-uc/long-press-button";

export default function LongPressButtonShowcase() {
  const [count, setCount] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handlePress = (
    counter: number,
    holding: boolean,
    direction: "increment" | "decrement"
  ) => {
    setIsHolding(holding);

    setCount((prevCount) =>
      direction === "increment" ? prevCount + 1 : Math.max(0, prevCount - 1)
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">
          Long Press Counter
        </h1>
        <div className="relative w-48 h-48 mb-8 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span
              className="text-6xl font-bold text-gray-800 dark:text-white"
              aria-live="polite"
            >
              {count}
            </span>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <LongPressButton
            onPress={handlePress}
            onPressArgs={["decrement"]}
            delay={100}
            timeOutDuration={200}
            className={`p-4 rounded-full text-white font-semibold text-lg ${
              isHolding ? "bg-red-600" : "bg-red-500 hover:bg-red-600"
            } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 shadow-lg`}
          >
            <Minus size={24} />
          </LongPressButton>
          <LongPressButton
            onPress={handlePress}
            onPressArgs={["increment"]}
            delay={100}
            timeOutDuration={200}
            className={`p-4 rounded-full text-white font-semibold text-lg ${
              isHolding ? "bg-green-600" : "bg-green-500 hover:bg-green-600"
            } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-lg`}
          >
            <Plus size={24} />
          </LongPressButton>
        </div>
        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
          Press and hold the buttons to count faster.
        </p>
      </div>
    </div>
  );
}
