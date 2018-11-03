import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink, Redirect} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import {createMuiTheme} from '@material-ui/core/styles/'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import {purple} from '@material-ui/core/colors/purple'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import { Button } from '@material-ui/core';
import {withTracker} from 'meteor/react-meteor-data'

import Home from './Home'
import Donate from './Donate'
import ViewDonations from './ViewDonations'
import AdminLogin from './AdminLogin';
import ManageActs from'./admin/ManageActs'



const muiTheme = createMuiTheme({
    palette: {
        primary: purple,
        secondary:
        {
            main : '#f44336'
        }
    }
});


class App extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            open : false
        }
    }
    //Copy pasta from React Router Documentation
    PrivateRoute = (({ component: Component, ...rest }) => {
        if(!this.props.isReady)
        {
            return (<Route {...rest} render={props => (<Component {...props} />)}/>);
        }
        var {currUser} = this.props;
        console.log(currUser);
        return (
            <Route
            {...rest}
            render={props =>
                 this.props.currUser.role === 1 ? (
                <Component {...props} />
                ) : (
                <Redirect
                    to={{
                    pathname: "/",
                    state: { from: props.location }
                    }}
                />
                )
            }
            />
        );
    });

    handleClick()
    {
        this.setState({open : true});
    }

    handleClose()
    {
        this.setState({open : false});
    }
    
    //copy pasta from React Router Documentaiton

    
    rightDrawer()
    {
        //let role = Meteor.user().role;
        if(this.props.isReady)
        {
            if(this.props.currUser.role === 1)
            {
                return(
                    <List>
                        <div onClick = {this.handleClose.bind(this)}>
                        <ListItem button = {true} component = {NavLink} exact to = '/'>Home</ListItem>
                        <ListItem button = {true} component = {NavLink} to = '/admin/'>Manage Acts</ListItem>
                        <ListItem button = {true} component = {NavLink} to = '/view-donations'>Manage Donations</ListItem>
                        <ListItem button = {true} component = {NavLink} to = '/view-donations'>Display Current Act</ListItem>
                        </div>
                    </List>
                );
            }
            else 
            {
                return(
                    <List>
                        <div onClick = {this.handleClose.bind(this)}>
                        <ListItem button = {true} component = {NavLink} exact to = '/'>Home</ListItem>
                        <ListItem button = {true} component = {NavLink} to = '/donate'>Donate</ListItem>
                        <ListItem button = {true} component = {NavLink} to = '/view-donations'>View Your Donations</ListItem>
                        </div>
                    </List>
                );
            }
        }

    }

    render()
    {
        return(
        <MuiThemeProvider theme = {muiTheme}>
            <BrowserRouter>
                <div id = "content">
                    <AppBar>
                        <Toolbar style = {{display : 'flex', flexFlow : 'row nowrap', justifyContent : "space-between"}}>
                        <IconButton onClick = {this.handleClick.bind(this)}>
                            <MenuIcon />
                            </IconButton>
                            <Typography variant = 'title' color = 'default'>Aid The Cause 2018</Typography>
                            <Button href='/login'>Admin</Button>
                        </Toolbar>
                    </AppBar>
                    <Drawer open = {this.state.open} onClose = {this.handleClose.bind(this)}>
                        {this.rightDrawer()}
                    </Drawer>
                    <div id = "main-content" style = {{paddingTop : '50px'}}>
                        <Switch>
                            <Route exact path = '/' component = {Home}/>
                            <Route path = '/donate' component = {Donate}/>
                            <Route path = '/view-donations' component = {ViewDonations} />
                            <Route path = '/login' component = {AdminLogin} />
                            <this.PrivateRoute path = "/admin/manage-acts" component = {ManageActs}/>
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        </MuiThemeProvider>
        );
    }
}

export default withTracker(() => {
    const subsription = Meteor.subscribe('users');
    let userId = Meteor.userId();
    return {
        isReady: subsription.ready(),
        currUser: subsription.ready() && Meteor.users.findOne({_id : userId}),
    };
})(App);