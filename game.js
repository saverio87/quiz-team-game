
import { GameObserver } from "./observer.js";
import { GameManager } from "./engine.js";
import { SoundManager, SoundObserver } from "./sound/sound.js"
import { generatePreMadeCards, importQuestions } from "./data.js";


document.addEventListener("DOMContentLoaded", () => {
    // Initializing gameManager and gameObserver
    const gameManager = new GameManager();
    const gameObserver = new GameObserver(gameManager);
    // initialize soundManager and soundObserver
    const soundManager = new SoundManager();
    const soundObserver = new SoundObserver(soundManager);
    // add observers and listeners
    gameManager.addObserver(gameObserver);
    gameManager.addListener(soundObserver);
    // Fetching array from localStorage

    const questions = importQuestions();

    // const cards = JSON.parse(localStorage.getItem("cards"));
    // // Full screen
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    fullscreenBtn.addEventListener('click', () => {
        gameManager.notifyObservers("enterFullScreen", null);
    })
    document.addEventListener('fullscreenchange', () => {
        gameObserver.checkFullscreen()
    });
    window.addEventListener('resize', () => {
        gameObserver.checkFullscreen()
    });

    if (questions) {
        gameManager.startGame(questions);
    }



});




