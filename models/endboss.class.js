class Endboss extends MovableObject {
    height = 450;
    width = 300;
    y = 10;
    speed = 2;
    walkSpeed = 2;
    attackSpeed = 5;
    offset = { top: 90, bottom: 40, left: 30, right: 20 };
    alertFrame = 0;
    deathFrame = 0;
    world;
    IMAGES_WALKING = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    /**
     * Creates the endboss and starts its animation.
     */
    constructor(){
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2400;
        this.animate();
    }

    /**
     * Starts the movement and animation loops.
     */
    animate(){
        setStoppableInterval(() => this.updateMovement(), 1000 / 60);
        setStoppableInterval(() => this.updateAnimation(), 150);
    }

    /**
     * Moves the endboss towards Pepe after the alert animation.
     */
    updateMovement(){
        if (!this.world || this.isDead() || this.isHurt() || !this.isAlertFinished()) return;
        let distanceX = this.getDistanceToPepe();
        this.speed = Math.abs(distanceX) < 250 ? this.attackSpeed : this.walkSpeed;
        if (Math.abs(distanceX) < 10) return;
        if (distanceX > 0) {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveRight();
            this.otherDirection = true;
        }
    }

    /**
     * Chooses the animation for the current state.
     */
    updateAnimation(){
        if (!this.world) return;
        if (this.isDead()) {
            this.playDeathOnce();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (!this.isAlertFinished()) {
            this.playAlert();
        } else if (Math.abs(this.getDistanceToPepe()) < 250) {
            this.playAnimation(this.IMAGES_ATTACK);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * @returns {number} Horizontal distance between the centers, positive if Pepe is on the left.
     */
    getDistanceToPepe(){
        let pepe = this.world.character;
        return (this.x + this.width / 2) - (pepe.x + pepe.width / 2);
    }

    /**
     * @returns {boolean} True once the alert animation has been played.
     */
    isAlertFinished(){
        return this.alertFrame >= this.IMAGES_ALERT.length;
    }

    /**
     * Waits until Pepe comes close, then plays the alert animation once.
     */
    playAlert(){
        if (this.alertFrame == 0 && Math.abs(this.getDistanceToPepe()) > 500) return;
        if (this.alertFrame == 0) setBossFight(true);
        this.img = this.imageCache[this.IMAGES_ALERT[this.alertFrame]];
        this.alertFrame++;
    }

    /**
     * Plays the death animation once and keeps the last frame.
     */
    playDeathOnce(){
        if (this.deathFrame == 0) setBossFight(false);
        if (this.deathFrame < this.IMAGES_DEAD.length) {
            this.img = this.imageCache[this.IMAGES_DEAD[this.deathFrame]];
            this.deathFrame++;
        }
    }
}
