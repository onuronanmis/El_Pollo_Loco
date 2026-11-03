const BACKGROUND_MUSIC = createSound('audio/alex-morgan-flamenco-spanish-guitar-fire-passion-530943.mp3', 0.2, true);
const ENDBOSS_MUSIC = createSound('audio/endboss-sound.mp3', 0.3, true);
const GAME_SOUNDS = {
    jump: createSound('audio/retro_jump.mp3', 0.4),
    running: createSound('audio/running-sound.mp3', 0.4, true),
    collect: createSound('audio/retro-coin.mp3', 0.4),
    bottleBreak: createSound('audio/bottle-shatter.mp3', 0.4),
    splat: createSound('audio/universfield-wet-splat-impact-567197.mp3', 0.5),
    chickenWalk: createSound('audio/hühnchen.mp3', 0.3, true),
    chickWalk: createSound('audio/kücken-sound.mp3', 0.3, true),
    snoring: createSound('audio/audiopapkin-male-snoring-297875.mp3', 0.3, true),
};
let isBossFight = false;


/**
 * Creates an audio element with the given settings.
 * @param {string} path - Path to the audio file.
 * @param {number} volume - Volume between 0 and 1.
 * @param {boolean} isLooping - True if the sound repeats endlessly.
 * @returns {HTMLAudioElement} The prepared sound.
 */
function createSound(path, volume, isLooping = false) {
    let sound = new Audio(path);
    sound.volume = volume;
    sound.loop = isLooping;
    return sound;
}


/**
 * Plays a sound effect from the start, unless muted.
 * @param {string} soundName - Key in GAME_SOUNDS.
 */
function playSound(soundName) {
    if (isMuted) return;
    let sound = GAME_SOUNDS[soundName];
    sound.currentTime = 0;
    sound.play().catch(() => {});
}


/**
 * Starts a looping sound if it is not already playing.
 * @param {string} soundName - Key in GAME_SOUNDS.
 */
function playLoop(soundName) {
    let sound = GAME_SOUNDS[soundName];
    if (!isMuted && sound.paused) sound.play().catch(() => {});
}


/**
 * Pauses a looping sound.
 * @param {string} soundName - Key in GAME_SOUNDS.
 */
function stopLoop(soundName) {
    GAME_SOUNDS[soundName].pause();
}


/**
 * Switches between background and endboss music.
 * @param {boolean} isActive - True while the endboss fight is running.
 */
function setBossFight(isActive) {
    isBossFight = isActive;
    updateMusicState();
}


/**
 * Plays the current music track and stops all sounds when muted.
 */
function updateMusicState() {
    let activeMusic = isBossFight ? ENDBOSS_MUSIC : BACKGROUND_MUSIC;
    let inactiveMusic = isBossFight ? BACKGROUND_MUSIC : ENDBOSS_MUSIC;
    inactiveMusic.pause();
    if (isMuted) {
        activeMusic.pause();
        Object.values(GAME_SOUNDS).forEach((sound) => sound.pause());
    } else {
        activeMusic.play().catch(() => {});
    }
}
