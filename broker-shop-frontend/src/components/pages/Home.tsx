import React/*, { Component }*/ from 'react'
// import {RouteComponentProps} from "react-router-dom"

/* class Home extends Component {
    render () {
        return (
            <div>
                <h1>Home Page</h1>
            </div>
        )
    }
} */

/* interface MatchParams {
    payment_success: string,
    payment_cancel: string
} */
interface IProps {
    // здесь перечисляются все внешние параметры (свойства),
    // переданные явно из объекта родительского компонента
}
/* interface IInjectedProps extends IProps, RouteComponentProps<MatchParams> {

} */
function Home (props: IProps) {
    // const injected = props as IInjectedProps
    console.log('props', props)
    return (
        <div>
            <h1>Home Page</h1>
        </div>
    )
}

export default Home