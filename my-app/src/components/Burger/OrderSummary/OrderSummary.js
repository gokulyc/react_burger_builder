import React from "react";
import HDiv from "../../../hoc/HDiv";
import lodash from "lodash";

const orderSummary=(props)=>{
    const ingredientSummary=lodash.keys(props.ingredients).map( igKey=>{
        return <li key={igKey}><span style={{textTransform:'capitalize'}}>{igKey}</span>: {props.ingredients[igKey]}</li>
    });
    return (<HDiv>
        <h3>
            Your Order
        </h3>
        <p>A delicious burger with following ingredients: </p>
        <ul>
            {ingredientSummary}
        </ul>
        <p>Continue to Checkout ? </p>
    </HDiv>);
};
export default orderSummary;