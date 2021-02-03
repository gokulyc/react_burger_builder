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

import axios from "../../axios-orders";

import {connect} from "react-redux";
import * as actionTypes from "../../store/actions";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};
class BurgerBuilder extends Component {
  // constructor(props) {
  //     super(props);
  //     this.state = {...}
  // }
  state = {
    totalPrice: 4,
    purchasable: false,
    isPurchasing: false,
    showContinue: false,
    loading: false,
    errMsg: "",
  };

  componentDidMount() {
    // axios
    //   .get("/ingredients.json")
    //   .then((res) => {
    //     this.setState({ ingredients: res.data });
    //   })
    //   .catch((err) => {
    //     this.setState({ errMsg: "Network load error ingredients" });
    //   });
  }
  updatePurchaseState(ingredients) {
    const sum = lodash.values(ingredients).reduce((sum, el) => {
      return sum + el;
    }, 0);
    this.setState({ purchasable: sum > 0 });
  }
  purchaseHandler = () => {
    this.setState({ isPurchasing: true });
  };
  purchaseCancelHandler = () => {
    this.setState({ isPurchasing: false });
  };
  purchaseContinueHandler = () => {
    // this.setState((prevState) => {
    //   return { ...prevState, loading: true };
    // });
    // const order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.totalPrice.toFixed(2),
    //   customer: {
    //     name: "gokul",
    //     address: {
    //       zipCode: "500020",
    //       country: "India",
    //     },
    //     email: "dummy@d.com",
    //   },
    //   deliveryMethod: "fastest",
    // };
    // // console.log(axios.getUri());
    // axios
    //   .post("/orders.json", order)
    //   .then((res) => {
    //     this.setState({ loading: false, isPurchasing: false });
    //   })
    //   .catch((err) => {
    //     this.setState({
    //       loading: false,
    //       isPurchasing: false,
    //       errMsg: err.message,
    //     });
    //   });
    // this.setState((prevState) => {
    //   return { ...prevState, showContinue: true };
    // });
    // alert("You continue!");
    const queryParams = [];
    for (let key in this.state.ingredients) {
      queryParams.push(
        encodeURIComponent(key) +
          "=" +
          encodeURIComponent(this.state.ingredients[key])
      );
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/checkout",
      search: "?" + queryString,
    });
  };
  closeAlert = () => {
    this.setState({ showContinue: false });
  };

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };
  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };
  handleSnackClose = () => {
    this.setState({ errMsg: "" });
  };
  render() {
    let orderSummary = null;

    const disabledInfo = {
      ...this.props.ings,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let burgerComp =
      this.state.errMsg.length === 0 ? <CircularProgress /> : null;
    if (this.props.ings) {
      burgerComp = (
        <HDiv>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.state.totalPrice.toFixed(2)}
            purchasable={this.state.purchasable}
            isOrdered={this.purchaseHandler}
          />
        </HDiv>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.state.totalPrice.toFixed(2)}
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
const mapStateToProps=state=>{
  return {
    ings:state.ingredients,
    price: state.totalPrice
  };
}

const mapDispatchToProps=dispatch=>{
  return {
    onIngredientAdded:(ingName)=>dispatch({type:actionTypes.ADD_INGREDIENT,ingredientName:ingName}),
    onIngredientRemoved:(ingName)=>dispatch({type:actionTypes.REMOVE_INGREDIENT,ingredientName:ingName}),

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BurgerBuilder);
