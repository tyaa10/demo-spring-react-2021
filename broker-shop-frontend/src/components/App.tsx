import React from 'react'
import { Router, Route } from 'react-router-dom'
import history from "../history"
import {CommonStore} from '../stores/CommonStore'
import {RouterStore} from '../stores/RouterStore'
import {inject, observer} from 'mobx-react'
import {AppBar, Container, createStyles, Theme, Toolbar, Typography, withStyles, WithStyles} from "@material-ui/core";
import {CSSTransition} from "react-transition-group";
import AppBarCollapse from "./common/AppBarCollapse";

interface IProps {
  // здесь перечисляются все внешние параметры (свойства),
  // переданные явно из объекта родительского компонента
}

interface IInjectedProps extends IProps, WithStyles<typeof styles> {
  // здесь перечисляются все внешние параметры (свойства),
  // переданные неявно (например, внедрением зависимости при помощи дектораторов)
  commonStore: CommonStore,
  routerStore: RouterStore
}

interface IState {}

const styles = (theme: Theme) => createStyles({
  // объявление пользовательского класса стиля
  // (для корневого компонента разметки текущего компонента)
  root: {
    // атрибут класса стиля
    flexGrow: 1,
  },
  container: {
    maxWidth: '970px',
    '& .page' : {
      position: 'static'
    }
  },
  navBar: {
    color: '#fff',
    backgroundColor: '#ee6e73',
  },
  title: {
    flexGrow: 1,
  }
})

@inject('commonStore', 'routerStore')
@observer
class App extends React.Component<IProps, IState> {

  // геттер свойства, который подводит фактически полученные props
  // под интерфейс неявно полученных props
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

  render () {
    const {classes, routerStore} = this.injected
    return (
        <Router history={history}>
          <div className={classes.root}>
            {/* панель приложения, "приклееная" к верхней части страницы */}
            <AppBar position='sticky' className={classes.navBar}>
              <Toolbar>
                <Typography variant='h6' className={classes.title}>
                  SpringReact
                </Typography>
                {/* панель навигации */}
                <AppBarCollapse routes={routerStore.routes} />
              </Toolbar>
            </AppBar>
            {/* область для вывода экземпляра текущего раздела веб-приложения */}
            <Container maxWidth="sm" className={classes.container}>
              {this.injected.routerStore.routes.map(({ path, Component }) => (
                  <Route key={path} exact path={path}>
                    {({ match }) => (
                        <CSSTransition
                            in={match != null}
                            timeout={300}
                            classNames='page'
                            unmountOnExit
                        >
                          <div className='page'>
                            <Component />
                          </div>
                        </CSSTransition>
                    )}
                  </Route>
              ))}
            </Container>
          </div>
        </Router>
    )
  }
}

export default withStyles(styles)(App)
