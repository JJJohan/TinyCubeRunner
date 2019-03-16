
namespace game {
    /** New System */
    export class CubeSpawnSystem extends ut.ComponentSystem {

        public static frontColour: ut.Core2D.Color = new ut.Core2D.Color(1.0, 0.9, 0.2, 1.0);
        public static sideColour: ut.Core2D.Color = new ut.Core2D.Color(1.0, 0.8, 0.5, 1.0);
        public static topColour: ut.Core2D.Color = new ut.Core2D.Color(1.0, 0.6, 0.3, 1.0);
        public vertices: Vector2[] = [new Vector2(0.0, 0.0), new Vector2(0.0, 0.0), new Vector2(0.0, 0.0), new Vector2(0.0, 0.0)];
        public indices: number[] = [0, 1, 2, 2, 3, 0];

        public OnUpdate(): void {
            if (GameService.gameOver) {
                return;
            }

            this.world.forEach([ut.Entity, game.CubeSpawner], (entity, spawner) => {
                ut.Core2D.TransformService.destroyTree(this.world, entity);

                const cube: ut.Entity = ut.EntityGroup.instantiate(this.world, "game.CubeGroup")[0];

                const cubeData: game.CubeData = this.world.getComponentData(cube, game.CubeData);
                cubeData.startX = spawner.startX;
                this.world.setComponentData(cube, cubeData);

                const cubePos: Vector3 = new Vector3(spawner.startX, 0.0, cubeData.startDistance);
                this.world.addComponentData(cube, new ut.Core2D.TransformLocalPosition(cubePos));

                let i: number;
                const visibleFaces: number = 4;
                for (i = 0; i < visibleFaces; i++) {
                    const cubeFace: ut.Entity = ut.EntityGroup.instantiate(this.world, "game.CubeFaceGroup")[0];
                    this.world.setComponentData(cubeFace, new ut.Core2D.TransformNode(cube));

                    let zDepth: number;
                    const cubeScale: number = 0.25;

                    // Small hack for correct depth ordering based on height.
                    let sideDepth: number;
                    let topDepth: number;
                    if (GameService.menuVisible) {
                        sideDepth = 0.0;
                        topDepth = -cubeScale * 0.5;
                    } else {
                        sideDepth = -cubeScale * 0.5;
                        topDepth = 0.0;
                    }

                    const faceData: game.CubeFaceData = new game.CubeFaceData();
                    let faceColour: ut.Core2D.Color;
                    if (i == 0) {
                        faceData.vertices = [new Vector3(-cubeScale, -cubeScale, 0.0), new Vector3(-cubeScale, cubeScale, 0.0), new Vector3(cubeScale, cubeScale, 0.0), new Vector3(cubeScale, -cubeScale, 0.0)];
                        faceColour = CubeSpawnSystem.frontColour;
                        zDepth = -cubeScale;
                    } else if (i == 1) {
                        faceData.vertices = [new Vector3(-cubeScale, -cubeScale, cubeScale * 4.0), new Vector3(-cubeScale, cubeScale, cubeScale * 4.0), new Vector3(-cubeScale, cubeScale, 0.0), new Vector3(-cubeScale, -cubeScale, 0.0)];
                        faceColour = CubeSpawnSystem.sideColour;
                        zDepth = sideDepth;
                    } else if (i == 2) {
                        faceData.vertices = [new Vector3(-cubeScale, -cubeScale, 0.0), new Vector3(-cubeScale, -cubeScale, cubeScale * 4.0), new Vector3(cubeScale, -cubeScale, cubeScale * 4.0), new Vector3(cubeScale, -cubeScale, 0.0)];
                        faceColour = CubeSpawnSystem.topColour;
                        zDepth = topDepth;
                    } else if (i == 3) {
                        faceData.vertices = [new Vector3(cubeScale, -cubeScale, 0.0), new Vector3(cubeScale, cubeScale, 0.0), new Vector3(cubeScale, cubeScale, cubeScale * 4.0), new Vector3(cubeScale, -cubeScale, cubeScale * 4.0)];
                        faceColour = CubeSpawnSystem.sideColour;
                        zDepth = sideDepth;
                    }
                    faceData.startColour = faceColour;
                    this.world.setComponentData(cubeFace, faceData);

                    const facePos: Vector3 = new Vector3(0.0, 0.0, zDepth);
                    this.world.setComponentData(cubeFace, new ut.Core2D.TransformLocalPosition(facePos));
                    this.world.addComponentData(cubeFace, new ut.Core2D.Shape2D(this.vertices, this.indices));
                    this.world.addComponentData(cubeFace, new ut.Core2D.Shape2DRenderer(cubeFace, faceColour));
                }
            });
        }
    }
}
