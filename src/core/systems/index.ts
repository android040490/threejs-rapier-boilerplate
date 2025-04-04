import { System } from "../models/System";
import { Constructor } from "../type-utils/constructor";
import { RenderSystem } from "./RenderSystem";
import { PhysicsSystem } from "./PhysicsSystem";
import { MeshBuilderSystem } from "./MeshBuilderSystem";
import { EnvironmentSystem } from "./EnvironmentSystem";
import { ModelSystem } from "./ModelSystem";
import { AnimationSystem } from "./AnimationSystem";

// The order of the systems is important because it will affect the rendering result and the behavior of the application.
export const systems: Constructor<System>[] = [
  EnvironmentSystem,
  ModelSystem,
  AnimationSystem,
  MeshBuilderSystem,
  PhysicsSystem,
  RenderSystem,
];
