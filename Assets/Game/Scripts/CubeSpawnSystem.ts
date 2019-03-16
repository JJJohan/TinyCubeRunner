
namespace game 
{
    /** New System */
    export class CubeSpawnSystem extends ut.ComponentSystem 
	{
		vertices: Vector2[] = [new Vector2(0.0, 0.0), new Vector2(0.0, 0.0), new Vector2(0.0, 0.0), new Vector2(0.0, 0.0)];
		indices: number[] = [0, 1, 2, 2, 3, 0];
							
		static frontColour: ut.Core2D.Color = new ut.Core2D.Color(1.0, 0.9, 0.2, 1.0);
		static sideColour: ut.Core2D.Color = new ut.Core2D.Color(1.0, 0.8, 0.5, 1.0);
		static topColour: ut.Core2D.Color = new ut.Core2D.Color(1.0, 0.6, 0.3, 1.0);

        OnUpdate():void 
		{
			this.world.forEach([ut.Entity, game.CubeSpawner], (entity, spawner) => 
			{
				if (GameService.gameOver) {
					this.world.destroyEntity(entity);
					return;
				}

				let cube: ut.Entity = ut.EntityGroup.instantiate(this.world, "game.CubeGroup")[0];

				let cubeData: game.CubeData = this.world.getComponentData(cube, game.CubeData);
				cubeData.startX = spawner.startX;

				let newPos: Vector3 = new Vector3(spawner.startX, 0.0, cubeData.startDistance);			
				let position: ut.Core2D.TransformLocalPosition = new ut.Core2D.TransformLocalPosition(newPos);
				this.world.addComponentData(cube,position);
				console.log('Spawned a cube at X - ' + spawner.startX);	

				let i: number;
				const visibleFaces: number = 4;
				for (i = 0; i < visibleFaces; i++)
				{
					let cubeFace: ut.Entity = this.world.createEntity();				
					this.world.addComponentData(cubeFace, new ut.Core2D.TransformNode(cube));

					let zDepth: number;
					const cubeScale: number = 0.25;

					// Small hack for correct depth ordering based on height.						
					let sideDepth: number;
					let topDepth: number;
					if (GameService.menuVisible)
					{
						sideDepth = 0.0;
						topDepth = -cubeScale * 0.5;
					}
					else
					{
						sideDepth = -cubeScale * 0.5;
						topDepth = 0.0;
					}

					let faceData: game.CubeFaceData = new game.CubeFaceData();
					let faceColour: ut.Core2D.Color;
					if (i == 0) // Front
					{
						faceData.vertices = [new Vector3(-cubeScale, -cubeScale, 0.0), new Vector3(-cubeScale, cubeScale, 0.0), new Vector3(cubeScale, cubeScale, 0.0), new Vector3(cubeScale, -cubeScale, 0.0)];
						faceColour = CubeSpawnSystem.frontColour;
						zDepth = -cubeScale;
					}
					else if (i == 1) // Left
					{
						faceData.vertices = [new Vector3(-cubeScale, -cubeScale, cubeScale * 4.0), new Vector3(-cubeScale, cubeScale, cubeScale * 4.0), new Vector3(-cubeScale, cubeScale, 0.0), new Vector3(-cubeScale, -cubeScale, 0.0)];
						faceColour = CubeSpawnSystem.sideColour;
						zDepth = sideDepth;
					}
					else if (i == 2) // Top
					{
						faceData.vertices = [new Vector3(-cubeScale, -cubeScale, 0.0), new Vector3(-cubeScale, -cubeScale, cubeScale * 4.0), new Vector3(cubeScale, -cubeScale, cubeScale * 4.0), new Vector3(cubeScale, -cubeScale, 0.0)];
						faceColour = CubeSpawnSystem.topColour;
						zDepth = topDepth;
					}
					else if (i == 3) // Right
					{
						faceData.vertices = [new Vector3(cubeScale, -cubeScale, 0.0), new Vector3(cubeScale, cubeScale, 0.0), new Vector3(cubeScale, cubeScale, cubeScale * 4.0), new Vector3(cubeScale, -cubeScale, cubeScale * 4.0)];
						faceColour = CubeSpawnSystem.sideColour;
						zDepth = sideDepth;
					}
					faceData.startColour = faceColour;
					this.world.addComponentData(cubeFace, faceData);
					this.world.setComponentData(cube, cubeData);
											
					let facePos: Vector3 = new Vector3(0.0, 0.0, zDepth);
					this.world.addComponentData(cubeFace, new ut.Core2D.TransformLocalPosition(facePos));	
					this.world.addComponentData(cubeFace, new ut.Core2D.Shape2D(this.vertices, this.indices));
					this.world.addComponentData(cubeFace, new ut.Core2D.Shape2DRenderer(cubeFace, faceColour));
				}

				this.world.destroyEntity(entity);
			});
        }
    }
}
