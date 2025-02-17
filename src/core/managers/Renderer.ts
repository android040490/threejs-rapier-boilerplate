import * as THREE from "three";
import { WindowSizeManager } from "./WindowSizeManager";
import { CameraManager } from "./CameraManager";
import { Game } from "../Game";
import eventBus, { EventBus } from "../event/EventBus";
import { WindowResized } from "../event/WindowResized";

export default class Renderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly windowSizeManager: WindowSizeManager;
  private readonly scene: THREE.Scene;
  private readonly cameraManager: CameraManager;
  private readonly instance: THREE.WebGLRenderer;
  private readonly eventBus: EventBus;

  constructor(game: Game) {
    this.canvas = game.canvas;
    this.windowSizeManager = game.windowSizeManager;
    this.scene = game.scene;
    this.cameraManager = game.cameraManager;
    this.eventBus = eventBus;

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.init();

    this.resize = this.resize.bind(this);

    this.eventBus.on(WindowResized, this.resize);
  }

  resize(): void {
    this.instance.setSize(
      this.windowSizeManager.windowWidth,
      this.windowSizeManager.windowHeight,
    );
    this.instance.setPixelRatio(this.windowSizeManager.pixelRatio);
  }

  update(): void {
    this.instance.render(this.scene, this.cameraManager.camera);
  }

  dispose(): void {
    this.eventBus.off(WindowResized, this.resize);
    this.instance.dispose();
  }

  private init(): void {
    // this.instance.toneMapping = THREE.CineonToneMapping;
    // this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    // this.instance.setClearColor("#000011");
    this.instance.setSize(
      this.windowSizeManager.windowWidth,
      this.windowSizeManager.windowHeight,
    );
    this.instance.setPixelRatio(this.windowSizeManager.pixelRatio);
  }
}
