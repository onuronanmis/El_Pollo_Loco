class StatusBar extends DrawableObject {
  percentage = 100;
  x = 20;
  width = 200;
  height = 60;

  /**
   * Sets the value of the bar and shows the matching image.
   * @param {number} percentage - Value between 0 and 100.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let imagePath = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[imagePath];
  }

  /**
   * Finds the image index for the current percentage.
   * @returns {number}
   */
  resolveImageIndex() {
    if (this.percentage == 100) return 5;
    else if (this.percentage > 80) return 4;
    else if (this.percentage > 60) return 3;
    else if (this.percentage > 40) return 2;
    else if (this.percentage > 20) return 1;
    else return 0;
  }
}
