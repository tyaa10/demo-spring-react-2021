import {action, makeObservable, observable} from 'mobx'
import Product from '../models/ProductModel'
import commonStore from './CommonStore'

class ProductStore {

    private HTTP_STATUS_OK: number = 200
    private HTTP_STATUS_CREATED: number = 201
    private HTTP_STATUS_NO_CONTENT: number = 204

    @observable currentProductId: number | null = null
    @observable products: Array<Product> = []
    @observable title: string = ''
    @observable description: string = ''
    @observable quantity: number = 0
    @observable price: number = 0
    @observable categoryId: number | null = null
    @observable currentProductImage: string = ''

    constructor() {
        makeObservable(this)
    }

    @action setCurrentProductId(id: number | null) {
        this.currentProductId = id
        const currentProduct =
            this.products.find(p => p.id === id)
        if (currentProduct) {
            this.setProductTitle(currentProduct.title)
            this.setProductDescription(currentProduct.description)
            this.setProductCategory(currentProduct.categoryId)
            this.setProductPrice(currentProduct.price)
            this.setProductQuantity(currentProduct.quantity)
            this.setProductImage(currentProduct.image)
        }
    }

    @action setProductTitle(title: string) {
        this.title = title
    }

    @action setProductCategory(categoryId: number) {
        this.categoryId = categoryId
    }

    @action setProductDescription(description: string) {
        this.description = description
    }

    @action setProductPrice(price: number) {
        this.price = price
    }

    @action setProductQuantity(quantity: number) {
        this.quantity = quantity
    }

    @action setProductImage(image: string) {
        this.currentProductImage = image
    }

    @action fetchProducts() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(commonStore.basename + '/products')
            .then((response) => {
                return response.json()
            }).then(responseModel => {
                if (responseModel) {
                    if (responseModel.status === 'success') {
                        // полученный объект модели может содержать
                        // свойства, значения которых закодированы из UTF-8 в ASCII,
                        // поэтому производим полное раскодирование:
                        // ts-object конвертируем в json-string (stringify),
                        // декодируем (decodeURIComponent)
                        // json-string конвертируем в  ts-object (parse)
                        this.products =
                            JSON.parse(
                                decodeURIComponent(
                                    JSON.stringify(responseModel.data)
                                        .replace(/(%2E)/ig, '%20')
                                )
                            )
                    } else if (responseModel.status === 'fail') {
                        commonStore.setError(responseModel.message)
                    }
                }
            }).catch((error) => {
                commonStore.setError(error.message)
                throw error
            }).finally(action(() => {
                commonStore.setLoading(false)
            }))
    }

    @action add() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(commonStore.basename + '/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'title': encodeURIComponent(this.title),
                'description': encodeURIComponent(this.description),
                'price': this.price,
                'quantity': this.quantity,
                'image': this.currentProductImage,
                'categoryId': this.categoryId
            })
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === this.HTTP_STATUS_CREATED) {
                    this.fetchProducts()
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }

    @action update () {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(`${commonStore.basename}/products/${this.currentProductId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'title': encodeURIComponent(this.title),
                'description': encodeURIComponent(this.description),
                'price': this.price,
                'quantity': this.quantity,
                'image': this.currentProductImage,
                'categoryId': this.categoryId
            })
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === this.HTTP_STATUS_OK) {
                    this.fetchProducts()
                    this.setProductTitle('')
                    this.setCurrentProductId(null)
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }

    @action deleteProduct() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(commonStore.basename + '/products/' + this.currentProductId,{
            method: 'DELETE'
        }).then((response) => {
            if (response.status === this.HTTP_STATUS_NO_CONTENT) {
                this.fetchProducts()
                this.setCurrentProductId(null)
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }
}
export {ProductStore}
export default new ProductStore()