import React from "react";

export default class RouteModel {
    public path: string
    public name: string
    public Component: (() => JSX.Element) | React.ComponentType<Readonly<any>>
    constructor (path: string, name: string, Component: (() => JSX.Element) | React.ComponentType<Readonly<any>>) {
        this.path = path
        this.name = name
        this.Component = Component
    }
}