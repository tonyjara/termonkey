#!/usr/bin/env node

import readline from "readline";
import randomWords from "random-words";
import ansi from "ansi-colors";

const wordCount = 100;
let words = randomWords(wordCount);
let wordsIndex = 0;
let selectedWord = "";
let userInput = "";
let coloredInput = "";
let coloredWord = "";
let underlinedWord = "";
let startTime = Date.now();

function resetGame() {
  words = randomWords(wordCount);
  wordsIndex = -1;
  userInput = "";
  coloredInput = "";
  coloredWord = "";
  underlinedWord = "";
}

function onClose() {
  let correctWordCount = 0;
  for (let i = 0; i < wordCount; i++) {
    if (words[i] === userInput.split(" ")[i]) {
      correctWordCount++;
    }
  }
  // Calculate elapsed time
  const timeDiff = Date.now() - startTime;
  const minutes = timeDiff / 1000 / 60;
  const seconds = Math.round(timeDiff / 1000);

  // Calculate typing speed
  const typedWordCount = userInput.split(" ").length;
  const typingSpeed =
    typedWordCount > 0 ? Math.floor(typedWordCount / minutes) : 0;

  // Calculate Accuracy
  /* const accuracy = Math.round((correctWordCount / wordCount) * 100); */
  const accuracy = Math.round(
    (correctWordCount / userInput.split(" ").length) * 100
  );
  console.clear();
  console.log(`\nTyping speed: ${typingSpeed} words per minute`);
  console.log(`Accuracy: ${accuracy}%`);
  console.log(`Elapsed time: ${seconds} seconds`);
}
console.clear();

console.log(`WELCOME TO MONKEYTERM
Type as fast as you can! Press Ctrl+C to exit. Shift+R restarts the game`);
console.log(" ");
console.log(words.join(" "));

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

// GAME LOGIC
process.stdin.on("keypress", (str, key) => {
  if (wordsIndex === 0) {
    startTime = Date.now();
  }
  // Exit hatch
  if (key.ctrl && key.name === "c") {
    onClose();
    process.exit();
  }

  // Restart game
  if (key.shift && key.name === "r") {
    resetGame();
  }

  if (key.name !== "backspace") {
    userInput = userInput + str;
  }

  let lastWord = userInput.split(" ").pop() ?? "";
  let lastWordArray = lastWord.split("");

  if (key.name === "backspace" && lastWord.length) {
    userInput = userInput.slice(0, -1);
    lastWord = userInput.split(" ").pop() ?? "";
    lastWordArray = lastWord.split("");
  }

  if (key.name === "space") {
    wordsIndex += 1;
    coloredInput += ` ${coloredWord}`;
  }

  selectedWord = words[wordsIndex];

  if (lastWord.length > selectedWord.length) {
    coloredWord += `${ansi.red(str)}`;
  }

  if (lastWord.length <= selectedWord.length) {
    coloredWord = selectedWord.split("").reduce((acc, char, i) => {
      if (!lastWordArray[i]) {
        return acc + `${ansi.yellow(char)}`;
      }
      if (char === lastWordArray[i]) {
        return acc + `${ansi.green(char)}`;
      }
      return acc + `${ansi.red(char)}`;
    }, "");
  }

  underlinedWord = ansi.underline(coloredWord);

  console.clear();

  console.log(`[${wordsIndex + 1}/${wordCount}]`);
  console.log(" ");
  console.log(" ");
  console.log(
    `${coloredInput} ${underlinedWord} ${words
      .slice(wordsIndex + 1, wordCount)
      .join(" ")}`
  );
});
