import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import {Button, Card, CardContent, Grid, TextField, WithStyles, withStyles} from "@material-ui/core"
import { createStyles, Theme } from '@material-ui/core/styles'
import SendIcon from "@material-ui/icons/Send"
import {CommonStore} from "../../stores/CommonStore";
import {UserStore} from "../../stores/UserStore";
// тип CommonStore экспортируется из модуля
// не по умолчанию,
// поэтому здесь импортируется в фигурных скобках,
// и его имя должно быть указано точно так же,
// как было указано при экспорте

interface IProps {}

interface IInjectedProps extends WithStyles<typeof styles> {
    commonStore: CommonStore,
    userStore: UserStore
}

interface IState {
}

const styles = (theme: Theme) => createStyles
    ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        signInGrid: {
            minHeight: '100vh'
        },
        card: {
            width: 275
        },
    })

@inject("commonStore", "userStore")
@observer
class SignIn extends Component<IProps, IState> {

    get injected () {
        return this.props as IInjectedProps
    }

    componentWillUnmount() {
        this.injected.userStore.reset()
    }

    // обработчик события изменения значения в поле
    // ввода имени пользователя
    handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // установка свойства состояния "имя пользователя"
        // (читаем из аргументов события атрибут value поля ввода,
        // для коротого обрабатывается событие)
        this.injected.userStore.setUserName(e.target.value)
    }

    handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.userStore.setPassword(e.target.value)
    }

    handleSubmitForm = (e: React.MouseEvent) => {
        // предотвращаем отправку данных формы на сервер браузером
        // и перезагрузку страницы
        e.preventDefault()
        // вызываем в хранилище действие входа в учетную запись
        this.injected.userStore.login()
    }

    render () {
        const { loading } = this.injected.commonStore
        const { classes } = this.injected
        const {userName, password} = this.injected.userStore
        return (
            <Grid container
                  spacing={0}
                  direction='column'
                  alignContent='center'
                  justify='center'
                  className={classes.signInGrid}
            >
                <Grid item
                      xs={12}
                      sm={12}
                      md={3}
                      lg={3}
                      xl={3}
                >
                    <Card className={classes.card}>
                        <CardContent>
                            <form className={classes.root}
                                  noValidate
                                  autoComplete="off"
                                  title="Sign In"
                            >
                                <div>
                                    <TextField
                                        id='username'
                                        label='Login'
                                        value={userName}
                                        onChange={this.handleUserNameChange}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        id='password'
                                        label='Password'
                                        value={password}
                                        type="password"
                                        onChange={this.handlePasswordChange}
                                    />
                                </div>
                                <div>
                                    <Button
                                        id='signInButton'
                                        variant='outlined'
                                        disabled={loading}
                                        onClick={this.handleSubmitForm}
                                    >
                                        Submit
                                        <SendIcon/>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(SignIn)