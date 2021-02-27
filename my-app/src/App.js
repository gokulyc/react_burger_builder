import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Logout from "./containers/Auth/Logout/Logout";
//redux
import * as actions from "./store/actions/index";
import { connect } from "react-redux";

const asyncCheckout = asyncComponent(() => {
    return import('./containers/Checkout/Checkout');
  });
  
  const asyncOrders = asyncComponent(() => {
    return import('./containers/Orders/Orders');
  });
  
  const asyncAuth = asyncComponent(() => {
    return import('./containers/Auth/Auth');
  });
class App extends Component {
    componentDidMount() {
        this.props.onTryAutoSignup();
    }
    render() {
        let routes = (
            <Switch>
                <Route path="/auth" component={asyncAuth} />
                <Route path="/" exact component={BurgerBuilder} />
                <Redirect to="/" />
            </Switch>
        );
        if (this.props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route path="/auth" component={asyncAuth} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/checkout" component={asyncCheckout} />
                    <Route path="/orders" component={asyncOrders} />
                    <Route path="/" exact component={BurgerBuilder} />
                    <Redirect to="/" />
                </Switch>
            );
        }
        return (
            <div>
                <Layout>{routes}</Layout>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== null,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckStatus()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
