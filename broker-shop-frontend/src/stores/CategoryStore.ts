import {action, makeObservable, observable} from "mobx"
import Category from '../models/CategoryModel'
import commonStore from './CommonStore'
import CategoryModel from "../models/CategoryModel";

class CategoryStore {

    private HTTP_STATUS_OK: number = 200
    private HTTP_STATUS_CREATED: number = 201

    @observable currentCategoryId: number | null = null
    @observable categories: Array<Category> = []
    @observable name: string = ''

    constructor() {
        makeObservable(this)
    }

    @action setName(name: string) {
        this.name = name
    }

    @action setCurrentCategoryId(id: number | null) {
        this.currentCategoryId = id
        const currentCategory =
            this.categories.find((c: CategoryModel) => c.id === id)
        this.setName(currentCategory?.name || '')
    }

    @action fetchCategories() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(`${commonStore.basename}/categories`,{
            method: 'GET'
        }).then((response) => {
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
                    this.categories =
                        JSON.parse(
                            decodeURIComponent(
                                JSON.stringify(responseModel.data)
                                    .replace(/(%2E)/ig, "%20")
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
    
    @action add () {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(`${commonStore.basename}/categories`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': encodeURIComponent(this.name)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === this.HTTP_STATUS_CREATED) {
                    this.fetchCategories()
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
        fetch(`${commonStore.basename}/categories/${this.currentCategoryId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': encodeURIComponent(this.name)})
        }).then((response) => {
            return response.status
        }).then(responseStatusCode => {
            if (responseStatusCode) {
                if (responseStatusCode === this.HTTP_STATUS_OK) {
                    this.fetchCategories()
                    this.setName('')
                    this.setCurrentCategoryId(null)
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }

    @action deleteCategory() {
        commonStore.clearError()
        commonStore.setLoading(true)
        fetch(`${commonStore.basename}/categories/${this.currentCategoryId}`,{
            method: 'DELETE'
        }).then((response) => {
            return response.json()
        }).then(responseModel => {
            if (responseModel) {
                if (responseModel.status === 'success') {
                    this.fetchCategories()
                    this.setCurrentCategoryId(null)
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
export {CategoryStore}
export default new CategoryStore()