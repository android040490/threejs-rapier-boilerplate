import * as THREE from "three";
import { Game } from "./core/Game";
import { Entity } from "./core/models/Entity";
import { RenderComponent } from "./core/components/RenderComponent";
import { RenderSystem } from "./core/systems/RenderSystem";
import { PositionComponent } from "./core/components/PositionComponent";

const game = new Game(
  document.querySelector("canvas.webgl") as HTMLCanvasElement,
);

game.addSystem(RenderSystem);
game.start();

const exampleMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1),
  new THREE.MeshBasicMaterial(),
);
const exampleEntity = new Entity();
exampleEntity.addComponent(new RenderComponent(exampleMesh));
exampleEntity.addComponent(new PositionComponent(new THREE.Vector3(1, 1, 1)));
game.entityManager.addEntity(exampleEntity);
