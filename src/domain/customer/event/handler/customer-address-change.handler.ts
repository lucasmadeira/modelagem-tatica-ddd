
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed-event";

export default class CustomerAddressChangedHandler implements EventHandlerInterface<CustomerAddressChangedEvent>{
    handle(event: CustomerAddressChangedEvent): void {
        console.log("Endereço do cliente:"+ event.eventData._id+
        ", "+ event.eventData.name+ " alterado para: " + event.eventData.address);
     }
}