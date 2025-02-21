import { System } from "../models/System";
import { Game } from "../Game";
import { Entity } from "../models/Entity";
import { PositionComponent } from "../components/PositionComponent";
import { PhysicsManager } from "../managers/PhysicsManager";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { TimeManager } from "../managers/TimeManager";

export class PhysicsSystem extends System {
  private readonly physicsManager: PhysicsManager;
  private readonly timeManager: TimeManager;

  public constructor(game: Game) {
    super(game);

    this.physicsManager = this.game.physicsManager;
    this.timeManager = this.game.timeManager;
  }

  appliesTo(entity: Entity): boolean {
    return entity.hasComponent(PhysicsComponent);
  }

  removeEntity(entity: Entity): void {
    this.entities.delete(entity.id);
    const { rigidBody } = entity.getComponent(PhysicsComponent) ?? {};

    if (rigidBody) {
      this.physicsManager.removeRigidBody(rigidBody);
    }
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);
    const component = entity.getComponent(PhysicsComponent);
    const { position } = entity.getComponent(PositionComponent) ?? {};
    if (component?.config) {
      const { collider, rigidBody } = this.physicsManager.createObject(
        component.config,
      );
      component.collider = collider;
      component.rigidBody = rigidBody;
    }
    if (position) {
      component?.rigidBody?.setTranslation(position, true);
    }
  }

  update(): void {
    for (const [_, entity] of this.entities) {
      const { position } = entity.getComponent(PositionComponent) ?? {};
      const { collider } = entity.getComponent(PhysicsComponent) ?? {};

      if (position && collider) {
        const newPosition = collider.translation();
        position.copy(newPosition);
      }
    }

    this.physicsManager.update(this.timeManager.delta);
  }
}
