// src/scenes/LabyrinthScene.ts
import Phaser from "phaser";

interface MazeCell {
  visited: boolean;
  doors: { top: boolean; right: boolean; bottom: boolean; left: boolean };
}

export default class LabyrinthScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  private readonly ROOM_WIDTH = 800;
  private readonly ROOM_HEIGHT = 600;
  private readonly MAZE_COLS = 4;
  private readonly MAZE_ROWS = 4;
  private maze: MazeCell[][] = [];

  constructor() {
    super({ key: "LabyrinthScene" });
  }

  preload(): void {
    this.load.setBaseURL("/assets/images");
    this.load.image("platform", "platform.png");
    this.load.image("sky", "sky2.png");
    this.load.spritesheet("dude", "dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create(): void {
    const worldWidth = this.ROOM_WIDTH * this.MAZE_COLS;
    const worldHeight = this.ROOM_HEIGHT * this.MAZE_ROWS;

    this.generateMaze();

    this.add.tileSprite(
      worldWidth / 2,
      worldHeight / 2,
      worldWidth,
      worldHeight,
      "sky",
    );

    this.platforms = this.physics.add.staticGroup();

    for (let r = 0; r < this.MAZE_ROWS; r++) {
      for (let c = 0; c < this.MAZE_COLS; c++) {
        this.createRoom(c, r);
      }
    }

    this.player = this.physics.add.sprite(64, worldHeight - 64, "dude");
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
  }

  update(): void {
    this.player.setVelocityX(0);
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("left", true);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    } else {
      this.player.anims.play("turn");
    }

    if (this.cursors.up?.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-300);
    }
  }

  private createRoom(col: number, row: number): void {
    const cell = this.maze[row][col];
    const x = col * this.ROOM_WIDTH;
    const y = row * this.ROOM_HEIGHT;

    const wallThickness = 32;

    // Floor
    this.platforms
      .create(
        x + this.ROOM_WIDTH / 2,
        y + this.ROOM_HEIGHT - wallThickness / 2,
        "platform",
      )
      .setDisplaySize(this.ROOM_WIDTH, wallThickness)
      .refreshBody();
    // Ceiling
    this.platforms
      .create(x + this.ROOM_WIDTH / 2, y + wallThickness / 2, "platform")
      .setDisplaySize(this.ROOM_WIDTH, wallThickness)
      .refreshBody();
    // Left wall
    this.platforms
      .create(x + wallThickness / 2, y + this.ROOM_HEIGHT / 2, "platform")
      .setDisplaySize(wallThickness, this.ROOM_HEIGHT)
      .refreshBody();
    // Right wall
    this.platforms
      .create(
        x + this.ROOM_WIDTH - wallThickness / 2,
        y + this.ROOM_HEIGHT / 2,
        "platform",
      )
      .setDisplaySize(wallThickness, this.ROOM_HEIGHT)
      .refreshBody();

    // Create doorways by removing walls
    if (cell.doors.top) {
      this.removeWall(
        x + this.ROOM_WIDTH / 2,
        y + wallThickness / 2,
        this.ROOM_WIDTH / 4,
        wallThickness,
      );
    }
    if (cell.doors.bottom) {
      this.removeWall(
        x + this.ROOM_WIDTH / 2,
        y + this.ROOM_HEIGHT - wallThickness / 2,
        this.ROOM_WIDTH / 4,
        wallThickness,
      );
    }
    if (cell.doors.left) {
      this.removeWall(
        x + wallThickness / 2,
        y + this.ROOM_HEIGHT / 2,
        wallThickness,
        this.ROOM_HEIGHT / 4,
      );
    }
    if (cell.doors.right) {
      this.removeWall(
        x + this.ROOM_WIDTH - wallThickness / 2,
        y + this.ROOM_HEIGHT / 2,
        wallThickness,
        this.ROOM_HEIGHT / 4,
      );
    }

    // Random platform inside room
    const platformCount = Phaser.Math.Between(1, 3);
    for (let i = 0; i < platformCount; i++) {
      const px = x + Phaser.Math.Between(100, this.ROOM_WIDTH - 100);
      const py = y + Phaser.Math.Between(100, this.ROOM_HEIGHT - 100);
      this.platforms
        .create(px, py, "platform")
        .setDisplaySize(100, wallThickness)
        .refreshBody();
    }
  }

  private removeWall(
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    this.platforms.children.iterate((child) => {
      const body = child.body as Phaser.Physics.Arcade.Body;
      if (
        child.x === x &&
        child.y === y &&
        child.displayWidth === width &&
        child.displayHeight === height
      ) {
        child.destroy();
      }
    });
  }

  private generateMaze(): void {
    this.maze = [];
    for (let r = 0; r < this.MAZE_ROWS; r++) {
      const row: MazeCell[] = [];
      for (let c = 0; c < this.MAZE_COLS; c++) {
        row.push({
          visited: false,
          doors: { top: false, right: false, bottom: false, left: false },
        });
      }
      this.maze.push(row);
    }

    const stack: { r: number; c: number }[] = [];
    let current = { r: 0, c: 0 };
    this.maze[0][0].visited = true;
    do {
      const neighbors = this.getUnvisitedNeighbors(current.r, current.c);
      if (neighbors.length > 0) {
        const next = Phaser.Math.RND.pick(neighbors);
        stack.push(current);
        this.openDoor(current, next);
        current = next;
        this.maze[current.r][current.c].visited = true;
      } else if (stack.length > 0) {
        const prev = stack.pop();
        if (prev) {
          current = prev;
        }
      }
    } while (stack.length > 0);
  }

  private getUnvisitedNeighbors(
    r: number,
    c: number,
  ): { r: number; c: number }[] {
    const neighbors: { r: number; c: number }[] = [];
    if (r > 0 && !this.maze[r - 1][c].visited) neighbors.push({ r: r - 1, c });
    if (r < this.MAZE_ROWS - 1 && !this.maze[r + 1][c].visited)
      neighbors.push({ r: r + 1, c });
    if (c > 0 && !this.maze[r][c - 1].visited) neighbors.push({ r, c: c - 1 });
    if (c < this.MAZE_COLS - 1 && !this.maze[r][c + 1].visited)
      neighbors.push({ r, c: c + 1 });
    return neighbors;
  }

  private openDoor(
    current: { r: number; c: number },
    next: { r: number; c: number },
  ): void {
    if (current.r === next.r) {
      if (current.c < next.c) {
        this.maze[current.r][current.c].doors.right = true;
        this.maze[next.r][next.c].doors.left = true;
      } else {
        this.maze[current.r][current.c].doors.left = true;
        this.maze[next.r][next.c].doors.right = true;
      }
    } else if (current.c === next.c) {
      if (current.r < next.r) {
        this.maze[current.r][current.c].doors.bottom = true;
        this.maze[next.r][next.c].doors.top = true;
      } else {
        this.maze[current.r][current.c].doors.top = true;
        this.maze[next.r][next.c].doors.bottom = true;
      }
    }
  }
}
