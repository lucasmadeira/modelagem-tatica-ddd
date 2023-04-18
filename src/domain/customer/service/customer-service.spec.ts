import CustomerRepositoryMock from "../../../infrastructure/customer/repository/sequelize/customer-repository-mock";
import Address from "../value-object/address";
import Customer from "../entity/customer";
import CustomerService from "./customer.service";


describe("Customer service tests", () => {  

    let customerService: CustomerService;
    let customerRepositoryMock: CustomerRepositoryMock;

    beforeEach(() => {
        customerRepositoryMock = new CustomerRepositoryMock();
        customerService = new CustomerService(customerRepositoryMock);
    });

   
    it("should notify all event handlers when customer was created", async () => {
      
        const eventHandler = customerService.getEventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        const eventHandler2 = customerService.getEventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

       
        const customer = new Customer("123","Customer 1");      
        customerRepositoryMock.create = jest.fn().mockResolvedValue(undefined);        
        const result = await customerService.saveCustomer(customer);

        expect(result).toBeUndefined();
        expect(spyEventHandler).toHaveBeenCalled(); 
        expect(spyEventHandler2).toHaveBeenCalled(); 
    }); 

    it("should notify all event handlers when customer address change", async () => {
      
        const eventHandler = customerService.getEventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        const eventHandler2 = customerService.getEventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        const eventHandler3 = customerService.getEventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]

        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
        const spyEventHandler3 = jest.spyOn(eventHandler3, "handle");

       
        const customer = new Customer("123","Customer 1");      
        customerRepositoryMock.create = jest.fn().mockResolvedValue(undefined);        
        const result = await customerService.saveCustomer(customer);
        
        expect(result).toBeUndefined();
        expect(spyEventHandler).toHaveBeenCalled(); 
        expect(spyEventHandler2).toHaveBeenCalled(); 

        //Mudando o endereco do cliente
        const address = new Address("Street 1",1, "ZipCode 1", "City 1 ");        

        customerRepositoryMock.update = jest.fn().mockResolvedValue(undefined);        
        const resultChangeAddres = await customerService.changeAdress(customer,address);
        
        expect(resultChangeAddres).toBeUndefined();
        expect(spyEventHandler3).toHaveBeenCalled(); 

    }); 


}); 