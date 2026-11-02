class Chicken extends MovableObject{  
    height = 60;
    y = 370;
    width = 80;
    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGE_DEAD = 'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    constructor(){
        super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

        animate() {
            setInterval(() => {
                if (!this.isDead()) this.moveLeft();
            }, 1000 / 60)

            setInterval(() => {
                if (this.isDead()) {
                    this.img = this.imageCache[this.IMAGE_DEAD];
                } else {
                    this.playAnimation(this.IMAGES_WALKING);
                }
        }, 200);
    }

    /**
     * Kills the chicken instantly.
     */
    die() {
        this.energy = 0;
    }


}