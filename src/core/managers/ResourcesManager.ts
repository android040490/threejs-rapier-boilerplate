import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import eventBus, { EventBus } from "./EventBus";

export enum ResourcesEvent {
  Ready = "resources:ready",
  LoadingProgress = "resources:loading-progress",
}

interface Loaders {
  texture: THREE.TextureLoader;
  gltfModel: GLTFLoader;
}

export class ResourcesManager {
  private readonly loadingManager: THREE.LoadingManager;
  private readonly loaders: Loaders;
  private readonly eventBus: EventBus = eventBus;

  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.loaders = {
      texture: new THREE.TextureLoader(this.loadingManager),
      gltfModel: new GLTFLoader(this.loadingManager),
    };

    this.listenLoadingEvents();
  }

  loadTexture(path: string): Promise<THREE.Texture | undefined> {
    return new Promise((resolve) => {
      // TODO: consider caching if necessary
      this.loaders.texture.load(
        path,
        (file) => {
          resolve(file);
        },
        (_: ProgressEvent) => {},
        (error: any) => {
          console.error("Load texture error:", error);
          resolve(undefined);
        },
      );
    });
  }

  loadTextures(paths: string[]): Promise<Array<THREE.Texture | undefined>> {
    return Promise.all(paths.map((path) => this.loadTexture(path)));
  }

  private listenLoadingEvents(): void {
    this.loadingManager.onLoad = () => {
      this.eventBus.emit(ResourcesEvent.Ready);
    };
    this.loadingManager.onProgress = (_: string, loaded, total) => {
      const progress = loaded / total;
      this.eventBus.emit(ResourcesEvent.LoadingProgress, progress);
    };
  }
}
