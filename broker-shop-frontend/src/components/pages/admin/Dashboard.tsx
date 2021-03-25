import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import {
    Card,
    CardActions,
    CardContent,
    CardMedia, createStyles,
    Grid, Theme,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core"
import categoryTreeImage from '../../../images/category-tree.jpg'
import goodsImage from '../../../images/goods.jpg'

interface IProps {
}

interface IInjectedProps extends IProps, WithStyles<typeof styles> {
}

interface IState {
}

const styles = (theme: Theme) =>
    createStyles({
        card: {
            display: 'flex',
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: 151,
        },
    })

class Dashboard extends Component<IProps, IState> {
    get injected () {
        return this.props as IInjectedProps
    }
    render () {
        const { classes } = this.injected
        return <Grid container spacing={3}>
            <Grid item
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
            >
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cover}
                        image={categoryTreeImage}
                        title="Categories"
                    />
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="h5" variant="h5">
                                Categories
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <NavLink
                                key={'/admin/categories'}
                                to={'/admin/categories'}
                            >
                                Go
                            </NavLink>
                        </CardActions>
                    </div>
                </Card>
            </Grid>
            <Grid item
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
            >
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cover}
                        image={goodsImage}
                        title="Products"
                    />
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="h5" variant="h5">
                                Products
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <NavLink
                                key={'/admin/products'}
                                to={'/admin/products'}
                            >
                                Go
                            </NavLink>
                        </CardActions>
                    </div>
                </Card>
            </Grid>
        </Grid>
    }
}

export default withStyles(styles)(Dashboard)