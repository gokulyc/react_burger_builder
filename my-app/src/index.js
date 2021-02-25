import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

//redux
import { Provider } from "react-redux";
import burgerBuilderReducer from "./store/reducers/burgerBuilder";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import orderReducer from "./store/reducers/order";
import authReducer from "./store/reducers/auth";
// import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    burgerBuilder: burgerBuilderReducer,
    order: orderReducer,
    auth:authReducer,
});

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
