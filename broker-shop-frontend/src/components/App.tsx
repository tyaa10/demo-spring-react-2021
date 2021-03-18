import React from 'react'
import {CommonStore} from '../stores/CommonStore'
import {inject, observer} from 'mobx-react'

interface IProps {

}

interface IInjectedProps extends IProps {
  commonStore: CommonStore
}

interface IState {}

@inject('commonStore')
@observer
class App extends React.Component<IProps, IState> {

  get injected () {
    return this.props as IInjectedProps
  }

  componentDidMount() {
    this.injected.commonStore.setLoading(true)
    fetch('http://localhost:8090/shop/api/categories')
        .then(response => response.json())
        .then(responseBody => console.log(responseBody))
        .catch(reason => console.log(reason))
        .finally(() => this.injected.commonStore.setLoading(false))
  }

  render() {
    const waitDiv = this.injected.commonStore.loading ? <div>Wait...</div> : ''
    return (
        <div>
          {waitDiv}
        </div>
    )
  }
}

export default App
