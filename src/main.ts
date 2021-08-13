import Phaser from 'phaser'

import MainScene from './scenes/Game'

const config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 704,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [MainScene]
}

export default new Phaser.Game(config)
