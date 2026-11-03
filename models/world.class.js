class World{
    character = new Character();
    healthBar = new HealthBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    endbossBar = new EndbossBar();
    grinder = new Grinder();
    thrownBottles = [];
    lastThrow = 0;
    isGameOver = false;
    animationFrameId;
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    /**
     * Creates the world and starts drawing and all game checks.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {Keyboard} keyboard - The pressed keys.
     */
    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.checkFastActions();
    }

    /**
     * Starts the fast interval for enemy contact, throwing and bottle hits.
     */
    checkFastActions(){
        setStoppableInterval(() => {
            this.checkEnemyCollisions();
            this.checkThrowing();
            this.checkBottleHits();
        }, 1000 / 25);
    }

    /**
     * Throws a bottle when space is pressed, the cooldown is over and a bottle is left.
     */
    checkThrowing(){
        let isThrowReady = new Date().getTime() - this.lastThrow > 500;
        if (this.keyboard.SPACE && isThrowReady && this.character.bottleCount > 0) {
            this.throwBottle();
        }
    }

    /**
     * Creates a thrown bottle in front of Pepe and updates the bottle count.
     */
    throwBottle(){
        let bottle = new Bottle(this.character.x + 40, false);
        bottle.y = this.character.y + 120;
        bottle.throwBottle(this.character.otherDirection);
        this.thrownBottles.push(bottle);
        this.character.bottleCount--;
        this.updateBottleBar();
        this.lastThrow = new Date().getTime();
        this.convertCoinsToBottle();
    }

    /**
     * Checks all thrown bottles against all enemies and removes finished bottles.
     */
    checkBottleHits(){
        this.thrownBottles.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => this.checkBottleHit(bottle, enemy));
        });
        this.thrownBottles = this.thrownBottles.filter((bottle) => !bottle.isFinished);
    }

    /**
     * Lets a bottle splash on an enemy and damages or kills it.
     * @param {Bottle} bottle - The thrown bottle.
     * @param {MovableObject} enemy - The enemy to check.
     */
    checkBottleHit(bottle, enemy){
        if (bottle.isSplashing || enemy.isDead() || !bottle.isColliding(enemy)) return;
        bottle.startSplash();
        if (enemy instanceof Endboss) {
            enemy.hit(25);
            this.endbossBar.setPercentage(enemy.energy);
            playSound('endbossHit');
        } else {
            enemy.die();
            this.removeEnemyLater(enemy);
        }
    }

    /**
     * Removes a dead enemy from the level after one second.
     * @param {MovableObject} enemy - The dead enemy.
     */
    removeEnemyLater(enemy){
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter((otherEnemy) => otherEnemy !== enemy);
        }, 1000);
    }

    /**
     * Gives Pepe and the enemies access to the world.
     */
    setWorld(){
        this.character.world = this;
        this.level.enemies.forEach((enemy) => enemy.world = this);
    }

    /**
     * Starts the slow interval for pickups, grinder, sounds and game end.
     */
    checkCollisions(){
        setStoppableInterval(() => {
            this.checkGrinderFeeding();
            this.checkDrumstickPickup();
            this.checkBottlePickup();
            this.checkCoinPickup();
            this.updateEnemySounds();
            this.checkGameEnd();
        }, 200);
    }

    /**
     * Shows the win or lose screen when the endboss or Pepe is dead.
     */
    checkGameEnd(){
        if (this.isGameOver) return;
        if (this.getEndboss().isDead()) this.endGame(showWinScreen, 2000);
        if (this.character.isDead()) this.endGame(showLoseScreen, 4000);
    }

    /**
     * Finds the endboss in the level.
     * @returns {Endboss}
     */
    getEndboss(){
        return this.level.enemies.find((enemy) => enemy instanceof Endboss);
    }

    /**
     * Ends the game once and shows the end screen after a delay.
     * @param {Function} showEndScreen - Function that shows the end screen.
     * @param {number} delay - Delay in milliseconds.
     */
    endGame(showEndScreen, delay){
        if (this.isGameOver) return;
        this.isGameOver = true;
        setTimeout(() => showEndScreen(), delay);
    }

    /**
     * Plays the walking sounds while chickens or chicks are visible.
     */
    updateEnemySounds(){
        let visibleEnemies = this.level.enemies.filter((enemy) => !enemy.isDead() && this.isOnScreen(enemy));
        visibleEnemies.some((enemy) => enemy instanceof Chick) ? playLoop('chickWalk') : stopLoop('chickWalk');
        visibleEnemies.some((enemy) => enemy instanceof Chicken && !(enemy instanceof Chick)) ? playLoop('chickenWalk') : stopLoop('chickenWalk');
    }

    /**
     * Checks whether an object is inside the visible area.
     * @param {MovableObject} mo - The object to check.
     * @returns {boolean}
     */
    isOnScreen(mo){
        return mo.x + mo.width > -this.camera_x && mo.x < -this.camera_x + this.canvas.width;
    }

    /**
     * Collects bottles Pepe touches while the bottle bag is not full.
     */
    checkBottlePickup(){
        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (!this.isBottleBagFull() && this.character.isColliding(bottle)) {
                this.character.bottleCount++;
                this.updateBottleBar();
                playSound('collect');
                return false;
            }
            return true;
        });
    }

    /**
     * Collects coins Pepe touches while he has less than 5 coins.
     */
    checkCoinPickup(){
        this.level.coins = this.level.coins.filter((coin) => {
            if (this.character.coinCount < 5 && this.character.isColliding(coin)) {
                this.collectCoin();
                return false;
            }
            return true;
        });
    }

    /**
     * Adds a coin and updates the coin bar.
     */
    collectCoin(){
        playSound('collect');
        this.character.coinCount++;
        this.coinBar.setPercentage(this.character.coinCount * 20);
        this.convertCoinsToBottle();
    }

    /**
     * Turns 5 coins into one bottle if there is space in the bottle bag.
     */
    convertCoinsToBottle(){
        if (this.character.coinCount < 5 || this.isBottleBagFull()) return;
        this.character.coinCount = 0;
        this.character.bottleCount++;
        this.updateBottleBar();
        this.coinBar.setPercentage(0);
    }

    /**
     * Checks whether Pepe carries the maximum of 5 bottles.
     * @returns {boolean}
     */
    isBottleBagFull(){
        return this.character.bottleCount >= 5;
    }

    /**
     * Shows the current bottle count in the bottle bar.
     */
    updateBottleBar(){
        this.bottleBar.setPercentage(Math.min(this.character.bottleCount * 20, 100));
    }

    /**
     * Handles contact between Pepe and enemies: stomp or damage with knockback.
     */
    checkEnemyCollisions(){
        this.level.enemies.forEach((enemy) => {
            if (enemy.isDead() || !this.character.isColliding(enemy)) return;
            if (this.isStomping(enemy)) {
                this.stompEnemy(enemy);
            } else if (!this.character.isHurt()) {
                this.character.hit(this.getEnemyDamage(enemy));
                if (!(enemy instanceof Endboss)) this.character.knockBack(enemy);
                playSound('pepeHurt');
                this.healthBar.setPercentage(this.character.energy);
            }
        });
    }

    /**
     * Checks whether Pepe falls onto a chicken or chick.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean}
     */
    isStomping(enemy){
        return enemy instanceof Chicken && this.character.isAboveGround() && this.character.speedY < 0;
    }

    /**
     * Kills the enemy and lets Pepe bounce up.
     * @param {MovableObject} enemy - The stomped enemy.
     */
    stompEnemy(enemy){
        enemy.die();
        this.removeEnemyLater(enemy);
        this.character.speedY = 15;
    }

    /**
     * Returns the damage an enemy deals to Pepe.
     * @param {MovableObject} enemy - The enemy.
     * @returns {number}
     */
    getEnemyDamage(enemy){
        if (enemy instanceof Endboss) return 20;
        if (enemy instanceof Chick) return 5;
        return 10;
    }

    /**
     * Grinds living chickens and chicks that reach the grinder.
     */
    checkGrinderFeeding(){
        this.level.enemies = this.level.enemies.filter((enemy) => {
            if (!enemy.isDead() && !(enemy instanceof Endboss) && this.grinder.isAtIntake(enemy)) {
                this.grinder.grind();
                return false;
            }
            return true;
        });
    }

    /**
     * Heals Pepe when he picks up a drumstick and is not at full health.
     */
    checkDrumstickPickup(){
        this.grinder.drumsticks = this.grinder.drumsticks.filter((drumstick) => {
            if (this.character.energy < 100 && this.character.isColliding(drumstick)) {
                this.character.heal(10);
                this.healthBar.setPercentage(this.character.energy);
                return false;
            }
            return true;
        });
    }



    /**
     * Draws all objects and the status bars, then requests the next frame.
     */
    draw(){

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.grinder);
        this.addToMap(this.character);
        this.addObjectsToMap(this.grinder.drumsticks);
        this.grinder.updateFeathers();
        this.grinder.feathers.forEach((feather) => feather.draw(this.ctx));
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.thrownBottles);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.getEndboss().alertFrame > 0) this.addToMap(this.endbossBar);

        let self = this;
        this.animationFrameId = requestAnimationFrame(function(){
            self.draw()
        });
    }

    /**
     * Stops the drawing loop.
     */
    stopDrawing(){
        cancelAnimationFrame(this.animationFrameId);
    }

    /**
     * Draws several objects.
     * @param {DrawableObject[]} objects - The objects to draw.
     */
    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }
    
    /**
     * Draws one object, mirrored if it looks to the left.
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo){
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Mirrors the canvas for an object that looks to the left.
     * @param {DrawableObject} mo - The object to mirror.
     */
    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas after drawing a mirrored object.
     * @param {DrawableObject} mo - The mirrored object.
     */
    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}