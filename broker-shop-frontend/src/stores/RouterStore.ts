import {action, makeObservable, observable, reaction} from 'mobx'
import history from "../history"
import RouteModel from "../models/RouteModel";
import userStore from "./UserStore"
import Home from "../components/pages/Home";
import About from "../components/pages/About";
import Shopping from "../components/pages/Shopping";
import SignIn from "../components/pages/SignIn";
import SignUp from "../components/pages/SignUp";

class RouterStore {

    // список моделей роутов для гостя
    private anonymousRoutes: Array<RouteModel> = [
        { path: '/', name: 'Home', Component: Home },
        { path: '/shopping', name: 'Shopping', Component: Shopping },
        { path: '/about', name: 'About', Component: About },
        { path: '/signin', name: 'Log In', Component: SignIn },
        { path: '/signup', name: 'Registration', Component: SignUp }
    ]

    // список моделей роутов для аунтентифицированного пользователя
    private loggedRoutes: Array<RouteModel> = [
        { path: '/', name: 'Home', Component: Home },
        { path: '/shopping', name: 'Shopping', Component: Shopping },
        { path: '/about', name: 'About', Component: About },
        { path: '/auth:out', name: 'Log Out', Component: Home }
    ]

    // наблюдаемый текущий список роутов
    // (по умолчнию - для гостя)
    @observable routes: Array<RouteModel> = this.anonymousRoutes

    constructor() {
        makeObservable(this)
    }

    // установить в качестве текущего список роутов для гостя
    @action setAnonymousRoutes() {
        this.routes = this.anonymousRoutes
    }

    // установить в качестве текущего список роутов для аунтентифицированного пользователя
    @action setLoggedRoutes() {
        this.routes = this.loggedRoutes
    }

    // реакция на изменение значения наблюдаемого свойства userStore.user:
    // если userStore.user установлен,
    // в текущем списке моделей роутов ищем
    // модель, в свойстве name которой содержится подстрока 'Sign out'
    userReaction = reaction(
        () => userStore.user,
        (user) => {
            if (user) {
                // поиск модели маршрута выхода из учетной записи
                const signOutRoute =
                    this.loggedRoutes
                        .find(route => route['path'].includes('/auth:out'))
                // в модель роута "Выход" в свойство name
                // записываем текст: Sign out + ИМЯ_ПОЛЬЗОВАТЕЛЯ,
                // где ИМЯ_ПОЛЬЗОВАТЕЛЯ узнаем из наблюдаемого свойства userStore.user
                if (signOutRoute) {
                    signOutRoute['name'] = `Log Out (${user.name})`
                }
                // ... и меняем текущий список моделей роутов
                // - на список моделей роутов для вошедшего пользователя
                this.setLoggedRoutes()
                // выполняем переход на раздел 'Главная'
                history.replace('/')
            } else {
                // если пользователь не установлен -
                // меняем текущий список моделей роутов
                // на список моделей роутов для пользователя-гостя
                this.setAnonymousRoutes()
                // выполняем переход на раздел 'Вход'
                history.replace('/signin')
            }
        }
    )
}

export {RouterStore}
export default new RouterStore()