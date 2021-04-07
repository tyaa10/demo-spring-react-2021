class OrderItemModel {
    public name: string
    public price: number
    public quantity: number
    constructor(name: string, price: number, quantity: number) {
        this.name = name
        this.price = price
        this.quantity = quantity
    }
}
export default OrderItemModel