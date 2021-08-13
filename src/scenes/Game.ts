import Phaser from 'phaser'

export default class Game extends Phaser.Scene {
    private player?: Phaser.GameObjects.Sprite;
    private boxes: Phaser.GameObjects.Sprite[] = [];

    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

	constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.spritesheet('tiles', 'assets/main_tilesheet.png', {
            frameWidth: 64,
            startFrame: 0
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        // DEBUG TILESHEET
        // this.add.image(400, 300, 'tiles', 1);

        const level = [
            [99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99],
            [99,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 99],
            [99,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 99],
            [99,  0,  0,  51, 8, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 99],
            [99,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 99],
            [99,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 99],
            [99,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 99],
            [99,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 99],
            [99,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 99],
            [99,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 99],
            [99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99]
        ];

        const map = this.make.tilemap({ 
            data: level, 
            tileWidth: 64, 
            tileHeight: 64
        });

        const tiles = map.addTilesetImage('tiles');
        const layer = map.createLayer(0, tiles, 0, 0);

        this.player = layer.createFromTiles(13, 13, { key: 'tiles', frame: 52 }).pop();
        this.player?.setOrigin(0);
        
		this.createPlayerAnimations();

        this.boxes = layer.createFromTiles(8, 0, { key: 'tiles', frame: 8})
            .map(box => box.setOrigin(0));
        
    }

    update() {
		if (!this.cursors || !this.player)
		{
			return;
		}

        const justLeft = Phaser.Input.Keyboard.JustDown(this.cursors.left!);
        const justRight = Phaser.Input.Keyboard.JustDown(this.cursors.right!);
        const justUp = Phaser.Input.Keyboard.JustDown(this.cursors.up!);
        const JustDown = Phaser.Input.Keyboard.JustDown(this.cursors.down!);

        if (justLeft) {
            const box = this.getBoxAt(this.player.x - 32, this.player.y);
            const baseTween = {
                x: "-=64",
                duration: 250
            }

            this.tweenMove(box, baseTween, () => {
                this.player?.anims.play('left', true);
            });

		} else if (justRight) {
            const box = this.getBoxAt(this.player.x + 96, this.player.y);
            const baseTween = {
                x: "+=64",
                duration: 250
            }

            this.tweenMove(box, baseTween, () => {
                this.player?.anims.play('right', true);
            });

		} else if (justUp) {
            const box = this.getBoxAt(this.player.x, this.player.y - 32);
            const baseTween = {
                y: "-=64",
                duration: 250
            }

            this.tweenMove(box, baseTween, () => {
                this.player?.anims.play('up', true);
            });

		} else if (JustDown) {
            const box = this.getBoxAt(this.player.x, this.player.y + 96);
            const baseTween = {
                y: "+=64",
                duration: 250
            }

            this.tweenMove(box, baseTween, () => {
                this.player?.anims.play('down', true);
            });

		} 
    }

    private tweenMove(box: Phaser.GameObjects.Sprite | undefined, baseTween: any, onStart: () => void) {
        if (box) {
            this.tweens.add(Object.assign(
                baseTween,
                {
                    targets: box
                }
            ))
        }

        this.tweens.add(Object.assign(
            baseTween,
            {
                targets: this.player,
                onComplete: this.stopPlayerAnimation,
                onCompleteScope: this,
                onStart
            })
        )
    }

    private stopPlayerAnimation() {
        if (!this.player) return;

        const animKey = this.player?.anims.currentAnim?.key

        if (!animKey.startsWith('idle-')) {
            this.player.anims.play(`idle-${animKey}`, true);
        }
    }
    private getBoxAt(x: number, y: number) {
        return this.boxes.find(box => {
            const rect = box.getBounds()

            return rect.contains(x, y);
        });
    }

    private createPlayerAnimations() {
        this.anims.create({
			key: 'idle-down',
			frames: [ { key: 'tiles', frame: 52 }]
		})

		this.anims.create({
			key: 'idle-left',
			frames: [ { key: 'tiles', frame: 81 }]
		})

		this.anims.create({
			key: 'idle-right',
			frames: [ { key: 'tiles', frame: 78 }]
		})

		this.anims.create({
			key: 'idle-up',
			frames: [ { key: 'tiles', frame: 55 }]
		})

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('tiles', { start: 81, end: 83 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('tiles', { start: 78, end: 80 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers('tiles', { start: 55, end: 57 }),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers('tiles', { start: 52, end: 54 }),
			frameRate: 10,
			repeat: -1
		})
    }
}
