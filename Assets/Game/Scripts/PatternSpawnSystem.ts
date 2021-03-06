namespace game {
    interface IPatternData {
        lines: string[];
    }

    interface IPatternFile {
        patterns: IPatternData[];
    }

    export class PatternSpawnSystem extends ut.ComponentSystem {

        public static loadPatterns() {
            ut.JsonUtility.loadAssetAsync("patterns", (error, data) => {
                if (error) {
                  throw new Error(error);
                }

                const patternFile: IPatternFile = data;
                for (let i = 0; i < patternFile.patterns.length; ++i) {
                    const pattern: Pattern = new Pattern();
                    const dataLines: IPatternData = patternFile.patterns[i];
                    // Read from bottom to top lines - easier to create patterns that way.
                    for (let j = dataLines.lines.length - 1; j >= 0; --j) {
                        const dataLine: string = dataLines.lines[j];
                        if (dataLine.length !== 10) {
                            throw new Error("All pattern lines must be 10 characters long.");
                        }

                        pattern.lines.push(dataLine);
                    }

                    PatternSpawnSystem.patterns.push(pattern);
                }

                PatternSpawnSystem.patternsLoaded = true;
              });
        }

        private static patterns: Pattern[] = [];
        private static patternsLoaded: boolean = false;
        private lastPatternIndex: number = -1;

        public OnUpdate(): void {
            if (GameService.gameOver || !PatternSpawnSystem.patternsLoaded || CubeSpawnSystem.spawnExists) {
                return;
            }

            this.world.forEach([game.PatternSpawner], (spawner) => {
                CubeSpawnSystem.spawnExists = true;

                // Add a cube spawner.
                const spawnerEntity: ut.Entity = ut.EntityGroup.instantiate(this.world, "game.CubeSpawnerGroup")[0];
                const cubeSpawner: game.CubeSpawner = this.world.getComponentData(spawnerEntity, game.CubeSpawner);
                cubeSpawner.pattern = this.getRandomPattern();
                this.world.setComponentData(spawnerEntity, cubeSpawner);
            });
        }

        private getRandomPattern(): Pattern {
            let index: number = -1;
            while (index === -1 || index === this.lastPatternIndex) {
                index = Math.floor(Math.random() * PatternSpawnSystem.patterns.length);
            }

            this.lastPatternIndex = index;
            return PatternSpawnSystem.patterns[index];
        }
    }
}
