namespace game {
    export class InitSystem extends ut.ComponentSystem {
        public OnUpdate(): void {
            // Init code.
            this.world.forEach([ut.Entity, game.Init], (entity, init) => {
                GameService.init(this.world);
                this.world.destroyEntity(entity);
            });
        }
    }
}
