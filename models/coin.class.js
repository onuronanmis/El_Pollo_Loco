class Coin extends MovableObject {
    width = 100;
    height = 100;
    offset = { top: 30, bottom: 30, left: 30, right: 30 };
    IMAGES_COIN = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
    ];

    constructor(x, y){
        super().loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Lets the coin pulse between its two images.
     */
    animate(){
        setInterval(() => this.playAnimation(this.IMAGES_COIN), 300);
    }
}
