import Phaser from 'phaser';

class StartPageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartPageScene' });
    }

    preload() {
        this.load.image('background1', 'assets/bg2.jpg');
         this.load.audio('birdSound', 'assets/bird.mp3'); // Preload bird sound
        this.load.script('webglfilter', 'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.50.0/dist/phaser.js');
    }

    create() {
        this.updateLayout();
        this.playBackgroundSound(); // Play bird sound on scene start
        window.addEventListener('resize', () => this.updateLayout());
        // Stop audio when scene changes
        this.events.on('shutdown', () => this.stopBackgroundSound());
        this.events.on('destroy', () => this.stopBackgroundSound());
    }

     playBackgroundSound() {
        const birdSound = this.sound.add('birdSound', { loop: true, volume: 0.5 });
        birdSound.play(); // Play the bird sound with looping enabled
    }
    stopBackgroundSound() {
        if (this.birdSound) {
            this.birdSound.stop(); // Stop the bird sound
            this.birdSound.destroy(); // Clean up
        }
    }


    updateLayout() {
        const { width, height } = this.sys.game.canvas;

        // Clear existing elements if present
        this.children.removeAll();

        // Create background and apply blur
        const background = this.add.image(0, 0, 'background1')
            .setOrigin(0)
            .setDisplaySize(width, height);
        this.applyBlur(background);

        // Create buttons with updated positions
        this.createButtons(width, height);
    }

    createButtons(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;

        // Create buttons with dynamic positions
        this.createRoundedButton(centerX, centerY - 100, 'Play Game', () => this.scene.start('lvl1'));
        this.createRoundedButton(centerX, centerY, 'Instruction', () => this.displayInstructionPopup(width, height));
        this.createRoundedButton(centerX, centerY + 100, 'Hints', () => this.scene.start('HintsPage'));
    }

    createRoundedButton(x, y, text, onClick) {
        const button = this.add.graphics();
        const buttonWidth = Math.min(this.sys.game.canvas.width * 0.25, 200); // Scalable width
        const buttonHeight = Math.min(this.sys.game.canvas.height * 0.08, 50); // Scalable height
        const cornerRadius = 20;

        // Draw button background
        button.fillStyle(0x008080, 1); // Teal color
        button.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);

        // Add black border
        button.lineStyle(4, 0x000000, 1);
        button.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);

        // Add text
        const buttonText = this.add.text(0, 0, text, {
            fontSize: `${buttonHeight / 2}px`,
            fill: '#ffffff',
        }).setOrigin(0.5);

        const buttonContainer = this.add.container(x, y, [button, buttonText]);
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive({ useHandCursor: true })
            .on('pointerdown', onClick)
            .on('pointerover', () => this.onHover(button))
            .on('pointerout', () => this.onOut(button));
    }

    onHover(button) {
        button.clear();
        button.fillStyle(0x00cccc, 1);
        button.fillRoundedRect(-100, -25, 200, 50, 20);
        button.lineStyle(4, 0x000000, 1);
        button.strokeRoundedRect(-100, -25, 200, 50, 20);
    }

    onOut(button) {
        button.clear();
        button.fillStyle(0x008080, 1);
        button.fillRoundedRect(-100, -25, 200, 50, 20);
        button.lineStyle(4, 0x000000, 1);
        button.strokeRoundedRect(-100, -25, 200, 50, 20);
    }

    displayInstructionPopup(width, height) {
        const popupWidth = Math.min(width * 0.5, 400);
        const popupHeight = Math.min(height * 0.3, 200);

        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0x000000, 0.7);
        popupBackground.fillRoundedRect(width / 2 - popupWidth / 2, height / 2 - popupHeight / 2, popupWidth, popupHeight, 15);
        popupBackground.setDepth(10);

        const instructionText = this.add.text(width / 2, height / 2, 'Instructions: Match the cards based on their type.', {
            fontSize: '18px',
            fill: '#ffffff',
            wordWrap: { width: popupWidth - 50, useAdvancedWrap: true },
            align: 'center',
        }).setOrigin(0.5).setDepth(11);

        const closeButton = this.add.text(width / 2 + popupWidth / 2 - 30, height / 2 - popupHeight / 2 + 10, 'X', {
            fontSize: '18px',
            fill: '#ff0000',
            fontStyle: 'bold',
            backgroundColor: '#ffffff',
            padding: { left: 5, right: 5, top: 2, bottom: 2 },
        }).setInteractive().setDepth(12);

        closeButton.on('pointerdown', () => {
            popupBackground.destroy();
            instructionText.destroy();
            closeButton.destroy();
        });
    }

    applyBlur(background) {
        const blurPipeline = this.game.renderer.pipelines.get('Blur');
        background.setPipeline(blurPipeline);
    }
}

export default StartPageScene;
