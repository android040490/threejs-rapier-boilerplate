import * as THREE from "three";
import { Game } from "./core/Game";
import { Entity } from "./core/models/Entity";
import { RenderComponent } from "./core/components/RenderComponent";
import { PositionComponent } from "./core/components/PositionComponent";
import { PhysicsComponent } from "./core/components/PhysicsComponent";
import { RotationComponent } from "./core/components/RotationComponent";

const game = new Game(
  document.querySelector("canvas.webgl") as HTMLCanvasElement,
);

game.start();

const exampleMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1),
  new THREE.MeshBasicMaterial(),
);
const exampleEntity = new Entity();
exampleEntity.addComponent(new RenderComponent(exampleMesh));
exampleEntity.addComponent(new RotationComponent(0, 0, 1, 2));
exampleEntity.addComponent(new PositionComponent(new THREE.Vector3(0, 4, 0)));
exampleEntity.addComponent(
  new PhysicsComponent({
    shape: { type: "box", sizes: { x: 1, y: 1, z: 1 } },
    density: 1,
    rigidBodyType: "dynamic",
    restitution: 0.9,
  }),
);

const floorEntity = new Entity();
const floorMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(20, 20, 0.5),
  new THREE.MeshBasicMaterial({ color: "#00f" }),
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
