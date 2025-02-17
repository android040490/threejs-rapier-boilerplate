import { v4 as uuidv4 } from "uuid";

export type Constructor<T> = new (...args: any[]) => T;

export class Entity {
  private readonly components: object[] = [];

  id: string;

  constructor() {
    this.id = uuidv4();
  }

  public getComponent<T>(type: Constructor<T>): T | undefined {
    for (const component of this.components) {
      if (component instanceof type) {
        return component;
      }
    }

    // throw "No component available, use Entity#hasComponent to check existance first.";
  }

  public addComponent(component: object): void {
    this.components.push(component);
  }

  public addComponents(...components: object[]): void {
    for (const component of components) {
      this.addComponent(component);
    }
  }

  public hasComponent(type: Constructor<any>): boolean {
    for (const component of this.components) {
      if (component instanceof type) {
        return true;
      }
    }

    return false;
  }

  public hasComponents(...types: Constructor<any>[]): boolean {
    for (const type of types) {
      if (!this.hasComponent(type)) {
        return false;
      }
    }

    return true;
  }
}
