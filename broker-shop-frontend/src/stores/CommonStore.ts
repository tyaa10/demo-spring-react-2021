import {action, makeObservable, observable} from 'mobx'

class CommonStore {

    /* наблюдаемые свойства */

    // флаг ожидания загрузки данных с сервера
    @observable loading: boolean = false
    // текст ошибки, если он получен с сервера
    @observable error: string = ''
    // основа URL REST API для запросов
    @observable basename: string = 'http://localhost:8090/shop/api'
    @observable authBasename: string = 'http://localhost:8090/shop'

    constructor () {
        makeObservable(this)
    }

    /* действия, которые могут менять значения наблюдаемых свойств */

    // установка значения для флага ожидания загрузки
    @action setLoading (loading: boolean): void {
        this.loading = loading
    }

    @action setError (error: string): void {
        this.error = error
    }

    @action clearError (): void {
        this.error = ''
    }
}
// делаем доступным для импорта из текущего модуля
// сам тип хранилища CommonStore
export {CommonStore}
// делаем доступным для импорта из текущего модуля по умолчанию
// экземпляр общего хранилища типа CommonStore
export default new CommonStore()