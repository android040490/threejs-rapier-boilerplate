import eventBus, { EventBus } from "./EventBus";

export enum SizesEvent {
  Resize = "sizes:resize",
}

export class WindowSizeManager {
  private _width!: number;
  private _height!: number;
  private _pixelRatio!: number;
  private readonly eventBus: EventBus = eventBus;

  constructor() {
    this.setSizes();

    window.addEventListener("resize", () => {
      this.setSizes();

      this.eventBus.emit(SizesEvent.Resize);
    });
  }

  get windowWidth(): number {
    return this._width;
  }

  get windowHeight(): number {
    return this._height;
  }

  get pixelRatio(): number {
    return this._pixelRatio;
  }

  private setSizes(): void {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._pixelRatio = Math.min(window.devicePixelRatio, 2);
  }
}
