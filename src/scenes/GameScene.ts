import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  // Define the logo as a class property with the appropriate type
  private logo!: Phaser.GameObjects.Image;

  constructor() {
    super("GameScene");
  }

  /**
   * Preloads assets for the game.
   */
  preload(): void {
    // Load resources
    this.load.image("logo", "assets/images/logo.png");
  }

  /**
   * Creates the game scene, initializing objects and animations.
   */
  create(): void {
    console.log(`H => ${this.scale.height}`);
    console.log(`W => ${this.scale.width}`);

    // Add an image at the center of the screen
    this.logo = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2 + 300,
      "logo",
    );
    this.logo.setScale(0.5);

    // Make the image move up and down
    this.tweens.add({
      targets: this.logo,
      y: this.scale.height / 2 - 300,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1,
    });
  }

  /**
   * Updates the game logic.
   * Called on every frame.
   */
  update(): void {
    // Update logic (if needed)
  }
}
