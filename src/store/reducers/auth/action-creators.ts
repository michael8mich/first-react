import { TFunction } from 'i18next';
import { AppDispatch } from '../..';
import { axiosFn } from '../../../axios/axios';
import { IUser } from './../../../models/IUser';
import { AuthActionEnum, SetAuthAction, SetErrorAction, SetIsLoadingAction, SetUserAction } from './types';
import i18n from "i18next";



  

export const AuthActionCreators =  {
 
    setUser: (user:IUser): SetUserAction => ({type:AuthActionEnum.SET_USER, payload: user}),
    setIsAuth: (auth:boolean): SetAuthAction => ({type:AuthActionEnum.SET_AUTH, payload: auth}),
    setIsError: (error:string): SetErrorAction => ({type:AuthActionEnum.SET_ERROR, payload: error}),
    IsLoading: (loading:boolean): SetIsLoadingAction => ({type:AuthActionEnum.SET_IS_LOADING, payload: loading}),
    login: (username: string, password: string, remember: boolean ) => async (dispatch: AppDispatch ) => {

        try {
        dispatch(AuthActionCreators.IsLoading(true))
        const where = ` login = '${username}' and password = '${password}' `
        const response = await  axiosFn("get", '', '*', 'contact', where , ''  )  
   
        let hasError = false;
        if(response.data["error"]) hasError = true;
        if(!hasError) {
        if(response.data.length !== 0)  
         {
            let user: IUser = response.data[0]
            dispatch(AuthActionCreators.setUser(user))
            if(remember)
            localStorage.setItem('isAuth', JSON.stringify(user) ) 
            i18n.changeLanguage(user.locale.substring(0,2)); 
            dispatch(AuthActionCreators.setIsAuth(true))
        } else
        {
            dispatch(AuthActionCreators.setIsError(i18n.t('login_incorrect'))) 
        }   
       }
       else
       {
        dispatch(AuthActionCreators.setIsError(i18n.t('login_problem')))  
        console.log('error:',response.data["error"] )
       }
       } catch (e) {
       dispatch(AuthActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(AuthActionCreators.IsLoading(false))
      }

    },
    logout: () => async (dispatch: AppDispatch) => { 
        let user = {} as IUser
        dispatch(AuthActionCreators.setUser(user))
        localStorage.removeItem('isAuth')
        dispatch(AuthActionCreators.setIsAuth(false))
        dispatch(AuthActionCreators.setIsError("")) 
    },
    refreshStorage: (user:IUser) => async (dispatch: AppDispatch) => {
        localStorage.setItem('isAuth', JSON.stringify(user) ) 
    }   
}