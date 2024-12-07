import { Capacitor } from "@capacitor/core";
import {
  type OrientationLockType,
  ScreenOrientation,
} from "@capacitor/screen-orientation";
import { StatusBar } from "@capacitor/status-bar";
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import { type GameArea, GameType, getSizeByOrientation } from "./utils/area";

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

  const GAME_MODE = GameType.Portrait;

  /**
   * Calculate initial game dimensions and update configuration.
   */
  const {
    width,
    height,
    GAME_AREA,
  }: { width: number; height: number; GAME_AREA: GameArea } =
    getSizeByOrientation(GAME_MODE);

  console.log(JSON.stringify(GAME_AREA));

  // Update the scale configuration with the calculated dimensions
  if (config.scale) {
    config.scale.width = width || GAME_AREA.w;
    config.scale.height = height || GAME_AREA.h;
  }

  /**
   * Initialize the Phaser game instance.
   */
  const game = new Phaser.Game(config);

  /**
   * Handles window resize events and adjusts the Phaser canvas size.
   */
  function onResize(): void {
    // Recalculate the dimensions based on the current window size
    const { width, height } = getSizeByOrientation(GAME_MODE);

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
  ScreenOrientation.lock({ orientation: mode }).then(async () => {
    await StatusBar.hide();
    main();
  });
} else {
  main();
}
