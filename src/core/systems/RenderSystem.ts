import { System } from "../models/System";
import { Game } from "../Game";
import { Entity } from "../models/Entity";
import { Renderer } from "../managers/Renderer";
import { RenderComponent } from "../components/RenderComponent";
import { PositionComponent } from "../components/PositionComponent";

export class RenderSystem extends System {
  private readonly renderer: Renderer;

  public constructor(game: Game) {
    super(game);

    this.renderer = this.game.renderer;
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
      const { object } = entity.getComponent(RenderComponent) ?? {};

      if (position && object) {
        object.position.copy(position);
      }
    }

    this.renderer.update();
  }
}
