import { EntityUpdated } from "../event/EntityUpdated";
import { EntityAdded } from "../event/EntityAdded";
import { EntityRemoved } from "../event/EntityRemoved";
import eventBus, { EventBus } from "../event/EventBus";
import { Entity } from "../models/Entity";

export class EntityManager {
  private readonly entities: Map<string, Entity> = new Map();
  private readonly eventBus: EventBus;

  constructor() {
    this.eventBus = eventBus;
  }

  addEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
    this.eventBus.emit(new EntityAdded(entity));
  }

  removeEntity(entity: Entity): void {
    this.entities.delete(entity.id);
    this.eventBus.emit(new EntityRemoved(entity));
  }

  addComponent<T extends object>(entity: Entity, component: T): void {
    entity.addComponent(component);
    this.eventBus.emit(new EntityUpdated(entity));
  }
}
