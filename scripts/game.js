

let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
let intervalIds = [];
let isPaused = false;


/**
 * Prepares the page: loads the mute state and binds all buttons.
 */
function initPage() {
    loadMuteState();
    bindButtons();
    bindTouchButtons();
    PORTRAIT_QUERY.addEventListener('change', handleOrientationChange);
    document.addEventListener('click', updateMusicState, { once: true });
    document.addEventListener('keydown', updateMusicState, { once: true });
}


/**
 * Connects all buttons with their click handlers.
 */
function bindButtons() {
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('mute-button').addEventListener('click', toggleMute);
    document.getElementById('menu-button').addEventListener('click', openMenu);
    document.getElementById('close-button').addEventListener('click', closeMenu);
    document.getElementById('menu-overlay').addEventListener('click', (event) => {
        if (event.target.id == 'menu-overlay') closeMenu();
    });
    bindEndScreenButtons();
    bindPauseButtons();
}


/**
 * Connects the buttons of the pause screen.
 */
function bindPauseButtons() {
    document.getElementById('pause-button').addEventListener('click', togglePause);
    document.getElementById('resume-button').addEventListener('click', togglePause);
    document.getElementById('pause-restart-button').addEventListener('click', () => {
        stopGame();
        restartGame();
    });
    document.getElementById('pause-menu-button').addEventListener('click', () => {
        stopGame();
        returnToMenu();
    });
}


/**
 * Pauses or resumes the running game.
 */
function togglePause() {
    if (!world || world.isGameOver) return;
    document.activeElement.blur();
    isPaused = !isPaused;
    document.getElementById('pause-screen').classList.toggle('display-none', !isPaused);
    document.getElementById('pause-button').textContent = isPaused ? '▶' : '⏸';
    if (isPaused) Object.values(GAME_SOUNDS).forEach((sound) => sound.pause());
}


/**
 * Connects the buttons of the win and lose screens.
 */
function bindEndScreenButtons() {
    document.getElementById('menu-return-button').addEventListener('click', returnToMenu);
    document.getElementById('next-level-button').addEventListener('click', startNextLevel);
    document.getElementById('lose-menu-button').addEventListener('click', returnToMenu);
    document.getElementById('restart-button').addEventListener('click', restartGame);
}


/**
 * Hides the start screen, shows the level image and starts the game after 2.5 seconds.
 */
function startGame() {
    document.activeElement.blur();
    document.getElementById('start-screen').classList.add('display-none');
    document.getElementById('level-screen').classList.remove('display-none');
    setTimeout(() => {
        document.getElementById('level-screen').classList.add('display-none');
        initLevel();
        canvas = document.getElementById('canvas');
        world = new World(canvas, keyboard);
        setGameButtonsVisible(true);
    }, 2500);
}


/**
 * Switches the sound on or off and saves the state.
 */
function toggleMute() {
    document.activeElement.blur();
    isMuted = !isMuted;
    localStorage.setItem('isMuted', isMuted);
    updateMuteButton();
    updateMusicState();
}


/**
 * Loads the saved mute state from the local storage.
 */
function loadMuteState() {
    isMuted = localStorage.getItem('isMuted') === 'true';
    updateMuteButton();
}


/**
 * Shows the matching icon on the mute button.
 */
function updateMuteButton() {
    document.getElementById('mute-button').textContent = isMuted ? '🔇' : '🔊';
}


/**
 * Opens the menu overlay.
 */
function openMenu() {
    document.activeElement.blur();
    document.getElementById('menu-overlay').classList.remove('display-none');
}


/**
 * Closes the menu overlay.
 */
function closeMenu() {
    document.getElementById('menu-overlay').classList.add('display-none');
}


/**
 * Starts an interval that can be stopped together with all others.
 * @param {Function} callback - The function to repeat.
 * @param {number} time - Delay in milliseconds.
 * @returns {number} The interval id.
 */
function setStoppableInterval(callback, time) {
    let intervalId = setInterval(() => {
        if (!isPaused) callback();
    }, time);
    intervalIds.push(intervalId);
    return intervalId;
}


/**
 * Stops all game intervals, the drawing loop and all looping sounds.
 */
