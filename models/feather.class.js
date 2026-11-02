class Feather {
  constructor(x, y, featherIndex) {
    this.x = x;
    this.y = y;
    this.speedX = (featherIndex - 3) * 1.2;
    this.speedY = -4 - (featherIndex % 3);
    this.life = 48;
    this.color = featherIndex % 2 ? "#fff8df" : "#e5a05b";
  }

  /**
   * Moves the feather and reduces its remaining life.
   */
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.19;
    this.life--;
  }

  /**
   * Draws the feather as a fading ellipse.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, this.life / 18);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, 5, 11, this.speedX / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
