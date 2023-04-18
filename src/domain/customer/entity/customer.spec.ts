import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("","John");
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123","");
        }).toThrowError("Name is required");
    });

    it("should change name", () => {

        //Arrange
        const customer = new Customer("123","John");

        // Act
        customer.changeName("Jane");

        // Assert
        expect(customer.name).toBe("Jane");    


    });

    it("should active customer", () => {

        //Arrange
        const customer = new Customer("123","John");
        const address = new Address("Street1", 123, "78013-665", "Campo Grande - MS");
        customer._address = address;

        // Act
        customer.activate();

        // Assert
        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () => {

        //Arrange
        const customer = new Customer("123","John");
        
        // Act
        customer.deactivate();

        // Assert
        expect(customer.isActive()).toBe(false);
    });

    it("should error when address is undefined when you activate a customer", () => {

                
        expect(() => {
            const customer = new Customer("123","John");        
             customer.activate();
        }).toThrowError("Address is mandaory to activate a costumer");
    });

    it("should add reward points", () => {        
        const customer = new Customer("123","John");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoint(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoint(10);
        expect(customer.rewardPoints).toBe(20);
    });

});