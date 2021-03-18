export default class CategoryModel {
    public id: BigInteger
    public name: string
    constructor (id: BigInteger, name: string) {
        this.id = id
        this.name = name
    }
}