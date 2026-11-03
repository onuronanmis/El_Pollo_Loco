class Character extends MovableObject {
  height = 280;
  y = 155;
  speed = 10;
  offset = { top: 110, bottom: 10, left: 20, right: 20 };
  bottleCount = 0;
  coinCount = 0;
  knockbackSpeed = 0;
  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD =[
    'assets/img/2_character_pepe/5_dead/D-51.png',
    'assets/img/2_character_pepe/5_dead/D-52.png',
    'assets/img/2_character_pepe/5_dead/D-53.png',
    'assets/img/2_character_pepe/5_dead/D-54.png',
    'assets/img/2_character_pepe/5_dead/D-55.png',
    'assets/img/2_character_pepe/5_dead/D-56.png',
    'assets/img/2_character_pepe/5_dead/D-57.png'
  ]

  IMAGES_HURT = [
    'assets/img/2_character_pepe/4_hurt/H-41.png',
    'assets/img/2_character_pepe/4_hurt/H-42.png',
    'assets/img/2_character_pepe/4_hurt/H-43.png'
  ];
  

  IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  world;
  deathTime = 0;
  lastActionTime = new Date().getTime();
  IMAGE_GRAVE = "assets/img/2_character_pepe/5_dead/Pepe am Grab mit Sombrero.webp";

  /**
   * Creates Pepe, preloads all images and starts gravity and animation.
   */
  constructor() {
    super().loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages([this.IMAGE_GRAVE]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.animate();
  }

  /**
   * Starts the movement and animation intervals.
   */
  animate() {
    setStoppableInterval(() => this.moveCharacter(), 1000 / 60);
    setStoppableInterval(() => this.playCharacterAnimation(), 50);
  }

  /**
   * Moves Pepe according to the pressed keys and updates the camera.
   */
  moveCharacter() {
    if (this.isDead()) return this.stopCharacterSounds();
    this.updateLastAction();
    this.applyKnockback();
    this.handleWalking();
    if (this.world.keyboard.UP && !this.isAboveGround()) {
      this.jump();
      playSound('jump');
    }
    this.updateRunningSound();
    this.world.camera_x = -Math.min(this.x - 100, this.world.level.camera_end_x);
  }

  /**
   * Moves Pepe left or right within the level borders.
   */
  handleWalking() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
    }
    if (this.world.keyboard.LEFT && this.x > -520) {
      this.moveLeft();
      this.otherDirection = true;
    }
  }

  /**
   * Pushes Pepe away from the enemy with a small bounce.
   * @param {MovableObject} enemy - The enemy Pepe collided with.
   */
  knockBack(enemy) {
    const isEnemyRight = this.x + this.width / 2 < enemy.x + enemy.width / 2;
    this.knockbackSpeed = isEnemyRight ? -12 : 12;
    this.speedY = 12;
  }

  /**
   * Moves Pepe by the current knockback and slows it down.
   */
  applyKnockback() {
    if (this.knockbackSpeed === 0) return;
    const newX = this.x + this.knockbackSpeed;
    this.x = Math.max(-520, Math.min(newX, this.world.level.level_end_x));
    this.knockbackSpeed *= 0.85;
    if (Math.abs(this.knockbackSpeed) < 1) this.knockbackSpeed = 0;
  }

  /**
   * Chooses the animation for Pepe's current state.
   */
  playCharacterAnimation() {
    if (this.isDead()) {
      this.playDeathOnce();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.playIdleAnimation();
    }
  }

  /**
   * Resets the idle timer whenever Pepe acts or gets hurt.
   */
  updateLastAction() {
    let keyboard = this.world.keyboard;
    if (keyboard.LEFT || keyboard.RIGHT || keyboard.UP || keyboard.SPACE || this.isHurt()) {
      this.lastActionTime = new Date().getTime();
      stopLoop('snoring');
    }
  }

  /**
   * @returns {boolean} True if Pepe has been inactive for 10 seconds.
   */
  isSleeping() {
    return new Date().getTime() - this.lastActionTime > 10000;
  }

  /**
   * Plays the idle or sleep animation, with snoring while asleep.
   */
  playIdleAnimation() {
    if (this.isSleeping()) {
      this.playTimedAnimation(this.IMAGES_LONG_IDLE, 250);
      playLoop('snoring');
    } else {
      this.playTimedAnimation(this.IMAGES_IDLE, 200);
    }
  }

  /**
   * Shows the frame that belongs to the current time.
   * @param {string[]} images - The animation frames.
   * @param {number} frameTime - Duration of one frame in milliseconds.
   */
  playTimedAnimation(images, frameTime) {
    let frameIndex = Math.floor(new Date().getTime() / frameTime) % images.length;
    this.img = this.imageCache[images[frameIndex]];
  }

  /**
   * Stops all sounds that belong to Pepe.
   */
  stopCharacterSounds() {
    stopLoop('running');
    stopLoop('snoring');
  }

  /**
   * Plays the death animation once, then shows Pepe's grave.
   */
  playDeathOnce() {
    if (!this.deathTime) this.deathTime = new Date().getTime();
    let frameIndex = Math.floor((new Date().getTime() - this.deathTime) / 150);
    if (frameIndex < this.IMAGES_DEAD.length) {
      this.img = this.imageCache[this.IMAGES_DEAD[frameIndex]];
    } else {
      this.showGrave();
    }
  }

  /**
   * Replaces Pepe with his grave on the ground.
   */
  showGrave() {
    this.img = this.imageCache[this.IMAGE_GRAVE];
    this.width = 160;
    this.height = 146;
    this.y = 290;
  }

  /**
   * Plays the running sound while Pepe walks on the ground.
   */
  updateRunningSound() {
    let isRunning = (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround();
    isRunning ? playLoop('running') : stopLoop('running');
  }

  /**
   * Starts a jump of Pepe.
   */
  jump() {
    this.speedY = 30;
  }
}
