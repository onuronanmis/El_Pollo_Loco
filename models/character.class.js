class Character extends MovableObject {
  height = 280;
  y = 55;
  speed = 10;
  offset = { top: 110, bottom: 10, left: 20, right: 20 };
  bottleCount = 0;
  coinCount = 0;
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
  

  world;
  deathTime = 0;
  IMAGE_GRAVE = "assets/img/2_character_pepe/5_dead/Pepe am Grab mit Sombrero.webp";

  constructor() {
    super().loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages([this.IMAGE_GRAVE]);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setStoppableInterval(() => this.moveCharacter(), 1000 / 60);
    setStoppableInterval(() => this.playCharacterAnimation(), 50);
  }

  /**
   * Moves Pepe according to the pressed keys and updates the camera.
   */
  moveCharacter() {
    if (this.isDead()) return stopLoop('running');
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
    }
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

  jump() {
    this.speedY = 30;
  }
}
