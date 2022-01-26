import { TFunction } from 'i18next';
import { AppDispatch } from '../..';
import { axiosFn, axiosFnLogin, TOKEN } from '../../../axios/axios';
import { IUserObjects, IUserObjectsMulti, IUser } from './../../../models/IUser';
import { AuthActionEnum, SetAuthAction, SetDefaultRoleAction, SetErrorAction, SetFromLocationAction, SetIsLoadingAction, SetSiderQueriesAction, SetUserAction } from './types';
import i18n from "i18next";
import { AdminActionCreators } from '../admin/action-creators';
import { translateObj } from '../../../utils/translateObj';
import { IQuery, SelectOption } from '../../../models/ISearch';


interface JVTToken {
  expiration: Date
  token: string
}
  

export const AuthActionCreators =  {
 
    setUser: (user:IUser): SetUserAction => ({type:AuthActionEnum.SET_USER, payload: user}),
    setIsAuth: (auth:boolean): SetAuthAction => ({type:AuthActionEnum.SET_AUTH, payload: auth}),
    setFromLocation: (fromLocation:string): SetFromLocationAction => ({type:AuthActionEnum.SET_FROM_LOCATION, payload: fromLocation}),
    setIsError: (error:string): SetErrorAction => ({type:AuthActionEnum.SET_ERROR, payload: error}),
    IsLoading: (loading:boolean): SetIsLoadingAction => ({type:AuthActionEnum.SET_IS_LOADING, payload: loading}),
    setSiderQueries: (siderQueries:IQuery[]): SetSiderQueriesAction => ({type:AuthActionEnum.SET_SIDER_QUERIES, payload: siderQueries}),
    setDefaultRole: (defaultRole:SelectOption): SetDefaultRoleAction => ({type:AuthActionEnum.SET_DEFAULT_ROLE, payload: defaultRole}),
    login: (username: string, password: string, remember: boolean, fromLocation:string ='' ) => async (dispatch: AppDispatch ) => {

        try {
        dispatch(AuthActionCreators.IsLoading(true))
        //const where = ` login = '${username}' and password = '${password}' `
        //const response = await  axiosFn("get", '', '*', 'V_contacts', where , ''  ) 
        
        const response:any = await  axiosFnLogin(username, password )  

        let hasError = false;
        
        if(!response?.data || response?.data["error"]) hasError = true;
        if(!hasError) {
            let token:JVTToken = response.data
            if(!token.token) 
            {
              dispatch(AuthActionCreators.setIsError(i18n.t('login_incorrect'))) 
              return
            }
            localStorage.setItem('token', token.token)
            if(token.token)
            TOKEN.token = token.token
            const where = ` login = '${username}'  `
            const response_ = await  axiosFn("get", '', '*', 'V_contacts', where , ''  ) 
             let multiObject = {}
             let users_: any[] = response_.data
             users_ = translateObj(users_, IUserObjects)
             let user:IUser = users_[0]
             dispatch(AuthActionCreators.setUser(user))
             dispatch(AuthActionCreators.setIsAuth(true))

             i18n.changeLanguage(user.locale.substring(0,2)); 
             IUserObjectsMulti.map( async  m=> {
               let first = ''
               let second = ''
               let third = ""
              if(m==='roles') {  
                first = ' util as value, name as label, is_default as code '
                second = 'V_util_parent'
                third = " parent = '" + user.id + "'"
              } 
              if(m==='teams') {  
                first = ' team as value, team_name as label, id as code '
                second = 'V_teammember'
                third = " member = '" + user.id + "'"
              } 
              if(m==='members') {  
                first = ' member as value, member_name as label, id as code '
                second = 'V_teammember'
                third = " team  = '" + user.id + "'"
              } 
                const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
                console.log('m', m);
                multiObject = { ...multiObject, [m]: response_multi.data}
                dispatch(AuthActionCreators.setUser({...user, ...multiObject}))
                if(remember)
                localStorage.setItem('isAuth', JSON.stringify({...user, ...multiObject}) )    
                
            })
        }
        else
        {
            dispatch(AuthActionCreators.setIsError(i18n.t('login_incorrect'))) 
        }   
       } catch (e) {
       dispatch(AuthActionCreators.setIsError(i18n.t('network_error')))        
      } finally {
        dispatch(AuthActionCreators.IsLoading(false))
      }

    },
    sso: (username: string, fromLocation:string ='' ) => async (dispatch: AppDispatch ) => {

      try {
      dispatch(AuthActionCreators.IsLoading(true))
      const where = ` login = '${username}'  `
      const response = await  axiosFn("get", '', '*', 'V_contacts', where , ''  )  
      let hasError = false;
      if(response.data["error"]) hasError = true;
      if(!hasError) {
      if(response.data.length !== 0)  
       {
          let user: IUser = response.data[0]
          let hasError = false;
          if(response.data["error"]) hasError = true;
          let multiObject = {}
           if(response.data&&!hasError)
           {
           let users_: any[] = response.data
           users_ = translateObj(users_, IUserObjects)
           let user:IUser = users_[0]
           dispatch(AuthActionCreators.setUser(user))
           dispatch(AuthActionCreators.setIsAuth(true))

           i18n.changeLanguage(user.locale.substring(0,2)); 
           IUserObjectsMulti.map( async  m=> {
             let first = ''
             let second = ''
             let third = ""
            if(m==='roles') {  
              first = ' util as value, name as label, is_default as code '
              second = 'V_util_parent'
              third = " parent = '" + user.id + "'"
            } 
            if(m==='teams') {  
              first = ' team as value, team_name as label, id as code '
              second = 'V_teammember'
              third = " member = '" + user.id + "'"
            } 
            if(m==='members') {  
              first = ' member as value, member_name as label, id as code '
              second = 'V_teammember'
              third = " team  = '" + user.id + "'"
            } 
              const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
              console.log('m', m);
              multiObject = { ...multiObject, [m]: response_multi.data}
              dispatch(AuthActionCreators.setUser({...user, ...multiObject}))
              localStorage.setItem('isAuth', JSON.stringify({...user, ...multiObject}) )    
          })
          
      }
      }
      else
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
    fetchLoginUser: (id:string ) => async (dispatch: AppDispatch ) => {
      try {
      dispatch(AuthActionCreators.IsLoading(true))
      const response = await  axiosFn("get", '', '*', 'V_contacts', '' , id  )  
 
      let hasError = false;
      if(response.data["error"]) hasError = true;
      if(!hasError) {
      if(response.data.length !== 0)  
       {
          let user: IUser = response.data[0]
          let hasError = false;
          if(response.data["error"]) hasError = true;
          let multiObject = {}
           if(response.data&&!hasError)
           {
           let users_: any[] = response.data
           users_ = translateObj(users_, IUserObjects)
           let user:IUser = users_[0]
           dispatch(AuthActionCreators.setUser(user))
           dispatch(AuthActionCreators.setIsAuth(true))

           i18n.changeLanguage(user.locale.substring(0,2)); 
           IUserObjectsMulti.map( async  m=> {
             let first = ''
             let second = ''
             let third = ""
            if(m==='roles') {  
              first = ' util as value, name as label, is_default as code '
              second = 'V_util_parent'
              third = " parent = '" + user.id + "'"
            } 
            if(m==='teams') {  
              first = ' team as value, team_name as label, id as code '
              second = 'V_teammember'
              third = " member = '" + user.id + "'"
            } 
            if(m==='members') {  
              first = ' member as value, member_name as label, id as code '
              second = 'V_teammember'
              third = " team  = '" + user.id + "'"
            } 
              const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
              console.log('m', m);
              multiObject = { ...multiObject, [m]: response_multi.data}
              dispatch(AuthActionCreators.setUser({...user, ...multiObject}))
              localStorage.setItem('isAuth', JSON.stringify({...user, ...multiObject}) )    
          })
          
      }
      }
      else
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
        localStorage.removeItem('token')
        dispatch(AuthActionCreators.setIsAuth(false))
        dispatch(AuthActionCreators.setIsError("")) 
    },
    refreshStorage: (user:IUser) => async (dispatch: AppDispatch) => {
        localStorage.setItem('isAuth', JSON.stringify(user) ) 
    },  
    fetchQueries: (id: string ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(AuthActionCreators.setIsError(''))
         dispatch(AuthActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'queries', " object='"+id+"' " , '' )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             return response.data
             } else
             {
              
              dispatch(AuthActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
          return []
          console.log('fetchTickets',e);
              
          dispatch(AuthActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(AuthActionCreators.IsLoading(false))
       }
 
     }, 
}