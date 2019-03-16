
namespace game 
{
    /** New System */
    export class PatternSpawnSystem extends ut.ComponentSystem 
	{
	    OnUpdate():void 
		{

			this.world.forEach([ut.Entity, game.PatternSpawner], (entity, spawner) => 
			{
				if (GameService.gameOver) {
					this.world.destroyEntity(entity);
					return;
				}

				let time: number = spawner.time;
				let delay: number = spawner.delay;
				
				time -= ut.Time.deltaTime();

				if (time <= 0) 
				{
					time += delay;
					
					// Add a cube spawner.
					let spawnerEntity: ut.Entity = this.world.createEntity();
					let startPosX: number = getRandom(-3.5, 3.5);
					let cubeSpawner: game.CubeSpawner = new game.CubeSpawner();
					cubeSpawner.startX = startPosX;
					this.world.addComponentData(spawnerEntity, cubeSpawner);
				}

				spawner.time = time;
			});
        }
    }

	function getRandom(min, max) 
	{
		return Math.random() * (max - min) + min;
	}
}
