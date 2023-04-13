import EventHandleInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default interface EventDispatcherInterface{
    notify(event: EventInterface): void;
    register(eventName:string, eventHandler: EventHandleInterface):void;
    unregister(eventName:string, eventHandler: EventHandleInterface):void;
    unregisterAll():void;
}