function stopGame() {
    intervalIds.forEach((intervalId) => clearInterval(intervalId));
    intervalIds = [];
    world.stopDrawing();
    world.isGameOver = true;
    isPaused = false;
    document.getElementById('pause-screen').classList.add('display-none');
    document.getElementById('pause-button').textContent = '⏸';
    setGameButtonsVisible(false);
    Object.values(GAME_SOUNDS).forEach((sound) => sound.pause());
    setBossFight(false);
}


/**
 * Stops the game and shows the win screen.
 */
function showWinScreen() {
    stopGame();
    document.getElementById('win-screen').classList.remove('display-none');
}


/**
 * Returns from the win screen to the start screen.
 */
function returnToMenu() {
    document.activeElement.blur();
    hideEndScreens();
    document.getElementById('start-screen').classList.remove('display-none');
}


/**
 * Starts the next level. Until level 2 exists, level 1 is started again.
 */
function startNextLevel() {
    hideEndScreens();
    startGame();
}


/**
 * Stops the game and shows the lose screen.
 */
function showLoseScreen() {
    stopGame();
    document.getElementById('lose-screen').classList.remove('display-none');
}


/**
 * Starts the current level again.
 */
function restartGame() {
    hideEndScreens();
    startGame();
}


/**
 * Hides the win and lose screens.
 */
function hideEndScreens() {
    document.getElementById('win-screen').classList.add('display-none');
    document.getElementById('lose-screen').classList.add('display-none');
}


const KEY_BINDINGS = {
    ArrowLeft: 'LEFT',
    KeyA: 'LEFT',
    ArrowRight: 'RIGHT',
    KeyD: 'RIGHT',
    ArrowUp: 'UP',
    KeyW: 'UP',
    ArrowDown: 'DOWN',
    Space: 'SPACE',
};


/**
 * Sets the keyboard flag that belongs to the pressed or released key.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {boolean} isPressed - True on keydown, false on keyup.
 */
function setKeyState(event, isPressed) {
    let keyName = KEY_BINDINGS[event.code];
    if (keyName) keyboard[keyName] = isPressed;
}


/**
 * Shows or hides the buttons that are only needed during the game.
 * @param {boolean} isVisible - True while the game is running.
 */
function setGameButtonsVisible(isVisible) {
    document.getElementById('pause-button').classList.toggle('display-none', !isVisible);
    document.getElementById('mobile-controls').classList.toggle('display-none', !isVisible);
}


const PORTRAIT_QUERY = window.matchMedia('(orientation: portrait) and (max-width: 1024px)');


/**
 * Pauses the running game when the device is turned to portrait mode.
 */
function handleOrientationChange() {
    if (PORTRAIT_QUERY.matches && !isPaused) togglePause();
}


const TOUCH_BINDINGS = {
    'touch-left': 'LEFT',
    'touch-right': 'RIGHT',
    'touch-jump': 'UP',
    'touch-throw': 'SPACE',
};


/**
 * Connects the mobile touch buttons with the keyboard flags.
 */
function bindTouchButtons() {
    Object.entries(TOUCH_BINDINGS).forEach(([buttonId, keyName]) => {
        let button = document.getElementById(buttonId);
        button.addEventListener('touchstart', (event) => setTouchState(event, keyName, true), { passive: false });
        button.addEventListener('touchend', (event) => setTouchState(event, keyName, false));
        button.addEventListener('touchcancel', (event) => setTouchState(event, keyName, false));
        button.addEventListener('contextmenu', (event) => event.preventDefault());
    });
}


/**
 * Sets a keyboard flag from a touch event.
 * @param {TouchEvent} event - The touch event.
 * @param {string} keyName - The keyboard flag to set.
 * @param {boolean} isPressed - True while the button is touched.
 */
function setTouchState(event, keyName, isPressed) {
    event.preventDefault();
    keyboard[keyName] = isPressed;
}


window.addEventListener('keydown', (event) => {
    if (event.code == 'KeyP' && !event.repeat) togglePause();
    setKeyState(event, true);
});
window.addEventListener('keyup', (event) => setKeyState(event, false));
