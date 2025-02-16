import * as THREE from "three";
import { OrbitControls } from "three/addons/Addons.js";
import { WindowSizeManager } from "./WindowSizeManager";
import { Game } from "../Game";

export class CameraManager {
  private readonly windowSizeManager: WindowSizeManager;
  private readonly canvas: HTMLCanvasElement;
  private readonly scene: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  constructor(game: Game) {
    this.windowSizeManager = game.windowSizeManager;
    this.canvas = game.canvas;
    this.scene = game.scene;

    this.setCamera();
    this.setControls();
  }

  resize(): void {
    this._camera.aspect =
      this.windowSizeManager.windowWidth / this.windowSizeManager.windowHeight;
    this._camera.updateProjectionMatrix();
  }

  update(): void {
    this.controls.update();
  }

  dispose(): void {
    this.controls.dispose();
  }

  get camera(): THREE.Camera {
    return this._camera;
  }

  private setCamera(): void {
    this._camera = new THREE.PerspectiveCamera(
      50,
      this.windowSizeManager.windowWidth / this.windowSizeManager.windowHeight,
      0.1,
      1000,
    );

    this._camera.position.set(0, 3, 10);
    this._camera.lookAt(0, 0, 0);
    this.scene.add(this._camera);
  }

  private setControls(): void {
    this.controls = new OrbitControls(this._camera, this.canvas);
    this.controls.enableDamping = true;
  }
}
