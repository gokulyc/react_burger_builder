import React, { Component } from "react";
import HDiv from "../../../hoc/HDiv";
import lodash from "lodash";
import Button from "../../UI/Button/Button";

class OrderSummary extends Component {
  componentWillUpdate() {
    console.log("OrderSummary updates");
  }

  render() {
    const ingredientSummary = lodash
      .keys(this.props.ingredients)
      .map((igKey) => {
        return (
          <li key={igKey}>
            <span style={{ textTransform: "capitalize" }}>{igKey}</span>:{" "}
            {this.props.ingredients[igKey]}
          </li>
        );
      });
    return (
      <HDiv>
        <h3>Your Order</h3>
        <p>A delicious burger with following ingredients: </p>
        <ul>{ingredientSummary}</ul>
        <p>
          <strong>Total Price : {this.props.price}</strong>
        </p>
        <p>Continue to Checkout ? </p>
        <Button btnType="Danger" clicked={this.props.purchaseCancelled}>
          Cancel
        </Button>
        <Button btnType="Success" clicked={this.props.purchaseContinued}>
          Continue
        </Button>
      </HDiv>
    );
  }
}

export default OrderSummary;
