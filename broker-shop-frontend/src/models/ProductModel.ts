export default class ProductModel {
    public id: number
    public title: string
    public description: string
    public quantity: number
    public price: number
    public categoryId: number
    public image: string
    constructor (id: number, title: string, description: string, quantity: number, price: number, categoryId: number, image: string) {
        this.id = id
        this.title = title
        this.description = description
        this.quantity = quantity
        this.price = price
        this.categoryId = categoryId
        this.image = image
    }
}