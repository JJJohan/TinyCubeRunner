namespace game {
    @ut.executeAfter(ut.Shared.InputFence)
    export class InputSystem extends ut.ComponentSystem {
        public OnUpdate(): void {
            if (GameService.gameOver || GameService.menuVisible) {
                return;
            }

            const dt = ut.Time.deltaTime();

            this.world.forEach([game.MoveSpeed, game.MoveWithInput, game.Boundaries], (speed, tag, bounds) => {
                const dtSpeed = speed.speed * dt;

                if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.A)) {
                    GameService.camOffset.x -= dtSpeed;
                }
                if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.D)) {
                    GameService.camOffset.x += dtSpeed;
                }

                this.ProcessTouchInput(GameService.camOffset, dtSpeed);

                GameService.camOffset.x = Math.max(bounds.minX, Math.min(bounds.maxX, GameService.camOffset.x));
            });
        }

        public ProcessTouchInput(position: Vector2, speed): void {
            if (ut.Core2D.Input.isTouchSupported()) {
                if (ut.Core2D.Input.touchCount() > 0) {
                    const touch: ut.Core2D.Touch = ut.Core2D.Input.getTouch(0);
                    const displayInfo: ut.Core2D.DisplayInfo = this.world.getConfigData(ut.Core2D.DisplayInfo);

                    if (touch.x < displayInfo.frameWidth * 0.5) {
                        position.x -= speed;
                    } else {
                        position.x += speed;
                    }
                }
            }
        }
    }
}
