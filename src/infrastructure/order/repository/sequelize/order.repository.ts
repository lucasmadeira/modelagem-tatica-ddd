
import { Sequelize, Transaction } from "sequelize";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";




export default class OrderRepository implements OrderRepositoryInterface{
    
    async create(entity: Order): Promise<void>{
        await OrderModel.create({
             id: entity.id,
             customer_id: entity.customerId,
             total: entity.total(),
             items: entity.items.map((item) => (
                { id:item.id, 
                  name:item.name,
                  price:item.price,
                  product_id:item.productId,
                  quantity: item.quantity
                })), 

        },
        { 
            include:[{model: OrderItemModel}],
        });
    }    

    async update(entity: Order,  transaction?: Transaction): Promise<void> {

 
      // Atualizar as propriedades básicas da Order
       await OrderModel.update({
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total()
        },{
            where: {id: entity.id}, transaction
        });

         // Iterar sobre cada OrderItem da Order
        entity.items.forEach(async (item) =>{         
            const orderModelItem =  await OrderItemModel.findOne({
                where: {id: item.id}, transaction
            });
    
            if(orderModelItem!==null){                
                await OrderItemModel.update({ id:item.id, 
                    name:item.name,
                    price:item.price,
                    product_id:item.productId,
                    quantity: item.quantity,
                    order_id:entity.id
                },{
                    where: {id: item.id}, transaction
                })           
            }else{               
                await  OrderItemModel.create({ id:item.id, 
                    name:item.name,
                    price:item.price,
                    product_id:item.productId,
                    quantity: item.quantity,
                    order_id:entity.id
                },{transaction})
                             
            }
        })

        // Obter todos os OrderItems associados à Order
        const existingItems = await OrderItemModel.findAll({
            where: {
            order_id: entity.id,
            },
        });

        // Iterar sobre cada OrderItem existente
        for (const item of existingItems) {
            // Se o OrderItem não estiver mais presente na Order, excluí-lo
            const isPresent = entity.items.some((i) => i.id === item.id);
            if (!isPresent) {
            await item.destroy({ transaction });
            }
        }

    }

    async find(id:string): Promise<Order>{
        let orderModel;
        try{
            orderModel = await OrderModel.findOne({
                where:{ id }, rejectOnEmpty: true, include:[{model: OrderItemModel}],
            });

        }catch(error){
            throw new Error("Order not found");
        }

        const items : OrderItem[] = orderModel.items.map(
            (item) => new OrderItem(item.id, item.name, item.price, item.product_id,item.quantity));
        const order = new Order(id,orderModel.customer_id, items);
             
       return order;     
       
    }

    async findAll(): Promise<Order[]>{
        const orderModels = await OrderModel.findAll({
           include:[{model: OrderItemModel}],
        });

        const orders = orderModels.map((orderModel) => {
            let items : OrderItem[] = orderModel.items.map(
                (item) => new OrderItem(item.id, item.name, item.price, item.product_id,item.quantity));
            let order = new Order(orderModel.id,orderModel.customer_id, items);
            
            return order;
        });

        return orders;
    }

}