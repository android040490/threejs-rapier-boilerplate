import { System } from "../models/System";
import { Game } from "../Game";
import { Entity } from "../models/Entity";
import { PositionComponent } from "../components/PositionComponent";
import { PhysicsManager } from "../managers/PhysicsManager";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { TimeManager } from "../managers/TimeManager";
import { RotationComponent } from "../components/RotationComponent";

export class PhysicsSystem extends System {
  private readonly physicsManager: PhysicsManager;
  private readonly timeManager: TimeManager;

  constructor(game: Game) {
    super(game);

    this.physicsManager = this.game.physicsManager;
    this.timeManager = this.game.timeManager;
  }

  appliesTo(entity: Entity): boolean {
    return entity.hasComponent(PhysicsComponent);
  }

  removeEntity(entity: Entity): void {
    super.removeEntity(entity);
    const { rigidBody } = entity.getComponent(PhysicsComponent) ?? {};

    if (rigidBody) {
      this.physicsManager.removeRigidBody(rigidBody);
    }
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);
    const component = entity.getComponent(PhysicsComponent);
    const { position } = entity.getComponent(PositionComponent) ?? {};
    const { rotation } = entity.getComponent(RotationComponent) ?? {};
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
    if (rotation) {
      component?.rigidBody?.setRotation(rotation, true);
    }
  }

  update(): void {
    for (const [_, entity] of this.entities) {
      const { rigidBody } = entity.getComponent(PhysicsComponent) ?? {};
      const { position } = entity.getComponent(PositionComponent) ?? {};
      const { rotation } = entity.getComponent(RotationComponent) ?? {};

      if (position && rigidBody) {
        const newPosition = rigidBody.translation();
        position.copy(newPosition);
      }
      if (rotation && rigidBody) {
        const newRotation = rigidBody.rotation();
        rotation.copy(newRotation);
      }
    }

    this.physicsManager.update(this.timeManager.delta);
  }
}
