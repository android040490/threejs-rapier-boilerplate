import { MeshConfigComponent } from "../components/MeshConfigComponent";
import { Game } from "../Game";
import { Entity } from "../models/Entity";
import { System } from "../models/System";
import { RenderComponent } from "../components/RenderComponent";
import { EntityManager } from "../managers/EntityManager";
import {
  MeshBuilder,
  MeshConfig,
  TextureKey,
  TextureMap,
} from "../factories/MeshBuilder";
import { ResourcesManager } from "../managers/ResourcesManager";
import { TextureComponent } from "../components/TextureComponent";

export class MeshBuilderSystem extends System {
  private readonly entityManager: EntityManager;
  private readonly meshBuilder: MeshBuilder;
  private readonly resourcesManager: ResourcesManager;

  constructor(game: Game) {
    super(game);

    this.entityManager = this.game.entityManager;
    this.resourcesManager = this.game.resourcesManager;
    this.meshBuilder = new MeshBuilder();
  }

  appliesTo(entity: Entity): boolean {
    return entity.hasComponent(MeshConfigComponent);
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);

    const { config } = entity.getComponent(MeshConfigComponent) ?? {};
    if (!config) {
      return;
    }

    this.createMesh(entity, config);
  }

  private async createMesh(entity: Entity, config: MeshConfig): Promise<void> {
    const { texturePaths } = entity.getComponent(TextureComponent) ?? {};

    if (texturePaths) {
      let textureMap: TextureMap = {};
      const textures = Object.entries(texturePaths).map(async ([key, path]) => {
        const texture = await this.resourcesManager.loadTexture(path);
        if (texture) {
          textureMap[key as TextureKey] = texture;
        }
      });
      await Promise.all(textures);

      config.material.params = [
        {
          ...config.material.params[0],
          ...textureMap,
        },
      ];
    }
    const mesh = this.meshBuilder.createMesh(config);

    this.entityManager.addComponent(entity, new RenderComponent(mesh));
  }
}
