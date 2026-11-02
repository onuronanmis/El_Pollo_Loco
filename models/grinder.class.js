class Grinder extends MovableObject {
  x = -455;
  y = 362;
  width = 170;
  height = 65;
  drumsticks = [];
  feathers = [];
  IMAGES_IDLE = [
    "assets/img/Walze/walze/frame_00.png",
    "assets/img/Walze/walze/frame_01.png",
    "assets/img/Walze/walze/frame_02.png",
    "assets/img/Walze/walze/frame_03.png",
    "assets/img/Walze/walze/frame_04.png",
    "assets/img/Walze/walze/frame_05.png",
    "assets/img/Walze/walze/frame_06.png",
    "assets/img/Walze/walze/frame_07.png",
    "assets/img/Walze/walze/frame_08.png",
    "assets/img/Walze/walze/frame_09.png",
    "assets/img/Walze/walze/frame_10.png",
    "assets/img/Walze/walze/frame_11.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.animate();
  }

  /**
   * Plays the endless roller animation.
   */
  animate() {
    setInterval(() => this.playAnimation(this.IMAGES_IDLE), 1000 / 12);
  }

  /**
   * Checks whether an enemy has reached the visible intake of the grinder.
   * @param {MovableObject} enemy - The enemy to check.
   * @returns {boolean} True if the enemy is at the intake.
   */
  isAtIntake(enemy) {
    let intakeX = this.x + this.width - 28;
    let isNearGround = enemy.y + enemy.height >= this.y + 12;
    return isNearGround && enemy.x <= intakeX && enemy.x + enemy.width >= intakeX - 18;
  }

  /**
   * Starts a feather burst and spawns a drumstick shortly after.
   */
  grind() {
    playSound('splat');
    let intakeX = this.x + this.width - 28;
    for (let featherIndex = 0; featherIndex < 7; featherIndex++) {
      this.feathers.push(new Feather(intakeX, this.y + 10, featherIndex));
    }
    setTimeout(() => this.spawnDrumstick(), 500);
  }

  /**
   * Places a new drumstick on a random free slot next to the grinder.
   */
  spawnDrumstick() {
    let freeSpots = this.findFreeSpots();
    let spotX = freeSpots.length > 0
      ? freeSpots[Math.floor(Math.random() * freeSpots.length)]
      : this.x + this.width + 12 + this.drumsticks.length * 54;
    this.drumsticks.push(new Drumstick(spotX));
  }

  /**
   * Collects all slots that are not occupied by a drumstick.
   * @returns {number[]} The x positions of the free slots.
   */
  findFreeSpots() {
    let startX = this.x + this.width + 12;
    let allSpots = Array.from({ length: 12 }, (_, slotIndex) => startX + slotIndex * 54);
    return allSpots.filter((spotX) =>
      this.drumsticks.every((drumstick) => Math.abs(drumstick.x - spotX) >= 52));
  }

  /**
   * Moves all feathers and removes the expired ones.
   */
  updateFeathers() {
    this.feathers.forEach((feather) => feather.update());
    this.feathers = this.feathers.filter((feather) => feather.life > 0);
  }
}
