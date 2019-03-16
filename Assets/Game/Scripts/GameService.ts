namespace game 
{
    export class GameService 
    {    
        private static mainGroup: string = 'game.MainGroup';
        private static cubeGroup: string = 'game.CubeGroup';
		private static titleGroup: string = 'game.TitleGroup';
		private static gameUiGroup: string = 'game.GameUIGroup';
		private static gameOverGroup: string = 'game.GameOverGroup';
		private static gameOverDelay: number = 1000;

		static gameOver: boolean;
		static menuVisible: boolean = true;
		static camOffset: Vector2 = new Vector2(0.0, 1.0);
		static projMatrix: utmath.Matrix4;
		static score: number = 0;
		static highscore: number = 0;
		
		static linkCanvas(world: ut.World, canvasEntity: ut.Entity) {			
			let camEntity: ut.Entity = world.getEntityByName("Camera");
			let canvas: ut.UILayout.UICanvas = world.getComponentData(canvasEntity, ut.UILayout.UICanvas);
			canvas.camera = camEntity;
			world.setComponentData(canvasEntity, canvas);
		}

		static init(world: ut.World)
		{
			if (this.menuVisible) {
				ut.EntityGroup.instantiate(world, this.titleGroup);

				let canvasEntity: ut.Entity = world.getEntityByName("TitleCanvas");
				this.linkCanvas(world, canvasEntity);

				// Change to keyboard text.
				if (!ut.Core2D.Input.isTouchSupported()) {
					let tapEntity: ut.Entity = world.getEntityByName("Tap Text");
					let tapText: ut.Text.Text2DRenderer = world.getComponentData(tapEntity, ut.Text.Text2DRenderer);
					tapText.text = "Click to Play";
					world.setComponentData(tapEntity, tapText);
					
					let helpEntity: ut.Entity = world.getEntityByName("Help Text");
					let helpText: ut.Text.Text2DRenderer = world.getComponentData(helpEntity, ut.Text.Text2DRenderer);
					helpText.text = "Use A and D keys. Avoid the cubes!";
					world.setComponentData(helpEntity, helpText);
				}
			} else {
				ut.EntityGroup.instantiate(world, this.gameUiGroup);

				let canvasEntity: ut.Entity = world.getEntityByName("GameUICanvas");
				this.linkCanvas(world, canvasEntity);

				// Update highscore text.
				let highscoreEntity: ut.Entity = world.getEntityByName("Highscore Text");
				let highscoreText: ut.Text.Text2DRenderer = world.getComponentData(highscoreEntity, ut.Text.Text2DRenderer);
				highscoreText.text = "Best: " + this.highscore.toFixed(0);
				world.setComponentData(highscoreEntity, highscoreText);
			}

			// Initialise projection matrix.
			// Note: Aspect ratio is always 1.0 due to the camera auto scaling for some reason.
			let deg2Rad: number = Math.PI / 180.0;
			let near: number = 0.01;
			let far: number = 30.0;
			let vFOV: number = 80.0;
			let fovScale: number = 1.0 / Math.tan(deg2Rad * vFOV / 2.0);
			let clipRange: number = near - far;
			this.projMatrix = new utmath.Matrix4();
			this.projMatrix.set(
				fovScale, 0.0, 0.0, 0.0,
				0.0, fovScale, 0.0, 0.0,
				0.0, 0.0, (far + near) / clipRange, -1.0,
				0.0, 0.0, 2.0 * far * near / clipRange, 0.0);
		};

		static triggerGameOver(world: ut.World)
		{
			this.gameOver = true;
			setTimeout(() => 
			{ 
				ut.EntityGroup.instantiate(world, this.gameOverGroup);
				let canvasEntity: ut.Entity = world.getEntityByName("GameOverCanvas");
				this.linkCanvas(world, canvasEntity);

				// Change to keyboard text.
				if (!ut.Core2D.Input.isTouchSupported()) {
					let tapEntity: ut.Entity = world.getEntityByName("Tap Text");
					let tapText: ut.Text.Text2DRenderer = world.getComponentData(tapEntity, ut.Text.Text2DRenderer);
					tapText.text = "Click to Retry";
					world.setComponentData(tapEntity, tapText);
				}
			}, this.gameOverDelay);
		}

        static restart(world: ut.World, delay: number, showTitle: boolean) 
        {
			if (delay <= 0)
			{
				this.newGame(world, showTitle);
			}
			else
			{
				setTimeout(() => 
				{ 
					this.newGame(world, showTitle);
				}, delay);
			}
        };

        static newGame(world: ut.World, showTitle: boolean) 
        {
			console.log('starting new game.');
			ut.Time.reset();
			
			this.score = 0;
			this.gameOver = false;

			ut.EntityGroup.destroyAll(world, this.cubeGroup);
			ut.EntityGroup.destroyAll(world, this.titleGroup);
			ut.EntityGroup.destroyAll(world, this.gameUiGroup);
			ut.EntityGroup.destroyAll(world, this.mainGroup);
			ut.EntityGroup.destroyAll(world, this.gameOverGroup);
			world.debugCheckEntities();

			ut.EntityGroup.instantiate(world, this.mainGroup);

			this.menuVisible = showTitle;
			if (!showTitle)
			{
				this.camOffset = new Vector2(0.0, 0.0);
			}
			else
			{
				this.camOffset = new Vector2(0.0, 1.0);			
			}
		};
    }
}