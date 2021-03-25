import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import commonStore from './stores/CommonStore'
import routerStore from './stores/RouterStore'
import userStore from './stores/UserStore'
import categoryStore from './stores/CategoryStore'
import reportWebVitals from './reportWebVitals'
import {Provider} from "mobx-react";

const stores = {
    commonStore,
    routerStore,
    userStore,
    categoryStore
}

ReactDOM.render(
  <React.StrictMode>
    <Provider {...stores}>
        <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
