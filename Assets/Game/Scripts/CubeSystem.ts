namespace game {
    export class CubeSystem extends ut.ComponentSystem {
        public OnUpdate(): void {
            if (GameService.gameOver) {
                return;
            }

            const dt: number = ut.Time.deltaTime();

            // Move cube, destroy if Z past 0.0.
            this.world.forEach([game.CubeData, ut.Core2D.TransformLocalPosition, ut.Entity], (data, position, entity) => {

                // Update positions.
                data.posZ = data.posZ - GameService.cubeSpeed * dt;
                if (data.posZ <= -CubeSpawnSystem.cubeLength) {
                    ut.Core2D.TransformService.destroyTree(this.world, entity);
                    return;
                } else {
                    data.posX = data.startX + GameService.camOffset.x;
                    data.posY = GameService.camOffset.y;
                }

                // Check for collision.
                if (!GameService.menuVisible && Math.abs(data.posX) <= CubeSpawnSystem.cubeWidth && data.posZ > -CubeSpawnSystem.cubeLength && data.posZ <= 0.0) {
                    // Destroy the cube so the UI isn't obscured - not the greatest solution, I know.
                    ut.Core2D.TransformService.destroyTree(this.world, entity);
                    GameService.triggerGameOver(this.world);
                    return;
                }

                this.world.setComponentData(entity, data);

                // Update Z position, only used for sorting.
                const localPosition: Vector3 = position.position;
                localPosition.z = data.posZ;
                position.position = localPosition;
            });

            // Project cube vertices and fake fade-in.
            this.world.forEach([game.CubeFaceData, ut.Core2D.Shape2D, ut.Core2D.Shape2DRenderer, ut.Core2D.TransformNode], (faceData, shape, renderer, transform) => {

                const cubeData: game.CubeData = this.world.getComponentData(transform.parent, game.CubeData);
                const faceVertices: Vector3[] = faceData.vertices;
                const shapeVertices: Vector2[] = shape.vertices;

                for (let i = 0; i < 4; i++) {
                    const posZ = Math.max(0.01, cubeData.posZ + faceVertices[i].z); // Don't project behind camera, weird things will happen.
                    let vert: Vector3 = new Vector3(cubeData.posX + faceVertices[i].x, cubeData.posY + faceVertices[i].y, posZ);
                    vert = vert.applyMatrix4(GameService.projMatrix);
                    shapeVertices[i].x = vert.x;
                    shapeVertices[i].y = vert.y;
                }
                shape.vertices = shapeVertices;

                // Not using alpha due to blending artifacts.
                const colour: ut.Core2D.Color = faceData.startColour;
                const colourMul: number = 1.0 - Math.min(1.0, (cubeData.startDistance - cubeData.posZ) / 5.0);
                colour.r += (1.0 - colour.r) * colourMul;
                colour.g += (1.0 - colour.g) * colourMul;
                colour.b += (1.0 - colour.b) * colourMul;
                renderer.color = colour;
            });
        }
    }
}
