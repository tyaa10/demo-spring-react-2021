import {action, computed, makeObservable, observable} from 'mobx'
import commonStore from './CommonStore'
import CartItemModel from "../models/CartItemModel";

class CartStore {

    private HTTP_STATUS_OK: number = 200
    private HTTP_STATUS_CREATED: number = 201

    // список всех элементов корзины покупателя
    @observable cartItems: CartItemModel[] = []
    // отображать ли корзину?
    @observable cartShown: boolean = false

    constructor() {
        makeObservable(this)
    }

    // вычисляемое свойство (пересчитывается при каждом обращении к нему
    // и при каждом изенении значения в наблюдаемых свойствах,
    // участвующих в формировании возвращаемого результата после слова return)
    // - получение количества всех товаров в корзине
    @computed get cartItemsCount () {
        return this.cartItems
            .map(cartItem => cartItem.quantity)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    }

    // получение полной суммы за все товары в корзине
    @computed get cartItemsTotalPrice () {
        return this.cartItems
            .map(cartItem => cartItem.price * cartItem.quantity)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0)
            .toFixed(2)
    }

    @action setCartVisibility (open: boolean) {
        this.cartShown = open
    }

    @action fetchCartItems () {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(`${commonStore.basename}/cart`, {
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    this.cartItems =
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

    // действие добавление товара в корзину
    // с указанием ИД товара и функции обратного вызова,
    // которую нужно вызвать после ответа сервера
    @action addToCart(productId: number, notifySuccess: () => void) {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(`${commonStore.basename}/cart/` + productId,{
            method: 'POST',
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    // запрос на получение всех элементов с сервера
                    this.fetchCartItems()
                    // уведомление пользователя об успехе
                    notifySuccess()
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

    @action subtractFromCart(productId: number, notifySuccess: () => void) {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(`${commonStore.basename}/cart/` + productId,{
            method: 'PATCH',
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    // запрос на получение всех элементов с сервера
                    this.fetchCartItems()
                    // уведомление пользователя об успехе
                    notifySuccess()
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
}
export {CartStore}
export default new CartStore()