import React, {Component} from "react"
import {createStyles, Theme, withStyles} from "@material-ui/core/styles"
import {Menu, WithStyles} from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from '@material-ui/icons/Menu'

interface IProps {
    // стандартный внешний параметр,
    // в который может попасть значение,
    // указанное в разметке родительского компонента
    // между открываюим и закрывающим тегами разметки создания
    // эземпляра дочернего (данного) компонента
    children: any
}

interface IInjectedProps extends IProps, WithStyles<typeof styles> {

}

interface IState {
    // ссылка на "якорь" мобильного меню (кнопку)
    anchorEl: any
}

const styles = (theme: Theme) => createStyles({
    buttonCollapse: {
        // при ширинах экрана свыше ширины планшетов
        [theme.breakpoints.up("sm")]: {
            // скрывать мобильное меню
            display: "none"
        },
        margin: "10px",
        boxShadow: "none"
    }
})

class ButtonAppBarCollapse extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            // ссылка на "якорь" мобильного меню (кнопку),
            // изначально отсутствует,
            // что ниже интерпретируется как признак необходимости скрытия
            // списка пунктов меню
            anchorEl: null
        }
    }
    get injected () {
        // по факту все внешние параметры содержатся в this.props,
        // но для доступа к неявно переданным из них
        // this.props типизируем IInjectedProps
        return this.props as IInjectedProps
    }
    handleMenu = (event: React.MouseEvent) => {
        this.setState({ anchorEl: event.currentTarget });
    }
    handleClose = () => {
        this.setState({ anchorEl: null });
    }
    render() {
        const { classes } = this.injected
        const { anchorEl } = this.state
        // если есть ссылка на HTML-элемент "якоря" меню (кнопки) -
        // естанавливаем флаг-признак развернутости меню в значение "истина"
        const open = Boolean(anchorEl)
        return (
            <div className={classes.buttonCollapse}>
                <IconButton onClick={this.handleMenu} edge='start' color='inherit' aria-label='menu'>
                    <MenuIcon/>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    open={open}
                    onClose={this.handleClose}
                >
                    {this.props.children}
                </Menu>
            </div>
        )
    }
}
export default withStyles(styles)(ButtonAppBarCollapse)