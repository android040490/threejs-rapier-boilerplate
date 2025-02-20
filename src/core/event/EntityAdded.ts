import { Entity } from "../models/Entity";

export class EntityAdded {
  public constructor(public readonly entity: Entity) {}
}
