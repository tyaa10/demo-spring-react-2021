import OrderItemModel from './OrderItemModel'

class OrderModel {
    public id: string
    public items: OrderItemModel[]
    constructor(id: string, items: OrderItemModel[]) {
        this.id = id
        this.items = items
    }
}
export default OrderModel