import { SemanticDiagnosticsBuilderProgram } from 'typescript';
import { AddDispatch } from '../..';
import { axiosFn } from '../../../axios/axios';
import { IUser } from './../../../models/IUser';
import { AuthActionEnum, SetAuthAction, SetErrorAction, SetIsLoadingAction, SetUserAction } from './types';


export const AuthActionCreators = {
    setUser: (user:IUser): SetUserAction => ({type:AuthActionEnum.SET_USER, payload: user}),
    setIsAuth: (auth:boolean): SetAuthAction => ({type:AuthActionEnum.SET_AUTH, payload: auth}),
    setIsError: (error:string): SetErrorAction => ({type:AuthActionEnum.SET_ERROR, payload: error}),
    IsLoading: (loading:boolean): SetIsLoadingAction => ({type:AuthActionEnum.SET_IS_LOADING, payload: loading}),
    login: (username: string, password: string ) => async (dispatch: AddDispatch) => {
     try {
        dispatch(AuthActionCreators.IsLoading(true))
        const where = ` login = '${username}' and password = '${password}' `
        const response = await  axiosFn("get", '', '*', 'contact', where , ''  )  
       debugger
        let hasError = false;
        if(response.data["error"]) hasError = true;
        if(!hasError) {
        if(response.data.length !== 0)  
         {
            dispatch(AuthActionCreators.setIsAuth(true))
            let user: IUser = response.data[0]
            dispatch(AuthActionCreators.setUser(user))
            localStorage.setItem('isAuth', JSON.stringify(user) )  
        } else
        {
            dispatch(AuthActionCreators.setIsError("Username or Password Incorrect")) 
        }   
       }
       else
       {
        dispatch(AuthActionCreators.setIsError("Login Problem"))  
        console.log('error:',response.data["error"] )
       }
       } catch (e) {
       dispatch(AuthActionCreators.setIsError("Axios Error"))        
      } finally {
        dispatch(AuthActionCreators.IsLoading(false))
      }

    }
}