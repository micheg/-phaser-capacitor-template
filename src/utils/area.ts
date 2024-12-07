const HORIZONTAL_SIZE = 480; // can be 720;
const VERTICAL_SIZE = 854; // or can be 1280;
/**
 * Interface representing the game area dimensions and aspect ratio.
 */
export interface GameArea {
  /** Width of the game area */
  w: number;
  /** Height of the game area */
  h: number;
  /** Aspect ratio of the game area */
  factor: number;
}

/**
 * Game area configuration for portrait orientation.
 */
export const GAME_AREA_PORTRAIT: GameArea = {
  w: HORIZONTAL_SIZE,
  h: VERTICAL_SIZE,
  factor: 9 / 16,
};

/**
 * Game area configuration for landscape orientation.
 */
export const GAME_AREA_LANDSCAPE: GameArea = {
  w: VERTICAL_SIZE,
  h: HORIZONTAL_SIZE,
  factor: 16 / 9,
};

/**
 * Enum representing the game orientation type.
 */
export enum GameType {
  /** Landscape orientation */
  Landscape = "landscape",
  /** Portrait orientation */
  Portrait = "portrait",
}

/**
 * Calculates the game area dimensions based on the screen size and orientation.
 *
 * @param type - The game orientation type (portrait or landscape).
 * @returns An object containing the calculated width, height, and the selected GAME_AREA configuration.
 */
export function getSizeByOrientation(type: GameType = GameType.Portrait): {
  width: number;
  height: number;
  GAME_AREA: GameArea;
} {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = width / height;

  let newWidth: number | null = null;
  let newHeight: number | null = null;
  let GAME_AREA: GameArea;

  if (type === GameType.Portrait) {
    // Portrait mode
    GAME_AREA = GAME_AREA_PORTRAIT;
    newHeight = ratio > GAME_AREA.factor ? GAME_AREA.h : GAME_AREA.w / ratio;
    newWidth = GAME_AREA.w;
  } else {
    // Landscape mode
    GAME_AREA = GAME_AREA_LANDSCAPE;
    newWidth = ratio > GAME_AREA.factor ? GAME_AREA.h * ratio : GAME_AREA.w;
    newHeight = GAME_AREA.h;
  }
  return {
    width: newWidth,
    height: newHeight,
    GAME_AREA,
  };
}
