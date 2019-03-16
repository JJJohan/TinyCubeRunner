
namespace game
{
    export class PatternSpawnSystem extends ut.ComponentSystem {
        public OnUpdate(): void
        {
            if (GameService.gameOver) {
                return;
            }

            this.world.forEach([game.PatternSpawner], (spawner) =>
            {
                let time: number = spawner.time;
                const delay: number = spawner.delay;

                time -= ut.Time.deltaTime();

                if (time <= 0)
                {
                    time += delay;

                    // Add a cube spawner.
                    const spawnerEntity: ut.Entity = this.world.createEntity();
                    const startPosX: number = getRandom(-3.5, 3.5);
                    const cubeSpawner: game.CubeSpawner = new game.CubeSpawner();
                    cubeSpawner.startX = startPosX;
                    this.world.addComponentData(spawnerEntity, cubeSpawner);
                }

                spawner.time = time;
            });
        }
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
}
