class BackgroundObject extends MovableObject{
    x = 0;
    y = 0;
    width = 720;
    height = 480;

    /**
     * Creates a background layer at the bottom of the canvas.
     * @param {string} imagePath - Path of the layer image.
     * @param {number} x - Horizontal position.
     */
    constructor(imagePath, x){
        super().loadImage(imagePath);

        this.x = x
        this.y = 480 - this.height
    }

}