import { Game } from "../Game";
import { Entity } from "./Entity";

export abstract class System {
  protected readonly entities: Map<string, Entity> = new Map();
  public enabled = true;

  constructor(protected readonly game: Game) {}

  public abstract appliesTo(entity: Entity): boolean;
  public abstract update(): void;
  public abstract removeEntity(entity: Entity): void;

  public addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  //   public initialize(game: Game): void {
  //     // Intentionally left empty
  //   }
}
