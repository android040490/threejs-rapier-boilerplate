import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import eventBus, { EventBus } from "../event/EventBus";
import { ResourcesLoading, ResourcesReady } from "../event/Resource";

interface Loaders {
  texture: THREE.TextureLoader;
  gltfModel: GLTFLoader;
}

export class ResourcesManager {
  private readonly loadingManager: THREE.LoadingManager;
  private readonly loaders: Loaders;
  private readonly eventBus: EventBus = eventBus;
  private readonly textureCache: Map<string, THREE.Texture> = new Map();
  private readonly loadingTextures: Map<
    string,
    Promise<THREE.Texture | undefined>
  > = new Map();

  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.loaders = {
      texture: new THREE.TextureLoader(this.loadingManager),
      gltfModel: new GLTFLoader(this.loadingManager),
    };

    this.listenLoadingEvents();
  }

  loadTexture(
    path: string,
    useCache: boolean = true,
  ): Promise<THREE.Texture | undefined> {
    if (this.textureCache.has(path)) {
      const texture = this.textureCache.get(path);
      return Promise.resolve(useCache ? texture : texture?.clone());
    }

    if (this.loadingTextures.has(path)) {
      return this.loadingTextures.get(path)!;
    }

    const texturePromise = new Promise<THREE.Texture | undefined>((resolve) => {
      this.loaders.texture.load(
        path,
        (texture) => {
          this.textureCache.set(path, texture);
          this.loadingTextures.delete(path);

          resolve(useCache ? texture : texture.clone());
        },
        (_: ProgressEvent) => {},
        (error) => {
          console.error("Load texture error:", error);
          this.loadingTextures.delete(path);
          resolve(undefined);
        },
      );
    });

    this.loadingTextures.set(path, texturePromise);
    return texturePromise;
  }

  loadTextures(paths: string[]): Promise<Array<THREE.Texture | undefined>> {
    return Promise.all(paths.map((path) => this.loadTexture(path)));
  }

  private listenLoadingEvents(): void {
    this.loadingManager.onLoad = () => {
      this.eventBus.emit(new ResourcesReady());
    };
    this.loadingManager.onProgress = (_: string, loaded, total) => {
      const progress = loaded / total;
      this.eventBus.emit(new ResourcesLoading(progress));
    };
  }
}
