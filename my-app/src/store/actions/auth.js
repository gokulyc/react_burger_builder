import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error,
    };
};
export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime*1000);
    };
};

export const authenticate = (email, password, isSignUp) => {
    return (dispatch) => {
        dispatch(authStart());
        const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true,
        };
        const signinUrl =
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
            apiKey;
        const signupUrl =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
            apiKey;
        let url = signupUrl;
        if (!isSignUp) {
            url = signinUrl;
        }
        axios
            .post(url, authData)
            .then((response) => {
                // console.log(response);
                const data = response.data;
                dispatch(authSuccess(data.idToken, data.localId));
                dispatch(checkAuthTimeout(data.expiresIn));
            })
            .catch((err) => {
                // console.log(err);
                dispatch(authFail(err.response.data.error));
            });
    };
};
