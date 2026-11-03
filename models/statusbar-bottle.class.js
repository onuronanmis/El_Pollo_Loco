class BottleBar extends StatusBar {
  y = 90;
  IMAGES = [
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  /**
   * Creates the status bar and preloads its images.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
  }
}
