namespace game {
    export class CubeSystem extends ut.ComponentSystem {
        public gameOverDistance: number = 0.275;

        public OnUpdate(): void {
            if (GameService.gameOver) {
                return;
            }

            const dt: number = ut.Time.deltaTime();

            // Move cube, destroy if Z past 0.0.
            this.world.forEach([game.MoveSpeed, game.CubeData, ut.Core2D.TransformLocalPosition, ut.Entity], (speed, data, position, entity) => {
                const localPosition: Vector3 = position.position;
                localPosition.z -= speed.speed * dt;

                if (localPosition.z <= 0.0) {
                    ut.Core2D.TransformService.destroyTree(this.world, entity);
                } else {
                    localPosition.x = data.startX + GameService.camOffset.x;
                    localPosition.y = GameService.camOffset.y;
                    position.position = localPosition;
                }

                // Check for collision.
                if (!GameService.menuVisible && Math.abs(localPosition.x) <= this.gameOverDistance && Math.abs(localPosition.z) <= this.gameOverDistance) {
                    // Move all cubes back to prevent rendering over the UI.
                    this.world.forEach([game.CubeData, ut.Core2D.TransformLocalPosition, ut.Entity], (data, position, entity) => {
                        const localPosition: Vector3 = position.position;
                        localPosition.z += 10.0;
                        position.position = localPosition;
                    });

                    GameService.triggerGameOver(this.world);
                    return;
                }
            });

            // Project cube vertices and fake fade-in.
            this.world.forEach([game.CubeFaceData, ut.Core2D.Shape2D, ut.Core2D.Shape2DRenderer, ut.Core2D.TransformNode], (faceData, shape, renderer, transform) => {
                const parentTransform: ut.Core2D.TransformLocalPosition = this.world.getComponentData(transform.parent, ut.Core2D.TransformLocalPosition);
                const parentPos: Vector3 = parentTransform.position;

                const faceVertices: Vector3[] = faceData.vertices;
                const shapeVertices: Vector2[] = shape.vertices;

                let i: number;
                for (i = 0; i < 4; i++) {
                    let vert: Vector3 = new Vector3(parentPos.x + faceVertices[i].x, parentPos.y + faceVertices[i].y, parentPos.z + faceVertices[i].z);
                    vert = vert.applyMatrix4(GameService.projMatrix);
                    shapeVertices[i].x = vert.x;
                    shapeVertices[i].y = vert.y;
                }
                shape.vertices = shapeVertices;

                // Not using alpha due to blending artifacts.
                const colour: ut.Core2D.Color = faceData.startColour;
                const colourMul: number = 1.0 - Math.min(1.0, (30.0 - parentPos.z) / 5.0);
                colour.r += (1.0 - colour.r) * colourMul;
                colour.g += (1.0 - colour.g) * colourMul;
                colour.b += (1.0 - colour.b) * colourMul;
                renderer.color = colour;
            });
        }
    }
}
