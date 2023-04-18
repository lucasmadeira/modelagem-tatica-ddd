import EventDispatcherInterface from "./event-dispatcher.interface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface{

    private eventHandler: {[event: string]: EventHandlerInterface[]} = {};

    get getEventHandlers(): {[event: string]: EventHandlerInterface[]}{
        return this.eventHandler;
    }

    notify(event: EventInterface):void{
        const eventName = event.constructor.name;
        if(this.eventHandler[eventName]){
            this.eventHandler[eventName].forEach((eventHandler) =>{
                eventHandler.handle(event);    
            })            
        }
    }
    register(eventName: string, eventHandler: EventHandlerInterface):void{
        if(!this.eventHandler[eventName]){
            this.eventHandler[eventName] = [];
        }

        this.eventHandler[eventName].push(eventHandler);
    }
    unregister(eventName: string, eventHandler: EventHandlerInterface):void{
        if(this.eventHandler[eventName]){
            const index = this.eventHandler[eventName].indexOf(eventHandler);
            if(index !== -1){
                this.eventHandler[eventName].splice(index,1);
            }
        }


    }
    unregisterAll(): void {
        this.eventHandler = {};
    }

}