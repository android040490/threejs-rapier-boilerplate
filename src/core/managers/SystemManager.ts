import { System } from "../models/System";

export class SystemManager {
  private systems: System[];

  constructor() {
    this.systems = [];
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
}
