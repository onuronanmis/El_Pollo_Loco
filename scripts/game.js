

let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;


/**
 * Prepares the page: loads the mute state and binds all buttons.
 */
function initPage() {
    loadMuteState();
    bindButtons();
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


window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (e.keyCode == 38) {
        keyboard.UP = true;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (e.keyCode == 38) {
        keyboard.UP = false;
    }

    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
});
