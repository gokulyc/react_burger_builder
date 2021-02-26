import React, { Component } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect } from "react-router-dom";
//redux
import { connect } from "react-redux";
import * as actions from "../../store/actions";

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: "input",
                elementConfig: {
                    type: "email",
                    placeholder: "Your Email",
                },
                value: "",
                validation: {
                    required: true,
                    isEmail: true,
                },
                valid: false,
                touched: false,
            },
            password: {
                elementType: "input",
                elementConfig: {
                    type: "password",
                    placeholder: "Password",
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 8,
                },
                valid: false,
                touched: false,
            },
        },
        isSignup: true,
    };
    componentDidMount(){
        if (!this.props.buildingBurger && this.props.authRedirectPath !=="/"){
            this.props.onSetAuthRedirectPath();
        }
    }
    switchAuthModeHandler = () => {
        this.setState((prevState) => {
            return { isSignup: !prevState.isSignup };
        });
    };
    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== "" && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid;
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, controlName) => {
        const inputValue = event.target.value;
        const updatedLoginForm = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: inputValue,
                valid: this.checkValidity(
                    inputValue,
                    this.state.controls[controlName].validation
                ),
                touched: true,
            },
        };
        this.setState({
            controls: updatedLoginForm,
            // formIsValid: formIsValid,
        });
    };
    submitHandler = (event) => {
        const { email, password } = this.state.controls;
        event.preventDefault();
        this.props.onAuth(email.value, password.value, this.state.isSignup);
    };

    render() {
        const formElementsArray = [];
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />;
        }
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key],
            });
        }
        let form = formElementsArray.map((formElement) => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) =>
                    this.inputChangedHandler(event, formElement.id)
                }
            />
        ));
        if (this.props.loading) {
            form = <CircularProgress />;
        }
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = <p>{this.props.error.message}</p>;
        }
        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">
                        {!this.state.isSignup ? "Login" : "Signup"}
                    </Button>
                </form>
                <Button clicked={this.switchAuthModeHandler} btnType="Danger">
                    Switch to {this.state.isSignup ? "Login" : "Signup"}
                </Button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger:state.burgerBuilder.building,
        authRedirectPath:state.auth.authRedirectUri,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, isSignUp) =>
            dispatch(actions.authenticate(email, password, isSignUp)),
        onSetAuthRedirectPath : ()=> dispatch(actions.setAuthRedirectUrl("/")),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
