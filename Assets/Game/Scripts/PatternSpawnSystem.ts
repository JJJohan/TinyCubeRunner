namespace game {
    export class PatternSpawnSystem extends ut.ComponentSystem {
        
        public static loadPatterns() {
            ut.JsonUtility.loadAssetAsync("patterns", (error, data) => {
                if (error) {
                  throw new Error(error);
                }

                for (let i = 0; i < data.patterns.length; ++i) {
                    const pattern: Pattern = new Pattern();
                    const dataLines: string[] = data.patterns[i];
                    for (let j = 0; j < dataLines.length; ++j) {
                        const dataLine: string = dataLines[j];
                        if (dataLine.length !== 10) {
                            throw new Error("All pattern lines must be 10 characters long.");
                        }

                        pattern.lines.push(dataLine);
                    }

                    this.patterns.push(pattern);
                }

                this.patternsLoaded = true;
              });
        }

        private static patterns: Pattern[] = [];
        private static patternsLoaded: boolean = false;

        public OnUpdate(): void {
            if (GameService.gameOver || !PatternSpawnSystem.patternsLoaded) {
                return;
            }

            this.world.forEach([game.PatternSpawner], (spawner) => {
                let time: number = spawner.time;
                const delay: number = spawner.delay;

                time -= ut.Time.deltaTime();

                if (time <= 0) {
                    time += delay;

                    // Add a cube spawner.
                    const spawnerEntity: ut.Entity = this.world.createEntity();
                    const cubeSpawner: game.CubeSpawner = new game.CubeSpawner();
                    cubeSpawner.pattern = this.getRandomPattern();
                    this.world.addComponentData(spawnerEntity, cubeSpawner);
                }

                spawner.time = time;
            });
        }

        private getRandomPattern(): Pattern {
            const index: number = (Math.random() * (PatternSpawnSystem.patterns.length + 1));
            return PatternSpawnSystem.patterns[index];
        };
    }
}
