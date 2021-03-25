import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import {
    Button,
    Card,
    CardContent,
    createStyles,
    Grid,
    TextField,
    Theme,
    withStyles,
    WithStyles
} from "@material-ui/core"
import {CommonStore} from "../../stores/CommonStore";
import {UserStore} from "../../stores/UserStore";
import SendIcon from "@material-ui/icons/Send";

interface IProps {}

// типизация для свойств компонента: унаследованное свойство classes
// + расширяющие свойства commonStore и userStore
interface IInjectedProps extends IProps, WithStyles<typeof styles> {
    commonStore: CommonStore,
    userStore: UserStore
}

// типизация для состояния компонента:
// ни одного свойства состояния какого-либо типа нет
interface IState {
}

const styles = (theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        signUpGrid: {
            minHeight: '100vh'
        },
        card: {
            width: 275
        },
    })

@inject("commonStore", "userStore")
@observer
// применение типизации
class SignUp extends Component<IProps, IState> {

    get injected () {
        return this.props as IInjectedProps
    }

    componentWillUnmount() {
        this.injected.userStore.reset()
    }

    handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.userStore.setUserName(e.target.value)
    }

    handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.userStore.setPassword(e.target.value)
    }

    handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault()
        this.injected.userStore.register()
    }

    render () {
        const { loading } = this.injected.commonStore
        const { userName, password } = this.injected.userStore
        const { classes } = this.injected
        return (
            <Grid container
                  spacing={0}
                  direction='column'
                  alignContent='center'
                  justify='center'
                  className={classes.signUpGrid}
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
                            <form
                                className={classes.root}
                                noValidate
                                autoComplete="off"
                                title="Register"
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
                                        id='signUpButton'
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
// обертывание компонента в вспомогательный компонент,
// предоставляющий через props компонента
// свойство classes,
// содержащее все стили, определенные в константе styles
export default withStyles(styles)(SignUp)