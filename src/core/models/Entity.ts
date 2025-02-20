import { v4 as uuidv4 } from "uuid";

export type Constructor<T = object> = new (...args: any[]) => T;

export class Entity {
  private readonly components = new Map<
    Constructor["name"],
    InstanceType<Constructor>
  >();
  id: string;

  constructor() {
    this.id = uuidv4();
  }

  public getComponent<T>(componentType: Constructor<T>): T | undefined {
    return this.components.get(componentType.name) as T;
  }

  public addComponent(component: object): void {
    this.components.set(component.constructor.name, component);
  }

  public addComponents(...components: object[]): void {
    for (const component of components) {
      this.addComponent(component);
    }
  }

  public hasComponent(componentType: Constructor<any>): boolean {
    return this.components.has(componentType.name);
  }

  public hasComponents(...componentTypes: Constructor<any>[]): boolean {
    return componentTypes.every((componentType) =>
      this.hasComponent(componentType),
    );
  }
}
