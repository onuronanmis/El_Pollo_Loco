const level1 = new level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss(),
    ],
    [
        new cloud()
    ],
    [
        new BackgroundObject('assets/img/5_background/layers/air.png', -720*2),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', -720*2),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', -720*2),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', -720*2),
        new BackgroundObject('assets/img/5_background/layers/air.png', -720),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', -720),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', -720),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', -720),

        new BackgroundObject('assets/img/5_background/layers/air.png', 0),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('assets/img/5_background/layers/air.png', 720),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 720),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 720),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 720),

        new BackgroundObject('assets/img/5_background/layers/air.png', 720*2),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/1.png', 720*2),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/1.png', 720*2),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 720*2),
        new BackgroundObject('assets/img/5_background/layers/air.png', 720*3),
        new BackgroundObject('assets/img/5_background/layers/3_third_layer/2.png', 720*3),
        new BackgroundObject('assets/img/5_background/layers/2_second_layer/2.png', 720*3),
        new BackgroundObject('assets/img/5_background/layers/1_first_layer/2.png', 720*3),
    ],
    [
        new Bottle(450, false),
        new Bottle(800, true),
        new Bottle(1150, false),
        new Bottle(1550, true),
        new Bottle(1950, false),
    ]
);