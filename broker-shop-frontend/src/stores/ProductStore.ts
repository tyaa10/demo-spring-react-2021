import {action, makeObservable, observable} from 'mobx'
import history from "../history";
import Product from '../models/ProductModel'
import commonStore from './CommonStore'

class ProductStore {

    private HTTP_STATUS_OK: number = 200
    private HTTP_STATUS_CREATED: number = 201
    private HTTP_STATUS_NO_CONTENT: number = 204

    private allowGetPriceBounds: boolean = true
    private allowGetQuantityBounds: boolean = true

    @observable currentProductId: number | null = null
    @observable products: Array<Product> = []
    @observable title: string = ''
    @observable description: string = ''
    @observable quantity: number = 0
    @observable price: number = 0
    @observable categoryId: number | null = null
    @observable currentProductImage: string = ''
    // для фильтра и сортировки
    @observable orderBy: string = 'id'
    @observable sortingDirection: string = 'DESC'
    @observable categories: number[] = []
    @observable allowFetchFilteredProducts: boolean = true
    @observable priceFrom: number | null = null
    @observable priceTo: number | null = null
    @observable quantityFrom: number | null = null
    @observable quantityTo: number | null = null
    @observable priceFromBound: number = 0
    @observable priceToBound: number = 1000000
    @observable quantityFromBound: number = 0
    @observable quantityToBound: number = 1000000
    // цельная строка - значение url-параметра search
    @observable searchString: string = ''

    constructor() {
        makeObservable(this)
    }

