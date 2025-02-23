import * as THREE from "three";
import { Game } from "./core/Game";
import { Entity } from "./core/models/Entity";
import { PositionComponent } from "./core/components/PositionComponent";
import { PhysicsComponent } from "./core/components/PhysicsComponent";
import { RotationComponent } from "./core/components/RotationComponent";
import { MeshConfigComponent } from "./core/components/MeshConfigComponent";
import { TextureComponent } from "./core/components/TextureComponent";

const game = new Game(
  document.querySelector("canvas.webgl") as HTMLCanvasElement,
);

game.start();

const exampleEntity = new Entity();
exampleEntity.addComponent(
  new MeshConfigComponent({
    geometry: { type: "box", params: [1, 1, 1] },
    material: { type: "basic", params: [] },
  }),
);
exampleEntity.addComponent(new TextureComponent({ map: "textures/color.jpg" }));
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

floorEntity.addComponent(
  new MeshConfigComponent({
    geometry: { type: "cylinder", params: [20, 20, 0.5] },
    material: { type: "basic", params: [{ color: "#00f" }] },
  }),
);

floorEntity.addComponent(new PositionComponent(new THREE.Vector3(0, 0, 0)));
floorEntity.addComponent(
  new PhysicsComponent({
    shape: { type: "cylinder", radius: 20, height: 0.5 },
    rigidBodyType: "fixed",
  }),
);
game.entityManager.addEntity(exampleEntity);
game.entityManager.addEntity(floorEntity);
