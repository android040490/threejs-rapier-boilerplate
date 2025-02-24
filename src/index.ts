import * as THREE from "three";
import { Game } from "./core/Game";
import { Entity } from "./core/models/Entity";
import { PositionComponent } from "./core/components/PositionComponent";
import { PhysicsComponent } from "./core/components/PhysicsComponent";
import { RotationComponent } from "./core/components/RotationComponent";
import { MeshConfigComponent } from "./core/components/MeshConfigComponent";
import { TextureComponent } from "./core/components/TextureComponent";
import { EnvironmentComponent } from "./core/components/EnvironmentComponent";

const game = new Game(
  document.querySelector("canvas.webgl") as HTMLCanvasElement,
);

game.start();

// Environment
const environmentEntity = new Entity();
environmentEntity.addComponent(new EnvironmentComponent());
game.entityManager.addEntity(environmentEntity);

// Floor
const floorEntity = new Entity();
floorEntity.addComponent(
  new MeshConfigComponent({
    geometry: { type: "cylinder", params: [50, 50, 0.5] },
    material: { type: "standard", params: { color: "#5b4" } },
  }),
);
floorEntity.addComponent(new PositionComponent(new THREE.Vector3(0, 0, 0)));
floorEntity.addComponent(
  new PhysicsComponent({
    shape: { type: "cylinder", radius: 50, height: 0.5 },
    rigidBodyType: "fixed",
  }),
);
game.entityManager.addEntity(floorEntity);

const createExample = () => {
  const exampleEntity = new Entity();
  exampleEntity.addComponent(
    new MeshConfigComponent({
      geometry: { type: "box", params: [1, 1, 1] },
      material: { type: "standard", params: undefined },
    }),
  );
  exampleEntity.addComponent(
    new TextureComponent({
      texturePaths: {
        map: "textures/color.jpg",
        normalMap: "textures/normal.jpg",
      },
    }),
  );
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

  game.entityManager.addEntity(exampleEntity);

  setTimeout(() => {
    createExample();
  }, 1000);
};

createExample();
