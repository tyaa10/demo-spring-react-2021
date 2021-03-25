import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import {Button, createStyles, Drawer, Table, TextField, Theme, withStyles, WithStyles} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import SendIcon from "@material-ui/icons/Send";
import {CommonStore} from "../../../stores/CommonStore";
import {CategoryStore} from "../../../stores/CategoryStore";

interface IProps {}

interface IInjectedProps extends IProps, WithStyles<typeof styles> {
    commonStore: CommonStore,
    categoryStore: CategoryStore
}

interface IState {
    // флаг: отображать ли сейчас панель
    sidePanelVisibility: boolean
}

const styles = (theme: Theme) =>
    createStyles({
        title: {
            display: 'inline',
            marginRight: 15
        },
        categoriesTableColumnsHeader: {
            '& > th': {
                textAlign: 'left'
            }
        },
    })

@inject("commonStore", "categoryStore")
@observer
class DashboardCategories extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            sidePanelVisibility: false
        }
    }

    get injected () {
        return this.props as IInjectedProps
    }

    componentDidMount() {
        this.injected.categoryStore.fetchCategories()
    }

    toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        // разрешенный способ изменения свойств состояния компонента
        // (асинхронная отправка изменений только тех свойств состояния, которые указаны в аргументе)
        this.setState({sidePanelVisibility: open})
    }

    handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.categoryStore.setName(e.target.value)
    }

    // обработчик клика по элементу управления,
    // отображающему боковую панель с формой для добавления новой категории
    handleCategoryAdd = (e: React.MouseEvent) => {
        this.setState({sidePanelVisibility: true})
    }

    handleCategoryEdit = (e: React.MouseEvent, categoryId: BigInteger) => {
        this.injected.categoryStore.setCurrentCategoryId(categoryId)
        this.setState({sidePanelVisibility: true})
    }

    handleCategoryDelete = (e: React.MouseEvent, categoryId: BigInteger) => {
        this.injected.categoryStore.setCurrentCategoryId(categoryId)
        this.injected.categoryStore.deleteCategory()
    }

    handleSubmitForm = (e: React.FormEvent) => {
        // предотвращаем отправку данных формы на сервер браузером
        // и перезагрузку страницы
        e.preventDefault()
        this.setState({sidePanelVisibility: false})
        if (!this.injected.categoryStore.currentCategoryId) {
            this.injected.categoryStore.add()
        } else {
            this.injected.categoryStore.update()
        }
    }

    render () {
        const { loading } = this.injected.commonStore
        const { categories } = this.injected.categoryStore
        const { classes } = this.injected
        return <div>
            <h2 className={classes.title}>Categories</h2>
            <Button
                variant='outlined'
                disabled={loading}
                onClick={this.handleCategoryAdd}
            >
                Add
                <AddIcon/>
            </Button>
            <Drawer
                open={ this.state.sidePanelVisibility } onClose={this.toggleDrawer(false)}>
                <form>
                    <div>
                        <TextField
                            id="name"
                            label={'category name'}
                            value={this.injected.categoryStore.name}
                            onChange={this.handleCategoryNameChange}
                        />
                    </div>
                    <div>
                        <Button
                            disabled={loading}
                            onClick={this.handleSubmitForm}
                        >
                            Submit
                            <SendIcon/>
                        </Button>
                    </div>
                </form>
            </Drawer>
            <Table>
                <thead>
                <tr className={classes.categoriesTableColumnsHeader}>
                    <th data-field="id">ID</th>
                    <th data-field="name">Name</th>
                </tr>
                </thead>
                <tbody>
                {categories.map(category => {
                    return (
                        <tr>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>
                                <div>
                                    <Button
                                        onClick={(e) => {
                                            this.handleCategoryEdit(e, category.id)
                                        }}>
                                        <EditIcon/>
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            this.handleCategoryDelete(e, category.id)
                                        }}>
                                        <DeleteIcon/>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </div>
    }
}

export default withStyles(styles)(DashboardCategories)