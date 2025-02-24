import * as THREE from "three";
import { System } from "../models/System";
import { Game } from "../Game";
import { Entity } from "../models/Entity";
import { Renderer } from "../managers/Renderer";
import { RenderComponent } from "../components/RenderComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";

export class RenderSystem extends System {
  private readonly renderer: Renderer;

  constructor(game: Game) {
    super(game);

    this.renderer = this.game.renderer;
  }

  appliesTo(entity: Entity): boolean {
    return entity.hasComponent(RenderComponent);
  }

  removeEntity(entity: Entity): void {
    super.removeEntity(entity);
    const { object } = entity.getComponent(RenderComponent) ?? {};
    if (object) {
      this.renderer.scene.remove(object);

      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        object.material.dispose();

        // TODO: probably add cleanup textures
        // something like this
        // for (const key in object?.material ?? {}) {
        //   const value = object?.material[key];

        //   if (value && typeof value.dispose === "function") {
        //     value.dispose();
        //   }
        // }
      }
    }
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);
    const component = entity.getComponent(RenderComponent);
    if (component?.object) {
      this.renderer.scene.add(component.object);
    }
  }

  update(): void {
    for (const [_, entity] of this.entities) {
      const { position } = entity.getComponent(PositionComponent) ?? {};
      const { rotation } = entity.getComponent(RotationComponent) ?? {};
      const { object } = entity.getComponent(RenderComponent) ?? {};

      if (position) {
        object?.position.copy(position);
      }
      if (rotation) {
        object?.rotation.setFromQuaternion(rotation);
      }
    }

    this.renderer.update();
  }
}
