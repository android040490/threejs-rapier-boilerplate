import EventEmitter from "eventemitter3";
import { ResourcesEvent } from "./ResourcesManager";
import { SizesEvent } from "./WindowSizeManager";
import { TimeEvent } from "./TimeManager";

type EventType = ResourcesEvent | SizesEvent | TimeEvent;

export class EventBus extends EventEmitter<EventType> {
  constructor() {
    super();
  }
}

export default new EventBus();
