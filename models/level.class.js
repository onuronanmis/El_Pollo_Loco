class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins;
    level_end_x = 2780;
    camera_end_x = 2160;

    /**
     * Creates a level with all its objects.
     * @param {MovableObject[]} enemies - Chickens, chicks and the endboss.
     * @param {Cloud[]} clouds - Moving clouds.
     * @param {BackgroundObject[]} backgroundObjects - Background layers.
     * @param {Bottle[]} bottles - Collectable bottles.
     * @param {Coin[]} coins - Collectable coins.
     */
    constructor(enemies, clouds, backgroundObjects, bottles, coins){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects
        this.bottles = bottles;
        this.coins = coins;
    }
}
