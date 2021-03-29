import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import Resizer from 'react-image-file-resizer'
import {reaction} from 'mobx'
import {
    Button, createStyles,
    Drawer,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TextField, Theme,
    withStyles,
    WithStyles
} from "@material-ui/core";
import {Send as SendIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon} from "@material-ui/icons"
import {CommonStore} from "../../../stores/CommonStore"
import {ProductStore} from "../../../stores/ProductStore"
import {CategoryStore} from "../../../stores/CategoryStore"
// import {promises} from "fs";
// import {SelectInputProps} from "@material-ui/core/Select/SelectInput";
import CategoryModel from "../../../models/CategoryModel";
// import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'

interface IProps {}

interface IInjectedProps extends IProps, WithStyles<typeof styles> {
    commonStore: CommonStore,
    productStore: ProductStore,
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
        productsTableColumnsHeader: {
            '& > th': {
                textAlign: 'left'
            }
        },
        formControl: {
            margin: theme.spacing(1),
            display: 'block'
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        form: {
            margin: 10
        },
        imageTextField: {
            display: 'none'
        },
        hiddenInput: {
            opacity: 0,
            height: 0
        }
    })

@inject('commonStore', 'productStore', 'categoryStore')
@observer
class DashboardProducts extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props)
        this.state = {
            sidePanelVisibility: false
        }
    }

    get injected () {
        return this.props as IInjectedProps
    }

    // прямая ссылка, которую можно нацелить на какой-либо
    // элекмент разметки,
    // и обращаться к его свойствам из логики
    // titleRef = React.createRef()

    componentDidMount() {
        this.injected.categoryStore.fetchCategories()
        this.injected.productStore.fetchProducts()
    }

    // метод отображения/скрытия боковой панели
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

    handleProductTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.productStore.setProductTitle(e.target.value)
    }

    handleProductDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.productStore.setProductDescription(e.target.value)
    }

    // обработчик события выбора пункта в выпадающем списке категорий -
    // ИД категории для текущего товара (создаваемого или редактируемого)
    handleProductCategoryChange = (e: React.ChangeEvent<{ name?: string, value: unknown }>) => {
        if (typeof e.target.value === 'string') {
            this.injected.productStore.setProductCategory(Number(e.target.value))
            // когда ИД категории выбран
            // императивно дублируем его в скрытый элемент ввода на форме
            // (на элемент ввода установлен стандартный валидатор)
            document.getElementById('productCategoryValidator')?.setAttribute('value', e.target.value)
        }
    }

    handleProductPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.productStore.setProductPrice(Number(e.target.value))
    }

    handleProductQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.productStore.setProductQuantity(Number(e.target.value))
    }

    handleProductImageChange = (e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        // из аргументов события получаем ссылку на объект-источник события,
        // и из него - путь к выбранному файлу изображения товара
        const ev: React.FormEvent<HTMLInputElement> = e as React.FormEvent<HTMLInputElement>
        const files = ev.currentTarget.files
        if (files) {
            const file = files[0]
            if(file) {
                // передаем в функцию обрезки
                this.resizeFile(file).then((image: unknown) => {
                    // когда преоразование будет завершено -
                    // установим получившуюся строку base64
                    // в модель товара в локльном хранилище
                    if (typeof image === 'string') {
                        this.injected.productStore.setProductImage(image)
                    }
                })
            }
        }
    }

    handleProductAdd = (e: React.MouseEvent) => {
        this.setState({sidePanelVisibility: true})
    }

    handleProductEdit = (e: React.MouseEvent, productId: number) => {
        this.injected.productStore.setCurrentProductId(productId)
        this.setState({sidePanelVisibility: true})
    }

    handleProductDelete = (e: React.MouseEvent, productId: number) => {
        this.injected.productStore.setCurrentProductId(productId)
        this.injected.productStore.deleteProduct()
    }

    /* handleBlur = (e) => {
        console.log(e.target.name + 'Ref')
        console.log(this[e.target.name + 'Ref'].current)
        // склеимаем из значения атрибута name элемента управления,
        // утратившего фокус,
        // имя переменной текущего компонента -
        // ссылки на элемент управления
        this[e.target.name + 'Ref'].current.validate(e.target.value)
    } */

    handleSubmitForm = (e: React.FormEvent) => {
        // предотвращаем отправку данных формы на сервер браузером
        // и перезагрузку страницы
        e.preventDefault()
        this.setState({sidePanelVisibility: false})
        if (!this.injected.productStore.currentProductId) {
            this.injected.productStore.add()
        } else {
            this.injected.productStore.update()
        }
    }

    // функция обрезки файла изображения товара до 300х300 пикселей
    // при помощи библиотеки "react-image-file-resizer"
    resizeFile = (file: File) => new Promise(resolve => {
        Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0,
            uri => {
                resolve(uri);
            },
            'base64'
        )
    })

    imageReaction = reaction(
        () => this.injected.productStore.currentProductImage, // следим за свойством currentProductImage
        (image) => {
            // при изменении значения свойства image -
            // обработанное на клиенте изображение
            // показываем пользователю
            document.getElementById('productImage')?.setAttribute('src', image)
        }
    )

    render() {
        const {loading} = this.injected.commonStore
        const {products} = this.injected.productStore
        const {categories} = this.injected.categoryStore
        const { classes } = this.injected
        return <div>
            <h2 className={classes.title}>Products</h2>
            <Button
                variant='outlined'
                disabled={loading}
                onClick={this.handleProductAdd}
            >
                Add
                <AddIcon/>
            </Button>
            <Drawer
                open={ this.state.sidePanelVisibility } onClose={this.toggleDrawer(false)}>
                <form
                    className={classes.form}
                    onSubmit={this.handleSubmitForm}
                    onError={errors => console.log(errors)}
                    /* ref='form' */
                >
                    <FormControl
                        className={classes.formControl}
                    >
                        <TextField
                            id='title'
                            name='title'
                            label={'product title'}
                            value={this.injected.productStore.title}
                            onChange={this.handleProductTitleChange}
                            required
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="category-label">category</InputLabel>
                        <Select
                            id="category"
                            labelId='category-label'
                            value={this.injected.productStore.categoryId}
                            onChange={this.handleProductCategoryChange}
                        >
                            {categories.map((category: CategoryModel) => {
                                return (
                                    <MenuItem
                                        key={category.id}
                                        value={category.id.toString()}
                                        >
                                        {category.name}
                                    </MenuItem>
                                )})}
                        </Select>
                        <input
                            id='productCategoryValidator'
                            tabIndex={-1}
                            autoComplete="off"
                            className={classes.hiddenInput}
                            value={this.injected.productStore.categoryId?.toString()}
                            required={true}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            id='description'
                            label={'description'}
                            value={this.injected.productStore.description}
                            onChange={this.handleProductDescriptionChange}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            id="price"
                            label={'price'}
                            value={this.injected.productStore.price}
                            onChange={this.handleProductPriceChange}
                            required
                            inputProps={{pattern: '[0-9]*[.]?[0-9]+'}}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            id="quantity"
                            label={'quantity'}
                            type='number'
                            inputProps={{'min': 0}}
                            value={this.injected.productStore.quantity}
                            onChange={this.handleProductQuantityChange}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <div>
                            <div>
                                <img alt='product' id='productImage'/>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    <div>
                                        image
                                        <TextField
                                            id="image"
                                            type='file'
                                            className={classes.imageTextField}
                                            onChange={this.handleProductImageChange}
                                        />
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </FormControl>
                    <hr/>
                    <FormControl className={classes.formControl}>
                        <Button
                            variant='outlined'
                            disabled={loading}
                            type='submit'
                        >
                            Submit
                            <SendIcon/>
                        </Button>
                    </FormControl>
                </form>
            </Drawer>
            <Table>
                <thead>
                <tr>
                    <th data-field='id'>ID</th>
                    <th data-field='title'>Name</th>
                    <th data-field='description'>Description</th>
                    <th data-field='quantity'>Quantity</th>
                    <th data-field='price'>Price</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => {
                    return (
                        <tr>
                            <td>{product.id}</td>
                            <td>{product.title}</td>
                            <td>{product.description}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>
                            <td>
                                <div>
                                    <Button
                                        onClick={(e) => {
                                            this.handleProductEdit(e, product.id)
                                        }}>
                                        <EditIcon/>
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            this.handleProductDelete(e, product.id)
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

export default withStyles(styles)(DashboardProducts)