import { System } from "../models/System";
import { Game } from "../Game";
import { Entity } from "../models/Entity";
import { Renderer } from "../managers/Renderer";
import { RenderComponent } from "../components/RenderComponent";

export class RenderSystem extends System {
  private readonly renderer: Renderer;

  public constructor(game: Game) {
    super();

    this.renderer = game.renderer;
  }

  appliesTo(entity: Entity): boolean {
    return entity.hasComponent(RenderComponent);
  }

  removeEntity(entity: Entity): void {
    this.entities.delete(entity.id);
    const component = entity.getComponent(RenderComponent);
    if (component?.object) {
      this.renderer.scene.remove(component.object);
    }
  }

  update(): void {
    for (const [_, entity] of this.entities) {
      const component = entity.getComponent(RenderComponent);
      if (component?.object?.parent === this.renderer.scene) {
        // if the object is already on the scene then skip
        continue;
      }

      if (component?.object) {
        this.renderer.scene.add(component.object);
      }
    }

    this.renderer.update();
  }
}