    // сборка веб-адреса для раздела покупок из значений
    // отдельных полей состояния фильтра и установка его в адресную строку браузера
    private changeShoppingUrlParams () {
        history.push({
            pathname: '/shopping',
            search: `?orderBy=${this.orderBy}
                        &sortingDirection=${this.sortingDirection}
                        &search=
                            price>:${this.priceFrom};
                            price<:${this.priceTo};
                            quantity>:${this.quantityFrom};
                            quantity<:${this.quantityTo}
                            ${(this.categories && this.categories.length > 0) ? ';category:' + JSON.stringify(this.categories) : ''}`
                .replace(/\s/g, '')
        })
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

    // получить граничные значения цен товаров
    @action fetchProductPriceBounds() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(commonStore.basename + '/products/price-bounds')
            .then((response) => {
                return response.json()
            }).then(responseModel => {
                if (responseModel) {
                    if (responseModel.status === 'success') {
                        // сохранение минимума и максимума цены
                        // в наблюдаемых свойствах
                        this.priceFromBound = responseModel.data.min
                        this.priceToBound = responseModel.data.max
                        // если разрешено применение граничных значений цены
                        // (то есть, в данный момент не происходит ожидание ранее запрошенных значений)
                        if (this.allowGetPriceBounds) {
                            // если текущие границы на форме фильтрации не установлены -
                            if (!this.priceFrom) {
                                // устанавливаем их
                                this.priceFrom = this.priceFromBound
                            }
                            if (!this.priceTo) {
                                this.priceTo = this.priceToBound
                            }
                            // после изменения значений фильтра
                            // вызываем обновление адресной строки
                            this.changeShoppingUrlParams()
                        }
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

    @action fetchProductQuantityBounds() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(commonStore.basename + '/products/quantity-bounds')
            .then((response) => {
                return response.json()
            }).then(responseModel => {
                if (responseModel) {
                    if (responseModel.status === 'success') {
                        this.quantityFromBound = responseModel.data.min
                        this.quantityToBound = responseModel.data.max
                        if (this.allowGetQuantityBounds) {
                            if (!this.quantityFrom) {
                                this.quantityFrom = this.quantityFromBound
                            }
                            if (!this.quantityTo) {
                                this.quantityTo = this.quantityToBound
                            }
                            this.changeShoppingUrlParams()
                        }
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

    // вызываемый явно метод, когда изменилась адресная строка -
    // получение с сервера списка товаров согласно состояния фильтра
    @action getFilteredProducts () {
        commonStore.clearError()
        commonStore.setLoading(true)
        // составление строки запроса к действию контроллера,
        // возвращающему отфильтрованный отсортированный список моделей товаров
        const filteredProductsUrl =
            `${commonStore.basename}/products/filtered
                        ::orderBy:${this.orderBy}
                        ::sortingDirection:${this.sortingDirection}
                        /?search=
                            price>:${this.priceFrom};
                            price<:${this.priceTo}
                            ${(this.categories && this.categories.length > 0) ? ';category:' + JSON.stringify(this.categories) : ''}`
        // перед запросом на сервер удаляем все пробельные символы из адреса,
        // потому что описанный выше блок кода добавляет их для форматирования
        fetch(filteredProductsUrl.replace(/\s/g,''))
            .then((response) => {
                return response.json()
            }).then(responseModel => {
                if (responseModel) {
                    if (responseModel.status === 'success') {
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
    // установка параметра свободного запроса фильтрации,
    // полученного из адресной строки браузера,
    // в состояние локального хранилища
    @action setFilterDataSearchString(searchString: string) {
        this.searchString = searchString
    }
    @action setOrderBy(fieldName: string) {
        this.orderBy = fieldName
        this.changeShoppingUrlParams()
    }
    @action setSortingDirection(direction: string) {
        this.sortingDirection = direction
        this.changeShoppingUrlParams()
    }
    // получение отфильтрованных отсортированных товаров с сервера
    @action fetchFilteredProducts () {
        commonStore.clearError()
        commonStore.setLoading(true)
        // составление строки запроса к действию контроллера,
        // возвращающему отфильтрованный отсортированный список моделей товаров
        const filteredProductsUrl =
            `${commonStore.basename}/products/filtered
                ::orderBy:${this.orderBy}
                ::sortingDirection:${this.sortingDirection}
                /?search=${this.searchString}`
        // перед запросом на сервер удаляем все пробельные символы из адреса,
        // потому что описанный выше блок кода добавляет их для форматирования
        fetch(filteredProductsUrl.replace(/\s/g, ''))
            .then((response) => {
                return response.json()
            }).then(responseModel => {
                if (responseModel) {
                    if (responseModel.status === 'success') {
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
            this.setAllowFetchFilteredProducts(true)
            commonStore.setLoading(false)
        }))
    }

    // блокировка повтороного использования фильтра,
    // которую можно устанавливать,
    // когда одно использование уже начато и еще не завершилось
    @action setAllowFetchFilteredProducts(allow: boolean) {
        this.allowFetchFilteredProducts = allow
    }
    // установка содержимого списка идентификаторов категорий
    // для фильтра
    @action setFilterDataCategory(id: number, isChecked: boolean) {
        // пытаемся найти из имеющегося списка идентификаторов идентификатор категории,
        // состояние выбора которой сейчас изменилось
        const categoryId =
            this.categories.find(categoryId => categoryId === id)
        // если такого идентифкатора не было в списке,
        // и состояние переключлось в "выбран" -
        // добавляем в список
        if (!categoryId && isChecked) {
            this.categories.push(id)
            // если такой идентифкатор был в списке,
            // и состояние переключлось в "не выбран" -
            // удаляем из списка
        } else if (categoryId && !isChecked) {
            this.categories =
                this.categories.filter(categoryId => categoryId !== id)
        }
        // запрос на бэкенд для получения списка моделей товаров
        // согласно новому состоянию фильтра (набора свойств локального хранилища
        // для фильтрации)
        this.changeShoppingUrlParams()
    }

    @action setFilterDataPriceFrom(priceFrom: number) {
        this.priceFrom = priceFrom
        this.handlePriceBoundsValues()
    }

    @action setFilterDataPriceTo(priceTo: number) {
        this.priceTo = priceTo
        this.handlePriceBoundsValues()
    }

    @action setFilterDataQuantityFrom(quantityFrom: number) {
        this.quantityFrom = quantityFrom
        this.handleQuantityBoundsValues()
    }

    @action setFilterDataQuantityTo(quantityTo: number) {
        this.quantityTo = quantityTo
        this.handleQuantityBoundsValues()
    }

    // если поля границ цены состояния фильтра пустуют -
    // предоставить пользователю три секунды на ввод этих данных,
    // а затем, если границы не получены от пользоваетеля,
    // запросить их с сервера и запустить изменение адресной строки
    private handlePriceBoundsValues () {
        if (this.priceFrom && this.priceTo) {
            this.allowGetPriceBounds = false
            setTimeout(() => {
                if(this.allowGetPriceBounds) {
                    this.fetchProductPriceBounds()
                }
            }, 3500)
            this.changeShoppingUrlParams()
        } else {
            this.allowGetPriceBounds = true
            setTimeout(() => {
                if(this.allowGetPriceBounds) {
                    this.fetchProductPriceBounds()
                }
            }, 3000)
        }
    }

    private handleQuantityBoundsValues () {
        if (this.quantityFrom && this.quantityTo) {
            this.allowGetQuantityBounds = false
            setTimeout(() => {
                if(this.allowGetQuantityBounds) {
                    this.fetchProductQuantityBounds()
                }
            }, 3500)
            this.changeShoppingUrlParams()
        } else {
            this.allowGetQuantityBounds = true
            setTimeout(() => {
                if(this.allowGetQuantityBounds) {
                    this.fetchProductQuantityBounds()
                }
            }, 3000)
        }
    }
}
export {ProductStore}
export default new ProductStore()