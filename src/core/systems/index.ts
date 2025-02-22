import { System } from "../models/System";
import { Constructor } from "../type-utils/constructor";
import { RenderSystem } from "./RenderSystem";
import { PhysicsSystem } from "./PhysicsSystem";

// The order of the systems is important because it will affect the rendering result and the behavior of the application.
export const systems: Constructor<System>[] = [PhysicsSystem, RenderSystem];
