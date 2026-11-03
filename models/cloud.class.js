class Cloud extends MovableObject{
        y = 20;
        width = 500;
        height = 250;

    /**
     * Creates a cloud and starts its movement.
     * @param {string} imagePath - Path of the cloud image.
     * @param {number} x - Start position.
     */
    constructor(imagePath, x){
        super().loadImage(imagePath);
        this.x = x;
        this.animate();
    }

    /**
     * Moves the cloud slowly to the left.
     */
    animate(){
        setStoppableInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }



}