class MovableObject{
    x = 120;
    y = 400;
    img;

    loadImage(path){
        this.img = new Image();
        this.img.srs = path;
    }

    moveRight() {
        console.log('Moving right'); 
    }

    moveLeft(){
        
    }
}





