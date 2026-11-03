class MovableObject extends DrawableObject{

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 3;
    energy = 100;
    lastHit = 0;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };


    /**
     * Lets the object fall down while it is in the air.
     */
    applyGravity(){
        setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration
            }   
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is above the ground.
     * @returns {boolean}
     */
    isAboveGround(){
        return this.y < 155;
    }

    /**
     * Checks whether this object overlaps another object, using offsets.
     * @param {MovableObject} mo - The other object.
     * @returns {boolean}
     */
    isColliding(mo){
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Reduces the energy and remembers the time of the hit.
     * @param {number} damage - Amount of energy to remove.
     */
    hit(damage = 5){
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }else{
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Adds energy up to a maximum of 100.
     * @param {number} amount - Amount of energy to add.
     */
    heal(amount){
        this.energy = Math.min(this.energy + amount, 100);
    }

    /**
     * Checks whether the last hit was less than one second ago.
     * @returns {boolean}
     */
    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        
        return timepassed < 1;
    }

    /**
     * Checks whether the object has no energy left.
     * @returns {boolean}
     */
    isDead(){
        return this.energy == 0;
    }

    /**
     * Shows the next image of an animation.
     * @param {string[]} images - Paths of the animation images.
     */
    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right by its speed.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left by its speed.
     */
    moveLeft(){
            this.x -= this.speed;
    }

    /**
     * Starts a jump.
     */
    jump(){
        this.speedY = 30;
    }
}




// if (character.x + character.width > chicken.x &&
//     character.y + character.height > chicken.y &&
//     character.x < chicken.x &&
//     character.y < chicken.y + chicken.height
// )


