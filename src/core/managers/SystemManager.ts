import { EntityAdded } from "../event/EntityAdded";
import { EntityRemoved } from "../event/EntityRemoved";
import eventBus, { EventBus } from "../event/EventBus";
import { System } from "../models/System";

export class SystemManager {
  private readonly eventBus: EventBus;
  private systems: System[];

  constructor() {
    this.systems = [];

    this.eventBus = eventBus;

    this.setListeners();
  }

  addSystem(system: System) {
    this.systems.push(system);
  }

  update() {
    for (const system of this.systems) {
      if (system.enabled) {
        system.update();
      }
    }
  }

  private setListeners(): void {
    this.eventBus.on(EntityAdded, (event: EntityAdded) => {
      for (const system of this.systems) {
        if (system.appliesTo(event.entity)) {
          system.addEntity(event.entity);
        }
      }
    });
    this.eventBus.on(EntityRemoved, (event: EntityRemoved) => {
      for (const system of this.systems) {
        if (system.appliesTo(event.entity)) {
          system.removeEntity(event.entity);
        }
      }
    });
  }
}
