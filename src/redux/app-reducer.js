import { stopSubmit } from 'redux-form';
import { restApi } from '../api/api';
import { getAuthUser } from './auth-reducer';

const INITIALIZED_SUCCESS = 'APP/INITIALIZED_SUCCESS'

let initialState = {
    initialized: false,
    globalError: null
}
const appReducer = (state = initialState, action, isAuth) => {

    switch (action.type) {

        case INITIALIZED_SUCCESS:
            return {
                ...state,
                initialized: true
            };
        default:
            return state;
    }
}
export const initializedSuccess = (h) => ({ type: INITIALIZED_SUCCESS })

export const initializeApp = () => {
    return (dispatch) => {

        let promise = dispatch(getAuthUser());
        Promise.all([promise]).then(() => {
            dispatch(initializedSuccess());
        })

    }
}


export default appReducer