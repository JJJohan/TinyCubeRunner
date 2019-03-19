namespace game {
    export class GameService {
        public static gameOver: boolean;
        public static menuVisible: boolean = true;
        public static camOffset: Vector2 = new Vector2(0.0, 1.0);
        public static projMatrix: utmath.Matrix4;
        public static score: number = 0;
        public static highscore: number = 0;
        public static cubeSpeed: number;

        public static init(world: ut.World) {
            if (!this.oneTimeInit) {
                this.startup();
                this.cubeSpeed = this.startSpeed;
                this.oneTimeInit = true;
            }

            if (this.menuVisible) {
                ut.EntityGroup.instantiate(world, this.titleGroup);

                const canvasEntity: ut.Entity = world.getEntityByName("TitleCanvas");
                this.linkCanvas(world, canvasEntity);

                // Change to keyboard text.
                if (!ut.Core2D.Input.isTouchSupported()) {
                    const tapEntity: ut.Entity = world.getEntityByName("Tap Text");
                    const tapText: ut.Text.Text2DRenderer = world.getComponentData(tapEntity, ut.Text.Text2DRenderer);
                    tapText.text = "Click to Play";
                    world.setComponentData(tapEntity, tapText);

                    const helpEntity: ut.Entity = world.getEntityByName("Help Text");
                    const helpText: ut.Text.Text2DRenderer = world.getComponentData(helpEntity, ut.Text.Text2DRenderer);
                    helpText.text = "Use A and D keys. Avoid the cubes!";
                    world.setComponentData(helpEntity, helpText);
                }
            } else {
                ut.EntityGroup.instantiate(world, this.gameUiGroup);
                const canvasEntity: ut.Entity = world.getEntityByName("GameUICanvas");
                this.linkCanvas(world, canvasEntity);

                // Update highscore text.
                const highscoreEntity: ut.Entity = world.getEntityByName("Highscore Text");
                const highscoreText: ut.Text.Text2DRenderer = world.getComponentData(highscoreEntity, ut.Text.Text2DRenderer);
                highscoreText.text = "Best: " + this.highscore.toFixed(0);
                world.setComponentData(highscoreEntity, highscoreText);
            }
        }
        public static triggerGameOver(world: ut.World) {
            this.gameOver = true;
            setTimeout(() => {
                ut.EntityGroup.instantiate(world, this.gameOverGroup);
                const canvasEntity: ut.Entity = world.getEntityByName("GameOverCanvas");
                this.linkCanvas(world, canvasEntity);

                // Change to keyboard text.
                if (!ut.Core2D.Input.isTouchSupported()) {
                    const tapEntity: ut.Entity = world.getEntityByName("Tap Text");
                    const tapText: ut.Text.Text2DRenderer = world.getComponentData(tapEntity, ut.Text.Text2DRenderer);
                    tapText.text = "Click to Retry";
                    world.setComponentData(tapEntity, tapText);
                }
            }, this.gameOverDelay);
        }

        public static restart(world: ut.World, showTitle: boolean) {
            ut.Time.reset();

            this.score = 0;
            this.gameOver = false;
            this.cubeSpeed = this.startSpeed;
            CubeSpawnSystem.spawnExists = false;

            ut.EntityGroup.destroyAll(world, this.cubeGroup);
            ut.EntityGroup.destroyAll(world, this.cubeFaceGroup);
            ut.EntityGroup.destroyAll(world, this.cubeSpawnerGroup);
            ut.EntityGroup.destroyAll(world, this.titleGroup);
            ut.EntityGroup.destroyAll(world, this.gameUiGroup);
            ut.EntityGroup.destroyAll(world, this.gameOverGroup);
            ut.EntityGroup.destroyAll(world, this.mainGroup);

            ut.EntityGroup.instantiate(world, this.mainGroup);

            this.menuVisible = showTitle;
            if (!showTitle) {
                this.camOffset = new Vector2(0.0, 0.0);
            } else {
                this.camOffset = new Vector2(0.0, 1.0);
            }
        }

        private static mainGroup: string = "game.MainGroup";
        private static cubeGroup: string = "game.CubeGroup";
        private static cubeFaceGroup: string = "game.CubeFaceGroup";
        private static cubeSpawnerGroup: string = "game.CubeSpawnerGroup";
        private static titleGroup: string = "game.TitleGroup";
        private static gameUiGroup: string = "game.GameUIGroup";
        private static gameOverGroup: string = "game.GameOverGroup";
        private static gameOverDelay: number = 1000;
        private static oneTimeInit: boolean = false;
        private static startSpeed: number = 10.0;

        private static linkCanvas(world: ut.World, canvasEntity: ut.Entity) {
            const camEntity: ut.Entity = world.getEntityByName("Camera");
            const canvas: ut.UILayout.UICanvas = world.getComponentData(canvasEntity, ut.UILayout.UICanvas);
            canvas.camera = camEntity;
            world.setComponentData(canvasEntity, canvas);
        }

        private static startup() {
            // Initialise projection matrix.
            // Note: Aspect ratio is always 1.0 due to the camera auto scaling for some reason.
            const deg2Rad: number = Math.PI / 180.0;
            const near: number = 0.01;
            const far: number = 30.0;
            const vFOV: number = 80.0;
            const fovScale: number = 1.0 / Math.tan(deg2Rad * vFOV / 2.0);
            const clipRange: number = near - far;
            this.projMatrix = new utmath.Matrix4();
            this.projMatrix.set(
                fovScale, 0.0, 0.0, 0.0,
                0.0, fovScale, 0.0, 0.0,
                0.0, 0.0, (far + near) / clipRange, -1.0,
                0.0, 0.0, 2.0 * far * near / clipRange, 0.0);

            // Load cube patterns.
            PatternSpawnSystem.loadPatterns();
        }
    }
}
