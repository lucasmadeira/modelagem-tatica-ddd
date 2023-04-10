import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";


describe("Order repository test", () =>{

    let sequelize: Sequelize;

    beforeEach( async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true}
        });
        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();

    });

    afterEach(async () => {
        await sequelize.close();
    }); 

    it("should create a new order", async () =>{

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "Zipcode1","City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123","Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123","123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"],
        })

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items:[
                {
                   id: orderItem.id,
                   name: orderItem.name,
                   price: orderItem.price,
                   quantity: orderItem.quantity,
                   order_id:"123",
                   product_id: "123",     
                },
            ],
            
        });

    });


    it("should update a order when add new item", async () =>{

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "Zipcode1","City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123","Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123","123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const product2 = new Product("234","Product 2", 20);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            2
        );

        order.addItem(orderItem2);

        
        const transaction = await sequelize.transaction();  
        await orderRepository.update(order,transaction);
        await transaction.commit();


        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"],
        })

   

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items:[
                {
                   id: orderItem.id,
                   name: orderItem.name,
                   price: orderItem.price,
                   quantity: orderItem.quantity,
                   order_id:"123",
                   product_id: "123",     
                },{
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id:"123",
                    product_id: "234",     
                 }
            ],
            
        });

    });

    it("should update a order when remove an item", async () =>{

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "Zipcode1","City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123","Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );       

        const product2 = new Product("234","Product 2", 20);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            2
        );

        const order = new Order("123","123", [orderItem,orderItem2]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        order.removeItem(orderItem);

        const transaction = await sequelize.transaction();  
        await orderRepository.update(order,transaction);
        await transaction.commit();


        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"],
        })

   

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items:[
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id:"123",
                    product_id: "234",     
                 }
            ],
            
        });

    });

    it("should update a order when change customer", async () =>{

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "Zipcode1","City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123","Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123","123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);     
        
        const customer2 = new Customer("234","Customer 2");
        const address2 = new Address("Street 2",1, "Zipcode2","City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);
        order.changeCustomer(customer2.id);

        
        const transaction = await sequelize.transaction();  
        await orderRepository.update(order,transaction);
        await transaction.commit();


        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"],
        })

        

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "234",
            total: order.total(),
            items:[
                {
                   id: orderItem.id,
                   name: orderItem.name,
                   price: orderItem.price,
                   quantity: orderItem.quantity,
                   order_id:"123",
                   product_id: "123",     
                }
            ],
            
        });

    });

    it("should find a order", async() =>{
      
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "Zipcode1","City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123","Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123","123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
       
        const orderResult = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderResult);
       
    });
    
    it("should throw an error when order is not found", async() =>{
        const orderRepository = new OrderRepository();

        expect(async() => orderRepository.find("12das3")).rejects.toThrow("Order not found");
        
    });

    it("should find all orders", async() =>{
        
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123","Customer 1");
        const address = new Address("Street 1",1, "Zipcode1","City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123","Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123","123", [orderItem]);

        const customer2 = new Customer("234","Customer 2");
        const address2 = new Address("Street 2",2, "Zipcode2","City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);

        const product2 = new Product("234","Product 2", 10);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            2
        );

        const product3 = new Product("567","Product 3", 10);
        await productRepository.create(product3);

        const orderItem3 = new OrderItem(
            "3",
            product3.name,
            product3.price,
            product3.id,
            2
        );

        const order2 = new Order("234","234", [orderItem2, orderItem3]);


        const orderRepository = new OrderRepository();
        await orderRepository.create(order);     
        await orderRepository.create(order2);   

        const orders = await orderRepository.findAll();      

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order);
        expect(orders).toContainEqual(order2);
    }); 

});