class MovableObject extends DrawableObject{

    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 3;
    energy = 100;
    lastHit = 0;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };


    applyGravity(){
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0){
                this.y -= this.speedY;
                this.speedY -= this.acceleration
            }   
        }, 1000 / 25);
    }

    isAboveGround(){
        return this.y < 155;
    }

    isColliding(mo){
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    hit(damage = 5){
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }else{
            this.lastHit = new Date().getTime();
        }
    }

    heal(amount){
        this.energy = Math.min(this.energy + amount, 100);
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        
        return timepassed < 1;
    }

    isDead(){
        return this.energy == 0;
    }

    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft(){
            this.x -= this.speed;
    }

    jump(){
        this.speedY = 30;
    }
}




// if (character.x + character.width > chicken.x &&
//     character.y + character.height > chicken.y &&
//     character.x < chicken.x &&
//     character.y < chicken.y + chicken.height
// )


