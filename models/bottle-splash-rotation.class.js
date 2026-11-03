class Bottle extends MovableObject {
  width = 80;
  height = 80;
  offset = { top: 15, bottom: 10, left: 20, right: 20 };
  isSplashing = false;
  isFinished = false;
  IMAGES_GROUND = [
    "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  IMAGES_ROTATION = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, isInAir) {
    super().loadImage(this.IMAGES_GROUND[Math.round(Math.random())]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = isInAir ? 130 : 355;
    if (isInAir) {
      this.animateRotation();
    }
  }

  /**
   * Lets the bottle spin in the air.
   */
  animateRotation() {
    setStoppableInterval(() => this.playAnimation(this.IMAGES_ROTATION), 250);
  }

  /**
   * Throws the bottle in a curve into the given direction.
   * @param {boolean} isThrownLeft - True if the bottle flies to the left.
   */
  throwBottle(isThrownLeft) {
    this.speedY = 20;
    this.applyGravity();
    let flightInterval = setStoppableInterval(() => {
      if (this.isSplashing) return clearInterval(flightInterval);
      this.x += isThrownLeft ? -15 : 15;
      this.playAnimation(this.IMAGES_ROTATION);
      if (!this.isAboveGround()) this.startSplash();
    }, 1000 / 25);
  }

  /**
   * Stops the bottle and plays the splash animation once.
   */
  startSplash() {
    playSound('bottleBreak');
    this.isSplashing = true;
    this.speedY = 0;
    this.acceleration = 0;
    this.currentImage = 0;
    this.width = 105;
    let splashInterval = setStoppableInterval(() => {
      if (this.currentImage < this.IMAGES_SPLASH.length) {
        this.img = this.imageCache[this.IMAGES_SPLASH[this.currentImage]];
        this.currentImage++;
      } else {
        clearInterval(splashInterval);
        this.isFinished = true;
      }
    }, 80);
  }

  /**
   * @returns {boolean} True while the bottle is above the ground.
   */
  isAboveGround() {
    return this.y < 355;
  }
}
