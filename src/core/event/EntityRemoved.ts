import { Entity } from "../models/Entity";

export class EntityRemoved {
  public constructor(public readonly entity: Entity) {}
}
