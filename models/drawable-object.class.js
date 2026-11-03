class DrawableObject {
    x = 120;
    y = 280;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads a single image as the current image.
     * @param {string} path - Path of the image.
     */
    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current image on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     */
    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Preloads several images into the image cache.
     * @param {string[]} arr - Paths of the images.
     */
    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
            
        });
    }

}