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
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};
export const authCheckStatus = () => {
    return (dispatch) => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(
                localStorage.getItem("expirationDate")
            );
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem("userId");
                dispatch(authSuccess(token, userId));
                dispatch(
                    checkAuthTimeout(
                        (expirationDate.getTime() - new Date().getTime()) / 1000
                    )
                );
            }
            // dispatch(authSuccess());
        }
    };
};

export const setAuthRedirectUrl = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_URL,
        path: path,
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
                const expirationDate = new Date(
                    new Date().getTime() + data.expiresIn * 1000
                );
                localStorage.setItem("token", data.idToken);
                localStorage.setItem("expirationDate", expirationDate);
                localStorage.setItem("userId", data.localId);
                dispatch(authSuccess(data.idToken, data.localId));
                dispatch(checkAuthTimeout(data.expiresIn));
            })
            .catch((err) => {
                // console.log(err);
                dispatch(authFail(err.response.data.error));
            });
    };
};
