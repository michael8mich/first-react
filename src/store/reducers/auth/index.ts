import { IQuery, SelectOption } from '../../../models/ISearch';
import { IUser } from './../../../models/IUser';
import { AuthActionEnum, Authentication, AuthState } from './types';

const initialState = {
    isAuth: false,
    fromLocation: '',
    user: {} as IUser,
    isLoading: false,
    error: '',
    siderQueries: [] as IQuery[],
    defaultRole: {} as SelectOption
}

export default function authReducer(state=initialState, action:Authentication):AuthState {
   switch (action.type) {
       case AuthActionEnum.SET_AUTH:
           return {...state, isAuth: action.payload, isLoading: false }
        case AuthActionEnum.SET_FROM_LOCATION:
           return {...state, fromLocation: action.payload }    
       case  AuthActionEnum.SET_ERROR:
           return {...state, error: action.payload, isLoading: false  }  
       case  AuthActionEnum.SET_USER:
           return {...state, user: action.payload }  
       case  AuthActionEnum.SET_IS_LOADING:
           return {...state, isLoading: action.payload }  
       case  AuthActionEnum.SET_SIDER_QUERIES:
            return {...state, siderQueries: action.payload }  
    case  AuthActionEnum.SET_DEFAULT_ROLE:
            return {...state, defaultRole: action.payload }                    
    default:
        return state
   }
}