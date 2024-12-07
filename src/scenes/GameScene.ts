// src/scenes/GameScene.ts

import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private ceiling!: Phaser.GameObjects.Rectangle;
  private speed = 50; // Velocità del soffitto (pixel per secondo)
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private lastPlatformY = 0;
  private sky!: Phaser.GameObjects.TileSprite;

  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
    // Imposta l'URL base per tutti gli asset
    this.load.setBaseURL("/assets/images");

    // Carica gli asset utilizzando percorsi relativi
    this.load.image("sky", "sky2.png"); // Sfondo
    this.load.image("platform", "platform.png"); // Piattaforme
    this.load.spritesheet("dude", "dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    }); // Giocatore
  }

  create(): void {
    const { width, height } = this.scale;

    // Aggiungi lo sfondo come TileSprite per permettere lo scorrimento
    this.sky = this.add
      .tileSprite(width / 2, height / 2, width, height, "sky")
      .setScrollFactor(0);

    // Crea un gruppo di piattaforme dinamiche
    this.platforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Inizializza lastPlatformY
    this.lastPlatformY = 0;

    // Genera piattaforme iniziali con maggiore distanza
    for (let i = 0; i < 10; i++) {
      const y = i * 120; // Intervallo costante
      const x = Phaser.Math.Between(100, width - 100);
      this.createPlatformWithHole(x, y);
      this.lastPlatformY = y;
    }

    // Crea il giocatore con una posizione iniziale più in alto
    this.player = this.physics.add.sprite(width / 2, 100, "dude");
    this.player.setBounce(0.2);

    // Animazioni del giocatore
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

    // Abilita le collisioni tra il giocatore e le piattaforme
    this.physics.add.collider(this.player, this.platforms);

    // Input del giocatore
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    // Crea il soffitto come una barriera e assegna a 'this.ceiling'
    this.ceiling = this.add
      .rectangle(width / 2, 0, width, 50, 0xff0000)
      .setScrollFactor(0);
    this.physics.add.existing(this.ceiling, true); // Corpo statico

    // Collisione tra giocatore e soffitto
    this.physics.add.collider(
      this.player,
      this.ceiling,
      this.gameOver,
      undefined,
      this,
    );

    // Testo del punteggio, fissato alla camera
    this.scoreText = this.add
      .text(16, 16, "Score: 0", { fontSize: "32px", color: "#fff" })
      .setScrollFactor(0);

    // Imposta la camera per seguire il giocatore verticalmente
    this.cameras.main.startFollow(this.player, true, 0, 0);
    this.cameras.main.setBounds(0, 0, width, Number.MAX_SAFE_INTEGER); // Stesso bound della fisica
  }

  update(time: number, delta: number): void {
    // Movimento del giocatore
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("left", true);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    const { width, height } = this.scale;
    const speedPerFrame = this.speed * (delta / 1000);

    // Aggiorna la posizione del tile dello sfondo per creare un effetto di movimento
    this.sky.tilePositionY += speedPerFrame * 0.5; // Fattore di parallax

    // Sposta la camera verso il basso con il giocatore
    this.cameras.main.scrollY = Math.max(
      this.cameras.main.scrollY,
      this.player.y - 300,
    );

    // Generazione di nuove piattaforme sotto la telecamera
    while (this.lastPlatformY < this.cameras.main.scrollY + height + 600) {
      // Genera fino a 600 pixel sotto la telecamera
      this.lastPlatformY += 120; // Intervallo verticale costante
      const x = Phaser.Math.Between(100, width - 100);
      this.createPlatformWithHole(x, this.lastPlatformY);
    }

    // Rimuovi le piattaforme che sono sopra il soffitto
    for (const platform of this.platforms.getChildren() as Phaser.Physics.Arcade.Sprite[]) {
      if (platform && platform.y < this.ceiling.y - 50) {
        // 50 è l'altezza del soffitto
        platform.destroy();
      }
    }

    // Aggiorna il punteggio basato sulla distanza percorsa
    this.score = Math.max(this.score, Math.floor(this.player.y));
    this.scoreText.setText(`Score: ${this.score}`);

    // Condizione di Game Over: Giocatore esce dall'area visibile in alto
    if (this.player.y < this.cameras.main.scrollY) {
      this.gameOver();
    }

    // Fine del gioco se il giocatore scende sotto lo schermo
    if (this.player.y > this.cameras.main.scrollY + 600) {
      this.gameOver();
    }

    // Incrementa la velocità del soffitto nel tempo per aumentare la difficoltà
    this.speed += 0.005;
    if (this.speed > 200) {
      // Limite massimo della velocità
      this.speed = 200;
    }

    // Implementa il wrap orizzontale
    if (this.player.x > width) {
      this.player.x = 0;
    } else if (this.player.x < 0) {
      this.player.x = width;
    }
  }

  private createPlatformWithHole(x: number, y: number): void {
    // Decidi casualmente se creare una piattaforma con un buco
    const hasHole = Phaser.Math.Between(0, 1) === 0; // 50% di probabilità

    if (hasHole) {
      const gapSize = 100; // Dimensione del buco
      const distnace = Phaser.Math.Between(11, 16) * 10;

      // Piattaforma sinistra
      const leftPlatform = this.platforms.create(
        x - gapSize / 2 - distnace,
        y,
        "platform",
      ) as Phaser.Physics.Arcade.Sprite;
      if (leftPlatform) {
        leftPlatform.setVelocityY(-this.speed); // Muove la piattaforma verso l'alto
        leftPlatform.setScale(0.66, 1); //(200, 32); // Imposta dimensioni specifiche
      }

      // Piattaforma destra
      const rightPlatform = this.platforms.create(
        x + gapSize / 2 + 50,
        y,
        "platform",
      ) as Phaser.Physics.Arcade.Sprite;
      if (rightPlatform) {
        rightPlatform.setVelocityY(-this.speed); // Muove la piattaforma verso l'alto
        rightPlatform.setScale(0.66, 1); // Imposta dimensioni specifiche
      }
    } else {
      const centerPlatform = this.platforms.create(
        x,
        y,
        "platform",
      ) as Phaser.Physics.Arcade.Sprite;
      if (centerPlatform) {
        centerPlatform.setVelocityY(-this.speed); // Muove la piattaforma verso l'alto
        centerPlatform.setScale(0.66, 1);
      }
    }
  }

  private gameOver(): void {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");

    const { width, height, scrollX, scrollY } = this.cameras.main;

    // Mostra il messaggio di Game Over
    this.add
      .text(scrollX + width / 2, scrollY + height / 2, "Game Over", {
        fontSize: "64px",
        color: "#fff",
      })
      .setOrigin(0.5);

    // Mostra il punteggio finale
    this.add
      .text(
        scrollX + width / 2,
        scrollY + height / 2 + 100,
        `Score: ${this.score}`,
        {
          fontSize: "32px",
          color: "#fff",
        },
      )
      .setOrigin(0.5);

    // Opzione per ricominciare
    this.input.once("pointerdown", () => {
      this.scene.restart();
      this.score = 0;
      this.speed = 50; // Reset della velocità del soffitto
    });
  }
}
