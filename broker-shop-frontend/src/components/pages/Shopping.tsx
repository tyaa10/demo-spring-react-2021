import React, { Component } from 'react'
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Checkbox,
    createStyles,
    Drawer, FormControlLabel, FormGroup, Grid,
    Snackbar, TextField,
    Theme, Typography, withStyles,
    WithStyles
} from "@material-ui/core";
import {CommonStore} from "../../stores/CommonStore";
import {ProductStore} from "../../stores/ProductStore";
import {CategoryStore} from "../../stores/CategoryStore";
import {UserStore} from "../../stores/UserStore";
import {inject, observer} from "mobx-react";
import {Alert} from "@material-ui/lab";
import {Filter as FilterIcon, ExpandMore as ExpandMoreIcon, List as ListIcon, Sort as SortIcon} from "@material-ui/icons"
import CategoryModel from "../../models/CategoryModel";

interface IPreviousSearch {
    searchString: string,
    orderBy: string,
    sortingDirection: string
}

interface IProps { }

interface IInjectedProps extends IProps, WithStyles<typeof styles> {
    commonStore: CommonStore,
    productStore: ProductStore,
    categoryStore: CategoryStore,
    userStore: UserStore
}

interface IState {
    sidePanelVisibility: boolean,
    snackBarVisibility: boolean,
    snackBarText: string,
    prevSearch: IPreviousSearch,
    activeOrderButton: string
}

const styles = (theme: Theme) =>
    createStyles({
        productCard: {
            maxWidth: 300
        },
        productCardImage: {
            height: 300
        },
        filterButton: {
            position: 'fixed',
            top: 75,
            left: 10,
            zIndex: 999,
            backgroundColor: '#ee6e73'
        },
        drawer: {
            width: 300,
            '& .MuiDrawer-paper': {
                position: 'static'
            }
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightBold,
            '& .subHeading': {
                fontWeight: theme.typography.fontWeightRegular,
            },
        },
        buttonSort: {
            margin: 1
        },
        active: {
            backgroundColor: '#ccc'
        }
    })

