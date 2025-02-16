import * as THREE from "three";
import Stats from "stats.js";
import { SizesEvent, WindowSizeManager } from "./managers/WindowSizeManager";
import { TimeEvent, TimeManager } from "./managers/TimeManager";
import { CameraManager } from "./managers/CameraManager";
import Renderer from "./managers/Renderer";
import { ResourcesManager } from "./managers/ResourcesManager";
import { DebugManager } from "./managers/DebugManager";
import eventBus, { EventBus } from "./managers/EventBus";

let instance: Game;

export class Game {
  public readonly canvas!: HTMLCanvasElement;
  public readonly debugManager!: DebugManager;
  public readonly windowSizeManager!: WindowSizeManager;
  public readonly timeManager!: TimeManager;
  public readonly resourcesManager!: ResourcesManager;
  public readonly cameraManager!: CameraManager;
  public readonly renderer!: Renderer;
  public readonly scene!: THREE.Scene;
  private readonly eventBus!: EventBus;

  private stats?: Stats;

  constructor() {
    if (instance) {
      return instance;
    }

    // window.experience = this;

    instance = this;
    // Options
    this.canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

    // Setup
    this.debugManager = new DebugManager();
    this.windowSizeManager = new WindowSizeManager();
    this.timeManager = new TimeManager();
    this.scene = new THREE.Scene();
    this.resourcesManager = new ResourcesManager();
    this.cameraManager = new CameraManager(this);
    this.renderer = new Renderer(this);
    this.eventBus = eventBus;

    // Sizes resize event
    this.eventBus.on(SizesEvent.Resize, () => {
      this.resize();
    });

    // Time tick event
    this.eventBus.on(TimeEvent.Tick, () => {
      this.update();
    });

    if (this.debugManager.active) {
      this.setDebug();
    }
  }

  destroy(): void {
    this.eventBus.off(SizesEvent.Resize);
    this.eventBus.off(TimeEvent.Tick);

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.cameraManager.dispose();
    this.renderer.dispose();

    if (this.debugManager.active) {
      this.debugManager.destroy();
    }
  }

  private resize(): void {
    this.cameraManager.resize();
    this.renderer.resize();
  }

  private update(): void {
    if (this.debugManager.active) {
      this.stats?.begin();
    }
    this.cameraManager.update();
    this.renderer.update();
    if (this.debugManager.active) {
      this.stats?.end();
    }
  }

  private setDebug(): void {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
  }
}

export default () => new Game();
