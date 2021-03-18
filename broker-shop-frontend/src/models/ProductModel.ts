export default class ProductModel {
    public id: BigInteger
    public title: string
    public description: string
    public quantity: number
    public price: number
    public categoryId: BigInteger
    public image: string
    constructor (id: BigInteger, title: string, description: string, quantity: number, price: number, categoryId: Uint8Array, image: string) {
        this.id = id
        this.title = title
        this.description = description
        this.quantity = quantity
        this.price = price
        this.categoryId = categoryId
        this.image = image
    }
}