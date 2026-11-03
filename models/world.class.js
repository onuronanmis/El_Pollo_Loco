class World{
    character = new Character();
    healthBar = new HealthBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
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

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.checkFastActions();
    }

    checkFastActions(){
        setStoppableInterval(() => {
            this.checkEnemyCollisions();
            this.checkThrowing();
            this.checkBottleHits();
        }, 1000 / 25);
    }

    checkThrowing(){
        let isThrowReady = new Date().getTime() - this.lastThrow > 500;
        if (this.keyboard.SPACE && isThrowReady && this.character.bottleCount > 0) {
            this.throwBottle();
        }
    }

    throwBottle(){
        let bottle = new Bottle(this.character.x + 40, false);
        bottle.y = this.character.y + 120;
        bottle.throwBottle(this.character.otherDirection);
        this.thrownBottles.push(bottle);
        this.character.bottleCount--;
        this.updateBottleBar();
        this.lastThrow = new Date().getTime();
    }

    checkBottleHits(){
        this.thrownBottles.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => this.checkBottleHit(bottle, enemy));
        });
        this.thrownBottles = this.thrownBottles.filter((bottle) => !bottle.isFinished);
    }

    checkBottleHit(bottle, enemy){
        if (bottle.isSplashing || enemy.isDead() || !bottle.isColliding(enemy)) return;
        bottle.startSplash();
        if (enemy instanceof Endboss) {
            enemy.hit(25);
        } else {
            enemy.die();
            this.removeEnemyLater(enemy);
        }
    }

    removeEnemyLater(enemy){
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter((otherEnemy) => otherEnemy !== enemy);
        }, 1000);
    }

    setWorld(){
        this.character.world = this;
        this.level.enemies.forEach((enemy) => enemy.world = this);
    }

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

    checkGameEnd(){
        let endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (this.isGameOver || !endboss.isDead()) return;
        this.isGameOver = true;
        setTimeout(() => showWinScreen(), 2000);
    }

    updateEnemySounds(){
        let visibleEnemies = this.level.enemies.filter((enemy) => !enemy.isDead() && this.isOnScreen(enemy));
        visibleEnemies.some((enemy) => enemy instanceof Chick) ? playLoop('chickWalk') : stopLoop('chickWalk');
        visibleEnemies.some((enemy) => enemy instanceof Chicken && !(enemy instanceof Chick)) ? playLoop('chickenWalk') : stopLoop('chickenWalk');
    }

    isOnScreen(mo){
        return mo.x + mo.width > -this.camera_x && mo.x < -this.camera_x + this.canvas.width;
    }

    checkBottlePickup(){
        this.level.bottles = this.level.bottles.filter((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.character.bottleCount++;
                this.updateBottleBar();
                playSound('collect');
                return false;
            }
            return true;
        });
    }

    checkCoinPickup(){
        this.level.coins = this.level.coins.filter((coin) => {
            if (this.character.isColliding(coin)) {
                this.collectCoin();
                return false;
            }
            return true;
        });
    }

    collectCoin(){
        playSound('collect');
        this.character.coinCount++;
        if (this.character.coinCount == 5) {
            this.character.coinCount = 0;
            this.character.bottleCount++;
            this.updateBottleBar();
        }
        this.coinBar.setPercentage(this.character.coinCount * 20);
    }

    updateBottleBar(){
        this.bottleBar.setPercentage(Math.min(this.character.bottleCount * 20, 100));
    }

    checkEnemyCollisions(){
        this.level.enemies.forEach((enemy) => {
            if (enemy.isDead() || !this.character.isColliding(enemy)) return;
            if (this.isStomping(enemy)) {
                this.stompEnemy(enemy);
            } else if (!this.character.isHurt()) {
                this.character.hit(this.getEnemyDamage(enemy));
                this.healthBar.setPercentage(this.character.energy);
            }
        });
    }

    isStomping(enemy){
        return enemy instanceof Chicken && this.character.isAboveGround() && this.character.speedY < 0;
    }

    stompEnemy(enemy){
        enemy.die();
        this.removeEnemyLater(enemy);
        this.character.speedY = 15;
    }

    getEnemyDamage(enemy){
        if (enemy instanceof Endboss) return 20;
        if (enemy instanceof Chick) return 5;
        return 10;
    }

    checkGrinderFeeding(){
        this.level.enemies = this.level.enemies.filter((enemy) => {
            if (!enemy.isDead() && !(enemy instanceof Endboss) && this.grinder.isAtIntake(enemy)) {
                this.grinder.grind();
                return false;
            }
            return true;
        });
    }

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

        let self = this;
        this.animationFrameId = requestAnimationFrame(function(){
            self.draw()
        });
    }

    stopDrawing(){
        cancelAnimationFrame(this.animationFrameId);
    }

    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o);
        });
    }
    
    addToMap(mo){
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}