import { stopSubmit } from 'redux-form';
import { restApi } from '../api/api';
const SET_USER_DATA = 'SET_USER_DATA'

let initialState = {
    userId: null,
    email: null,
    login: null,
    isAuth: false
}
const authReducer = (state = initialState, action, isAuth) => {

    switch (action.type) {

        case SET_USER_DATA:
            return {
                ...state,
                userId: action.userId,
                email: action.email,
                login: action.login,
                isAuth: action.isAuth
            };
        default:
            return state;
    }
}
export const setAuthUserData = (userId, email, login, isAuth) => ({ type: SET_USER_DATA, userId, email, login, isAuth })

export const getAuthUser = () => {
    return (dispatch) => {
        const currentUserid = localStorage.getItem('userId');
        if (currentUserid) {
            return restApi.globalApi('get',
                ' * ',
                ' auth ',
                ' userid=\'' + currentUserid + '\''
            )
                .then((data) => {
                    let userData = data[0]
                    if (userData) {
                        if (userData.resultCode == '0') {

                            let { userId, email, login } = userData
                            dispatch(setAuthUserData(userId, email, login, true));
                        }

                    }
                })
        }
        else {
            dispatch(setAuthUserData(null, null, null));
        }

    }
}


export const login = (username, password, rememberMe = false) => {
    return (dispatch) => {

        restApi.globalApi('get',
            ' * ',
            ' auth ',
            ' login=\'' + username + '\' AND  pass=\'' + password + '\''
        )
            .then((data) => {
                if (data.length === 1) {
                    let { userId, email, login } = data[0]
                    dispatch(setAuthUserData(userId, email, login, true));
                    // update resultCode
                    restApi.globalApi('put',
                        ' {"resultCode" : 0 } ',
                        ' auth ',
                        ' login=\'' + username + '\' AND  pass=\'' + password + '\''
                    ).then((result) => {
                        if (rememberMe) {
                            localStorage.setItem('userId', userId);
                            localStorage.setItem('email', email);
                            localStorage.setItem('login', login);
                        }

                        console.log(result)
                    })

                }
                else {

                    dispatch(setAuthUserData(null, null, null, false));
                    localStorage.removeItem('userId');
                    localStorage.removeItem('email');
                    localStorage.removeItem('login');

                    //let action = stopSubmit('login', { login: " ", password: "Usermame or Password Wrong" });
                    //let action = stopSubmit('login', { _error: "Usermame or Password Wrong" });
                    dispatch(stopSubmit('login', { _error: "Usermame or Password Wrong" }))
                }
            })
    }
}
export const logout = (userId) => {
    return (dispatch) => {
        restApi.globalApi('put',
            ' {"resultCode" : 1 } ',
            ' auth ',
            ' userid=\'' + userId + '\''
        ).then((result) => {
            dispatch(setAuthUserData(null, null, null, false));
            localStorage.removeItem('userId');
            localStorage.removeItem('email');
            localStorage.removeItem('login');
            console.log(result)
        })
    }
}
export default authReducer