namespace game {
    export class GameSystem extends ut.ComponentSystem {

        public OnUpdate(): void {
            if (GameService.gameOver || GameService.menuVisible) {
                return;
            }

            const dt = ut.Time.deltaTime();

            // Update score & highscore.
            GameService.score += GameService.cubeSpeed * dt;
            if (GameService.score > GameService.highscore) {
                GameService.highscore = GameService.score;
            }

            // Increase cube speed over time.
            GameService.cubeSpeed = GameService.cubeSpeed + dt * 0.2;
        }
    }
}