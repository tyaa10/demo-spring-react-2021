export default class RouteModel {
    public path: string
    public name: string
    public Component: (() => JSX.Element) | any
    constructor (path: string, name: string, Component: any) {
        this.path = path
        this.name = name
        this.Component = Component
    }
}