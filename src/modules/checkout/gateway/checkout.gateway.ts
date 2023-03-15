import Order from "../domain/order.entity";

export default interface CheckOutGateway {
    addOrder(order: Order): Promise<void>
    findOrder(id: string): Promise<Order | null>
}