@inject('commonStore', 'productStore', 'categoryStore', 'userStore')
@observer
class Shopping extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            sidePanelVisibility: false,
            snackBarVisibility: false,
            snackBarText: '',
            prevSearch: {
                searchString: '',
                orderBy: '',
                sortingDirection: ''
            },
            activeOrderButton: ''
        }
    }
    get injected () {
        return this.props as IInjectedProps
    }
    // обработчик события жизненного цикла компонента:
    // компонент примонитирован к виртуальному дереву
    componentDidMount() {
        // сразу после монтирования компонента в виртуальный DOM
        // просим у локального хранилища загрузить
        // список моделей категорий и границы цен и количств товаров
        this.injected.categoryStore.fetchCategories()
        this.injected.productStore.fetchProductPriceBounds()
        this.injected.productStore.fetchProductQuantityBounds()
    }
    // обработчик события жизненного цикла компонента:
    // компонент получил новые значения свойств
    componentDidUpdate(prevProps: Readonly<IProps>) {
        // если работа фильтра в данный момент не выполняется - передаем
        // параметры из адресной строки в состояние фильра в локальном хранилище
        if (this.injected.productStore.allowFetchFilteredProducts) {
            // считывание цепочки параметров из адресной строки
            const windowUrl = window.location.search
            // вызов конструктора парсера параметров адресной строки
            const params = new URLSearchParams(windowUrl)
            // для тех параметров, которые отсутствуют в адресной строке,
            // устанавливаем значения - пустые строки
            const searchString: string = params.get('search') || ''
            const orderBy = params.get('orderBy') || ''
            const sortingDirection = params.get('sortingDirection') || ''
            // если изменилась хотя бы одна составляющая поиска/сортироки в адресной строке
            // (выясняем это сравнением всех трех составляющих поиска/сортировки,
            // установленных в состояние компонента в прошлый раз
            // с новыми значениями, только что полученными из адресной строки)
            if (searchString !== this.state.prevSearch.searchString
                || orderBy !== this.state.prevSearch.orderBy
                || sortingDirection !== this.state.prevSearch.sortingDirection
            ) {
                // новое состояние фильтра (поиска) и сортировки записывается на место старого
                this.setState({prevSearch: {
                        searchString: searchString,
                        orderBy: orderBy,
                        sortingDirection: sortingDirection
                    }})
                // передача строки поиска в хранилище для обработки
                this.injected.productStore.setFilterDataSearchString(searchString)
                if (orderBy) {
                    this.injected.productStore.setOrderBy(orderBy)
                }
                if (sortingDirection) {
                    this.injected.productStore.setSortingDirection(sortingDirection)
                }
                // после заполнения данных поиска/сортировки в хранилище MobX
                // запускаем процесс запроса фильтрованных/сортированных данных о товарах
                this.injected.productStore.fetchFilteredProducts()
                // разрешаем отправку следующих запросов
                this.injected.productStore.setAllowFetchFilteredProducts(false)
            }
        }
    }
    // обработчик переключения видимости панели фильтра/сортировки
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
        this.setState({sidePanelVisibility: open})
    }

    // обработчик клика по кнопке открытия боковой панели фильтра/сортировки
    handleTogglePanelButton = (e: React.MouseEvent) => {
        this.setState({sidePanelVisibility: true})
    }

    // обработчик события "изменение состояния любого из чекбоксов фильтра категорий"
    handleCategoriesFilter = (e: React.ChangeEvent<HTMLInputElement>, categoryId: number) => {
        // в хранилище передаем идентификатор категории, значение чекбокса которой
        // изменилось, и само значение (выбран или не выбран)
        this.injected.productStore.setFilterDataCategory(categoryId, e.target.checked)
    }

    handlePriceFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.productStore.setFilterDataPriceFrom(Number(e.target.value))
    }

    handlePriceToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.productStore.setFilterDataPriceTo(Number(e.target.value))
    }

    handleQuantityFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.productStore.setFilterDataQuantityFrom(Number(e.target.value))
    }

    handleQuantityToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.injected.productStore.setFilterDataQuantityTo(Number(e.target.value))
    }

    // обработчик выбора кнопки направления сортировки или поля сортировки
    handleOrderButtonClick = (e: React.MouseEvent, orderBy: string, sortingDirection: string, buttonName: string) => {
        this.injected.productStore.setOrderBy(orderBy)
        this.injected.productStore.setSortingDirection(sortingDirection)
        this.setState({ activeOrderButton: buttonName })
    }
    handleSnackBarClose = (event?: React.SyntheticEvent, reason?: string) => {
        // если причина появления события закрытия уведомления -
        // это клик вне окошка уведомления -
        // - не реагируем, чтобы пользователь успевал прочесть текст уведомления
        if (reason === 'clickaway') {
            return;
        }
        this.setState({snackBarVisibility: false})
    }
    render () {
        const { loading } = this.injected.commonStore
        const { products } = this.injected.productStore
        const { categories } = this.injected.categoryStore
        const { classes } = this.injected
        return (
            <div>
                {/* drawer toggle button */}
                <Button
                    variant='outlined'
                    disabled={loading}
                    className={classes.filterButton}
                    onClick={this.handleTogglePanelButton}
                >
                    Filter
                    <FilterIcon/>
                </Button>
                {/* drawer */}
                <Drawer
                    open={ this.state.sidePanelVisibility }
                    onClose={this.toggleDrawer(false)}
                    className={classes.drawer}
                >
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <ListIcon/>
                            <Typography className={classes.heading}>
                                Categories
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup row>
                                {categories.map((category: CategoryModel) => {
                                    return (
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name={'c' + category.id}
                                                    checked={!!this.injected.productStore.categories.find(categoryId => categoryId === category.id)}
                                                    onChange={(e) => {
                                                        this.handleCategoriesFilter(e, category.id)
                                                    }}/>
                                            }
                                            label={category.name} />
                                    )})}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <FilterIcon/>
                            <Typography className={classes.heading}>
                                Filter
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup row>
                                <div>
                                    <Typography className='subHeading'>
                                        Price Range
                                    </Typography>
                                </div>
                                <div>
                                    <TextField
                                        id="priceFrom"
                                        label={'from'}
                                        value={this.injected.productStore.priceFrom}
                                        onChange={this.handlePriceFromChange}
                                    />
                                    <TextField
                                        id="priceTo"
                                        label={'to'}
                                        value={this.injected.productStore.priceTo}
                                        onChange={this.handlePriceToChange}
                                    />
                                </div>
                            </FormGroup>
                        </AccordionDetails>
                        <AccordionDetails>
                            <FormGroup row>
                                <div>
                                    <Typography className='subHeading'>
                                        Quantity
                                    </Typography>
                                </div>
                                <div>
                                    <TextField
                                        id="quantityFrom"
                                        label={'from'}
                                        value={this.injected.productStore.quantityFrom}
                                        onChange={this.handleQuantityFromChange}
                                    />
                                    <TextField
                                        id="quantityTo"
                                        label={'to'}
                                        value={this.injected.productStore.quantityTo}
                                        onChange={this.handleQuantityToChange}
                                    />
                                </div>
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <SortIcon/>
                            <Typography className={classes.heading}>
                                Sort
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Button
                                className={classes.buttonSort + ' ' + (this.state.activeOrderButton === 'New' ? classes.active : "")}
                                variant="outlined"
                                onClick={(e) => {
                                    this.handleOrderButtonClick(e, 'id', 'DESC', 'New')
                                }}
                            >
                                New
                            </Button>
                            <Button
                                className={classes.buttonSort + ' ' + (this.state.activeOrderButton === 'Old' ? classes.active : "")}
                                variant="outlined"
                                onClick={(e) => {
                                    this.handleOrderButtonClick(e, 'id', 'ASC', 'Old')
                                }}
                            >
                                Old
                            </Button>

                            <Button
                                className={classes.buttonSort + ' ' + (this.state.activeOrderButton === 'Cheep' ? classes.active : "")}
                                variant="outlined"
                                onClick={(e) => {
                                    this.handleOrderButtonClick(e, 'price', 'ASC', 'Cheep')
                                }}
                            >
                                Cheep
                            </Button>
                            <Button
                                className={classes.buttonSort + ' ' + (this.state.activeOrderButton === 'Costly' ? classes.active : "")}
                                variant="outlined"
                                onClick={(e) => {
                                    this.handleOrderButtonClick(e, 'price', 'DESC', 'Costly')
                                }}
                            >
                                Costly
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                </Drawer>
                <Grid container>
                    {products.map(product => {
                        return (
                            <Grid item
                                  xs={12}
                                  sm={12}
                                  md={6}
                                  lg={4}
                                  xl={3}
                            >
                                <Card className={classes.productCard}>
                                    <CardActionArea>
                                        <CardMedia
                                            className={classes.productCardImage}
                                            image={product.image}
                                            title={product.title}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {product.title} - <strong>${product.price}</strong>
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {product.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        {/*<Button size="small" color="primary">
                                        Share
                                    </Button>*/}
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={(e) => {
                                                /* this.handleAddToCart(e, product.id) */
                                            }}
                                            style={{display: this.injected.userStore.user ? 'inline' : 'none' }}>
                                            Add to cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )

                    })}
                </Grid>
                <Snackbar
                    open={this.state.snackBarVisibility}
                    autoHideDuration={6000} onClose={this.handleSnackBarClose}>
                    <Alert onClose={this.handleSnackBarClose} severity="success">
                        {this.state.snackBarText}
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}
export default withStyles(styles)(Shopping)
// const shopping = () => <Shopping/>
// export default shopping