namespace game {
    export class CubeSpawnSystem extends ut.ComponentSystem {

        public static frontColour: ut.Core2D.Color = new ut.Core2D.Color(1.0, 0.9, 0.2, 1.0);
        public static sideColour: ut.Core2D.Color = new ut.Core2D.Color(1.0, 0.8, 0.5, 1.0);
        public static topColour: ut.Core2D.Color = new ut.Core2D.Color(1.0, 0.6, 0.3, 1.0);
        public static spawnExists: boolean = false;
        public static cubeLength: number = 5.0;
        public static cubeWidth: number = 0.25;
        private vertices: Vector2[] = [new Vector2(0.0, 0.0), new Vector2(0.0, 0.0), new Vector2(0.0, 0.0), new Vector2(0.0, 0.0)];
        private indices: number[] = [0, 1, 2, 2, 3, 0];

        public OnUpdate(): void {
            if (GameService.gameOver) {
                return;
            }

            const dt = ut.Time.deltaTime();

            this.world.forEach([ut.Entity, game.CubeSpawner], (entity, spawner) => {
                if (spawner.linesLoaded === spawner.pattern.lines.length) {
                    ut.Core2D.TransformService.destroyTree(this.world, entity);
                    CubeSpawnSystem.spawnExists = false;
                    return;
                }

                const timeToMove: number = CubeSpawnSystem.cubeLength / GameService.cubeSpeed;

                spawner.spawnTimer += dt;
                if (spawner.spawnTimer < timeToMove) {
                    return;
                }
                spawner.spawnTimer -= timeToMove;

                // Account for extra distance between last update to (mostly) prevent gaps.
                const distanceGap: number = spawner.spawnTimer * GameService.cubeSpeed;

                const patternLine: string = spawner.pattern.lines[spawner.linesLoaded++];
                for (let i = 0; i < 10; ++i) {
                    // Spawn a cube on an 'x', otherwise create a gap.
                    if (patternLine[i] !== "x") {
                        continue;
                    }

                    const cube: ut.Entity = ut.EntityGroup.instantiate(this.world, "game.CubeGroup")[0];

                    const cubeData: game.CubeData = this.world.getComponentData(cube, game.CubeData);
                    const cubePos: Vector3 = new Vector3(-9.0 * CubeSpawnSystem.cubeWidth + i * CubeSpawnSystem.cubeWidth * 2.0, 0.0, cubeData.startDistance - distanceGap);
                    cubeData.startX = cubePos.x;
                    cubeData.posX = cubePos.x;
                    cubeData.posY = 0.0;
                    cubeData.posZ = cubePos.z;
                    this.world.setComponentData(cube, cubeData);

                    this.world.setComponentData(cube, new ut.Core2D.TransformLocalPosition(new Vector3(0.0, 0.0, cubeData.posZ)));

                    // Only create 4 faces - we don't care about the back or bottom faces.
                    const visibleFaces: number = 4;
                    for (let j = 0; j < visibleFaces; j++) {
                        const cubeFace: ut.Entity = ut.EntityGroup.instantiate(this.world, "game.CubeFaceGroup")[0];
                        this.world.setComponentData(cubeFace, new ut.Core2D.TransformNode(cube));

                        let zDepth: number;

                        // Small hack for correct depth ordering based on height.
                        let sideDepth: number;
                        let topDepth: number;
                        if (GameService.menuVisible) {
                            sideDepth = 0.0;
                            topDepth = -CubeSpawnSystem.cubeWidth * 0.5;
                        } else {
                            sideDepth = -CubeSpawnSystem.cubeWidth * 0.5;
                            topDepth = 0.0;
                        }

                        const faceData: game.CubeFaceData = new game.CubeFaceData();
                        let faceColour: ut.Core2D.Color;
                        if (j === 0) { // front
                            faceData.vertices = [new Vector3(-CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, 0.0), new Vector3(-CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeWidth, 0.0), new Vector3(CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeWidth, 0.0), new Vector3(CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, 0.0)];
                            faceColour = CubeSpawnSystem.frontColour;
                            zDepth = -CubeSpawnSystem.cubeWidth;
                        } else if (j === 1) { // left
                            faceData.vertices = [new Vector3(-CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeLength), new Vector3(-CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeLength), new Vector3(-CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeWidth, 0.0), new Vector3(-CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, 0.0)];
                            faceColour = CubeSpawnSystem.sideColour;
                            zDepth = sideDepth;
                        } else if (j === 2) { // top
                            faceData.vertices = [new Vector3(-CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, 0.0), new Vector3(-CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeLength), new Vector3(CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeLength), new Vector3(CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, 0.0)];
                            faceColour = CubeSpawnSystem.topColour;
                            zDepth = topDepth;
                        } else if (j === 3) { // right
                            faceData.vertices = [new Vector3(CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, 0.0), new Vector3(CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeWidth, 0.0), new Vector3(CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeLength), new Vector3(CubeSpawnSystem.cubeWidth, -CubeSpawnSystem.cubeWidth, CubeSpawnSystem.cubeLength)];
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
                }
            });
        }
    }
}
