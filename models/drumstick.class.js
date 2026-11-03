class Drumstick extends MovableObject {
  width = 48;
  height = 43;
  y = 382;

  /**
   * Creates a drumstick that heals Pepe.
   * @param {number} x - Position next to the grinder.
   */
  constructor(x) {
    super().loadImage("assets/img/Walze/haehnchenkeule_10HP.png");
    this.x = x;
  }
}
