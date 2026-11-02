class World{
    character = new Character();
    healthBar = new HealthBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    grinder = new Grinder();
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

    }

    setWorld(){
        this.character.world = this;
    }

    checkCollisions(){
        setInterval(() => {
            this.checkEnemyCollisions();
            this.checkGrinderFeeding();
            this.checkDrumstickPickup();
        }, 200);
    }

    checkEnemyCollisions(){
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)){
                this.character.hit();
                this.healthBar.setPercentage(this.character.energy);
            }
        });
    }

    checkGrinderFeeding(){
        this.level.enemies = this.level.enemies.filter((enemy) => {
            if (!(enemy instanceof Endboss) && this.grinder.isAtIntake(enemy)) {
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
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.grinder);
        this.addToMap(this.character);
        this.addObjectsToMap(this.grinder.drumsticks);
        this.grinder.updateFeathers();
        this.grinder.feathers.forEach((feather) => feather.draw(this.ctx));
        this.addObjectsToMap(this.level.enemies);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);

        let self = this;
        requestAnimationFrame(function(){
            self.draw()
        });
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