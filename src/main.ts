import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import { getSizeByOrientation, GameType, GameArea } from "./utils/area";
import {
  ScreenOrientation,
  OrientationLockType,
} from "@capacitor/screen-orientation";
import { Capacitor } from "@capacitor/core";

function isNativePlatform(): boolean {
  const platform = Capacitor.getPlatform();
  console.log(`Running on platform: ${platform}`);
  return platform === "ios" || platform === "android";
}

function main(): void {
  /**
   * Phaser game configuration with proper typing.
   */
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "game-container",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 350, x: 0 },
        debug: true,
      },
    },
    scene: [GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 0, // Placeholder, will be dynamically set
      height: 0, // Placeholder, will be dynamically set
    },
  };

  /**
   * Calculate initial game dimensions and update configuration.
   */
  const {
    width,
    height,
    GAME_AREA,
  }: { width: number; height: number; GAME_AREA: GameArea } =
    getSizeByOrientation(GameType.Landscape);

  console.log(JSON.stringify(GAME_AREA));

  // Update the scale configuration with the calculated dimensions
  config.scale!.width = width;
  config.scale!.height = height;

  /**
   * Initialize the Phaser game instance.
   */
  const game = new Phaser.Game(config);

  /**
   * Handles window resize events and adjusts the Phaser canvas size.
   */
  function onResize(): void {
    // Recalculate the dimensions based on the current window size
    const { width, height } = getSizeByOrientation(GameType.Landscape);

    // Resize the Phaser game canvas
    game.scale.resize(width, height);

    console.log(`New dimensions: ${width}x${height}`);
  }

  // Attach the resize event listener
  window.addEventListener("resize", onResize);

  // Initial call to ensure the canvas is correctly resized
  onResize();
}

const mode: OrientationLockType = "landscape";
if (isNativePlatform()) {
  ScreenOrientation.lock({ orientation: mode }).then(() => {
    main();
  });
} else {
  main();
}
