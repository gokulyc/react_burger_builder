import React, { Component } from "react";

import HDiv from "../../hoc/HDiv";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";

import lodash from "lodash";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";
// import * as actionTypes from "../../store/actions";
import * as actions from "../../store/actions/index";

export class BurgerBuilder extends Component {

  state = {
    isPurchasing: false,
    showContinue: false,
    loading: false,
    errMsg: "",
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }
  updatePurchaseState(ingredients) {
    const sum = lodash.values(ingredients).reduce((sum, el) => {
      return sum + el;
    }, 0);
    return sum > 0;
  }
  purchaseHandler = () => {
    if (this.props.isAuthenticated){
      this.setState({ isPurchasing: true });
    }
    else{
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
    
  };
  purchaseCancelHandler = () => {
    this.setState({ isPurchasing: false });
  };
  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };
  closeAlert = () => {
    this.setState({ showContinue: false });
  };

  render() {
    let orderSummary = null;
    let burgerComp = this.props.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <CircularProgress />
    );

    const disabledInfo = {
      ...this.props.ings,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    
    if (this.props.ings) {
      burgerComp = (
        <HDiv>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ings)}
            isOrdered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
          />
        </HDiv>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.props.price}
        />
      );
      if (this.state.loading) {
        orderSummary = <CircularProgress />;
      }
    }

    return (
      <HDiv>
        {this.state.errMsg.length > 0 ? (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={this.state.errMsg.length > 0}
            autoHideDuration={6000}
            onClose={this.handleSnackClose}
          >
            <Alert onClose={this.handleSnackClose} severity="error">
              {this.state.errMsg}
            </Alert>
          </Snackbar>
        ) : null}
        <Modal
          show={this.state.isPurchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
          {this.state.showContinue ? (
            <Alert onClose={this.closeAlert}>You want to continue !</Alert>
          ) : null}
        </Modal>
        {burgerComp}
      </HDiv>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice.toFixed(2),
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) =>
      dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) =>
      dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase:()=>dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath:(path)=>dispatch(actions.setAuthRedirectUrl(path)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BurgerBuilder);
