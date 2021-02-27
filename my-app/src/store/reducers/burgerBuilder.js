import * as actionTypes from '../actions/actionTypes';
import produce from "immer";

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building:false,
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};
const reducer = produce( (draft, action)  => {
    switch ( action.type ) {
        case actionTypes.ADD_INGREDIENT:
            draft.ingredients[action.ingredientName]=draft.ingredients[action.ingredientName]+1;
            draft.totalPrice=draft.totalPrice + INGREDIENT_PRICES[action.ingredientName];
            draft.building=true;
            return draft;
        case actionTypes.REMOVE_INGREDIENT:
            draft.ingredients[action.ingredientName]=draft.ingredients[action.ingredientName]-1;
            draft.totalPrice=draft.totalPrice - INGREDIENT_PRICES[action.ingredientName];
            draft.building=true;
            return draft;
        case actionTypes.SET_INGREDIENTS:
            draft.ingredients={
                salad: action.ingredients.salad,
                bacon: action.ingredients.bacon,
                cheese: action.ingredients.cheese,
                meat: action.ingredients.meat
            };
            draft.totalPrice=4;
            draft.error=false;
            draft.building=false;
            return draft;
        case actionTypes.FETCH_INGREDIENTS_FAILED:
            draft.error=true;
            return draft;
        default:
            return draft;
    }
},initialState);

export default reducer;