import Address from "../entity/address";
import Customer from "../entity/customer";
import EventDispatcher from "../event/@shared/event-dispatcher";
import CustomerAddressChangedEvent from "../event/customer/customer-address-changed-event";
import CustomerCreatedEvent from "../event/customer/customer-created-event";
import CustomerAddressChangedHandler from "../event/customer/handler/customer-address-change.handler";
import EnviaConsoleLog1Handler from "../event/customer/handler/envia-consolelog1.handler";
import EnviaConsoleLog2Handler from "../event/customer/handler/envia-consolelog2.handler";
import CustomerRepositoryInterface from "../repository/customer-repository.interface";

export default class CustomerService{

    private _repository: CustomerRepositoryInterface;
    private  _eventDispatcher: EventDispatcher;

    get getEventDispatcher(): EventDispatcher{
        return this._eventDispatcher;
    }

    constructor(repository: CustomerRepositoryInterface){
        this._repository = repository;
        this._eventDispatcher = new EventDispatcher();
        this.registerEventHandlers();
    }
    
    registerEventHandlers() {
        this._eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog1Handler());
        this._eventDispatcher.register("CustomerCreatedEvent", new EnviaConsoleLog2Handler());
        this._eventDispatcher.register("CustomerAddressChangedEvent", new CustomerAddressChangedHandler());
    }

    saveCustomer(customer:Customer): void{
          this._repository.create(customer);          
          const customerCreatedEvent = new CustomerCreatedEvent(customer);
          // Quando o notify for executado o EnviaConsoleLog1Handler 
          // e EnviaConsoleLog2Handler deve ser chamado        
          this._eventDispatcher.notify(customerCreatedEvent);
    }

    changeAdress(customer: Customer, address:Address): void{
        customer.changeAddress(address);
        this._repository.update(customer);

        const obj = { 
            _id: customer._id,
            name: customer.name,
            address: address
        };

        const customerAddresChangedEvent = new CustomerAddressChangedEvent(obj);
        // Quando o notify for executado o CustomerAddresChangedHandler deve ser chamado        
        this._eventDispatcher.notify(customerAddresChangedEvent);
    }
   
}