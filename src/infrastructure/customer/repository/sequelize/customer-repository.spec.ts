import { Sequelize } from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";


describe("Customer repository test", () =>{

    let sequelize: Sequelize;

    beforeEach( async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();

    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async() =>{
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "ZipCode 1", "City 1 ");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id: "123"}});

        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        });
    });

    it("should update a customer", async() =>{
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "ZipCode 1", "City 1 ");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        customer.changeName("Customer 2");
        await customerRepository.update(customer);
        const customerModel = await CustomerModel.findOne({where: {id: "123"}});

        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city
        });        
    });

    it("should find a customer", async() =>{
        const customerRepository = new CustomerRepository();

        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "ZipCode 1", "City 1 ");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id: customer.id}});
        const customerResult = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(customerResult);
       
    });
    
    it("should throw an error when customer is not found", async() =>{
        const customerRepository = new CustomerRepository();

        expect(async() => customerRepository.find("12das3")).rejects.toThrow("Customer not found");
        
    });

    it("should find all customers", async() =>{
        const customerRepository = new CustomerRepository();

        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "City 1 ","ZipCode 1");
        customer.changeAddress(address);
        customer.addRewardPoint(10);
        customer.activate();

        const customer2 = new Customer("456","Customer 2");
        const address2 = new Address("Street 2",2, "City 2", "ZipCode 2");
        customer2.changeAddress(address2);
        customer2.addRewardPoint(20);
      

        await customerRepository.create(customer);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();      

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer);
        expect(customers).toContainEqual(customer2);
    });    

});