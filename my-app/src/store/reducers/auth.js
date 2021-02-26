import * as actionTypes from "../actions/actionTypes";

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectUri:"/",
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.AUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                token: action.idToken,
                userId: action.userId,
                error: null,
            };
        case actionTypes.AUTH_FAILED:
            return {
                ...state,
                loading: false,
                error: action.error,
                token:null,
                userId:null
            };
        case actionTypes.AUTH_LOGOUT:
            return{
                ...state,
                token:null,
                userId:null
            }
        case actionTypes.SET_AUTH_REDIRECT_URL:
            return {
                ...state,
                authRedirectUri:action.path,
            }
        default:
            return state;
    }
};

export default reducer;
