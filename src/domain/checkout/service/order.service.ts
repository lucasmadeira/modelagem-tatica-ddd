import  {v4 as uuid} from "uuid";
import Customer from "../../customer/entity/customer";

import Order from "../entity/order";
import OrderItem from "../entity/order_item";

export default class OrderService{

    static placeOrder(customer:Customer, items: OrderItem[]): Order{
          const order = new Order(uuid(), customer.id, items);
          customer.addRewardPoint(order.total()/2);
          return order; 
    }

    static total(orders: Order[]):number{
        return orders.reduce((acc,order) => acc + order.total(), 0);
    }
}