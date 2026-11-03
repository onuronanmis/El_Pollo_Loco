

let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
let intervalIds = [];


/**
 * Prepares the page: loads the mute state and binds all buttons.
 */
function initPage() {
    loadMuteState();
    bindButtons();
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
    document.getElementById('menu-return-button').addEventListener('click', returnToMenu);
    document.getElementById('next-level-button').addEventListener('click', startNextLevel);
    document.getElementById('menu-overlay').addEventListener('click', (event) => {
        if (event.target.id == 'menu-overlay') closeMenu();
    });
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
    let intervalId = setInterval(callback, time);
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
    Object.values(GAME_SOUNDS).forEach((sound) => sound.pause());
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
    document.getElementById('win-screen').classList.add('display-none');
    document.getElementById('start-screen').classList.remove('display-none');
}


/**
 * Starts the next level. Until level 2 exists, level 1 is started again.
 */
function startNextLevel() {
    document.getElementById('win-screen').classList.add('display-none');
    startGame();
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


window.addEventListener('keydown', (event) => setKeyState(event, true));
window.addEventListener('keyup', (event) => setKeyState(event, false));
