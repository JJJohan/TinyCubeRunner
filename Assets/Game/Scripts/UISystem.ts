namespace game {
    export class UISystem extends ut.ComponentSystem {
        private titleWaveSpeed: number = 2.0;
        private titleWaveMagnitude: number = 0.25;

        public OnUpdate(): void {
            // Restart the game on tap, without the menu present.
            this.world.forEach([game.RestartOnTap], (tapToRestart) => {
                if (ut.Runtime.Input.getMouseButtonDown(0) || (ut.Runtime.Input.isTouchSupported && ut.Runtime.Input.touchCount() > 0)) {
                    GameService.restart(this.world, false);
                }
            });

            if (GameService.gameOver) {
                return;
            }

            const dt = ut.Time.deltaTime();

            // Sin-wave on the title letters.
            this.world.forEach([game.FloatingLetter, ut.Core2D.TransformLocalPosition], (tag, position) => {
                tag.offset += dt * this.titleWaveSpeed;
                const localPosition: Vector3 = position.position;
                localPosition.y = Math.sin(tag.offset) * this.titleWaveMagnitude;
                position.position = localPosition;
            });

            // Update score text.
            this.world.forEach([game.Score, ut.Text.Text2DRenderer], (score, text) => {
                text.text = "Score: " + GameService.score.toFixed(0);
            });

            // Update highscore text.
            this.world.forEach([game.Highscore, ut.Text.Text2DRenderer], (score, text) => {
                text.text = "Best: " + GameService.highscore.toFixed(0);
            });
        }
    }
}
