class Drumstick extends MovableObject {
  width = 48;
  height = 43;
  y = 382;

  constructor(x) {
    super().loadImage("assets/img/Walze/haehnchenkeule_10HP.png");
    this.x = x;
  }
}
