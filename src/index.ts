import * as THREE from "three";
import { Game } from "./core/Game";
import { Entity } from "./core/models/Entity";
import { RenderComponent } from "./core/components/RenderComponent";
import { RenderSystem } from "./core/systems/RenderSystem";
import { PositionComponent } from "./core/components/PositionComponent";
import { PhysicsComponent } from "./core/components/PhysicsComponent";
import { PhysicsSystem } from "./core/systems/PhysicsSystem";

const game = new Game(
  document.querySelector("canvas.webgl") as HTMLCanvasElement,
);

game.addSystem(RenderSystem);
game.addSystem(PhysicsSystem);
game.start();

const exampleMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1),
  new THREE.MeshBasicMaterial(),
);
const exampleEntity = new Entity();
exampleEntity.addComponent(new RenderComponent(exampleMesh));
exampleEntity.addComponent(new PositionComponent(new THREE.Vector3(0, 10, 0)));
exampleEntity.addComponent(
  new PhysicsComponent({
    shape: { type: "box", sizes: { x: 1, y: 1, z: 1 } },
    density: 1,
    rigidBodyType: "dynamic",
  }),
);

const floorEntity = new Entity();
const floorMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(20, 20, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
);
floorEntity.addComponent(new RenderComponent(floorMesh));
floorEntity.addComponent(new PositionComponent(new THREE.Vector3(0, 0, 0)));
floorEntity.addComponent(
  new PhysicsComponent({
    shape: { type: "cylinder", radius: 20, height: 0.5 },
    rigidBodyType: "fixed",
  }),
);
game.entityManager.addEntity(exampleEntity);
game.entityManager.addEntity(floorEntity);
