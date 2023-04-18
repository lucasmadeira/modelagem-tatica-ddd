import Address from "./domain/customer/value-object/address";

import OrderItem from "./domain/checkout/entity/order_item";
import Customer from "./domain/customer/entity/customer";
import Order from "./domain/checkout/entity/order";

let customer = new Customer("123","Lucas Madeira");
const address = new Address("rua do samburá", 88,"Campo Grande", "123");
customer._address = address;
customer.activate();

const item1 = new OrderItem("1", "Item 1", 10, "p1",1);
const item2 = new OrderItem("2", "Item 2", 15,"p2",2);
const order = new Order("1","123", [item1, item2]);