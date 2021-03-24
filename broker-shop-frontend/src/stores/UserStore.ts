import {action, makeObservable, observable} from "mobx"
import User from '../models/UserModel'
import commonStore from './CommonStore'
import history from "../history";

class UserStore {

    readonly HTTP_STATUS_OK: number = 200

    // current user
    @observable user: User | null = null
    // username input
    @observable userName: string = ''
    // password input
    @observable password: string = ''

    constructor() {
        makeObservable(this)
        // установка слежения за адресной строкой
        history.listen((location) => {
            // если содержимое адресной строки изменилось
            // console.log(`You changed the page to: ${location.pathname}`)
            // если адресная строка включет подстроку "/auth:out",
            // указывающую, что происходит переход по маршруту "Выход из учетной записи"
            if (location.pathname.includes("/auth:out")) {
                // в текущем модуле хранилища вызываем действие выхода
                this.logout()
            }
        })
    }

    @action setUser(user: User | null) {
        this.user = user
    }

    @action setUserName(userName: string) {
        this.userName = userName
    }

    @action setPassword(password: string) {
        this.password = password
    }

    @action reset() {
        this.userName = ''
        this.password = ''
    }

    // запрос на конечную точку рест-контроллера аутентификации
    // для проверки наличия веб-сеанса
    // и для получения сведений о текущем пользователе
    @action check () {
        // сброс текста возможной предыдущей ошибки
        commonStore.clearError()
        // включение анимации ожидания
        commonStore.setLoading(true)

        fetch(`${commonStore.basename}/auth/users/check`, {
            credentials: 'include'
        }).then((response) => {
            // из полученного отклика сервера извлечь тело - json-string,
            // преобразовать в json-object
            // и передать для дальнейшей обработки
            return response.json()
        }).then((response) => {
            // если объект отклика сервера получен
            if (response) {
                if (response.status === 'success') {
                    if (response.data) {
                        this.user = new User(response.data.name, response.data.roleName)
                    }
                } else if (response.status === 'fail') {
                    // установка в переменную хранилища сообщения об ошибке
                    commonStore.setError(response.message)
                }
            }
        }).catch((error) => {
            // установка в переменную хранилища сообщения об ошибке
            commonStore.setError(error.message)
            // перевыброс объекта аргументов исключения
            throw error
        }).finally(action(() => {
            // отключение анимации ожидания
            commonStore.setLoading(false)
        }))
    }

    @action login () {
        // сброс текста возможной предыдущей ошибки
        commonStore.clearError()
        // включение анимации ожидания
        commonStore.setLoading(true)
        // запрос на стандартную конечную точку /login
        // Spring Security Web API
        // с передачей имени и пароля пользователя для входа в учетную запись
        fetch(`${commonStore.authBasename}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'include',
            body: `username=${this.userName}&password=${this.password}`
        }).then((response) => {
            // из полученного отклика сервера извлечь код статуса
            // и передать для дальнейшей обработки
            return response.status
        }).then((statusCode) => {
            // если в объекте отклика код статуса равен 200
            if (statusCode === this.HTTP_STATUS_OK) {
                this.check()
            } else {
                commonStore.setError("Login or password is wrong")
            }
        }).catch((error) => {
            // установка в переменную хранилища сообщения об ошибке
            commonStore.setError(error.message)
            // перевыброс объекта аргументов исключения
            throw error
        }).finally(action(() => {
            // отключение анимации ожидания
            commonStore.setLoading(false)
        }))
    }

    @action logout () {
        commonStore.setLoading(true)
        fetch(`${commonStore.authBasename}/logout`, {
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response) {
                if (response.status === 'success') {
                    // если выход произошел успешно - знуляем наблюдаемое свойство user
                    this.setUser(null)
                } else if (response.status === 'fail') {
                    commonStore.setError(response.message)
                }
            }
        }).catch((error) => {
            commonStore.setError(error.message)
            throw error
        }).finally(action(() => {
            commonStore.setLoading(false)
        }))
    }

    @action register () {
        // сброс текста возможной предыдущей ошибки
        commonStore.clearError()
        // включение анимации ожидания
        commonStore.setLoading(true)
        // запрос на пользовательскую конечную точку /api/auth/user
        // REST-контроллера AuthController
        // с передачей имени и пароля пользователя для регистрации
        fetch(`${commonStore.basename}/auth/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({'name': this.userName, 'password': this.password})
        }).then((response) => {
            // из полученного отклика сервера извлечь тело (json-строку)
            // и передать для дальнейшей обработки
            return response.json()
        }).then((response) => {
            // если в объекте отклика статус равен 'success'
            if (response.status === 'success') {
                this.login()
            } else {
                commonStore.setError(response.message)
            }
        }).catch((error) => {
            // установка в переменную хранилища сообщения об ошибке
            commonStore.setError(error.message)
            // перевыброс объекта аргументов исключения
            throw error
        }).finally(action(() => {
            // отключение анимации ожидания
            commonStore.setLoading(false)
        }))
    }
}
export {UserStore}
export default new UserStore()