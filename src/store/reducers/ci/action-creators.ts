import { AppDispatch } from '../..';
import { axiosFn } from '../../../axios/axios';
import { ICiObjects, ICiObjectsMulti, ICi, ICiLog } from '../../../models/ICi';
import { CiActionEnum, SetCisAction, SetErrorAction, SetIsLoadingAction, SetCisCountAction, SetSelectedCiAction } from './types';
import i18n from "i18next";
import { translateObj } from '../../../utils/translateObj';
import { SearchPagination } from '../../../models/ISearch';
import { nowToUnix } from '../../../utils/formManipulation';
import { RouteNames } from '../../../router';

export const CiActionCreators = {
    setCis: (payload:ICi[]): SetCisAction => ({type:CiActionEnum.SET_CIS, payload}),
    setSelectedCi: (payload:ICi): SetSelectedCiAction => ({type:CiActionEnum.SET_SELECTED_CI, payload}),
    setCisCount: (payload:number): SetCisCountAction => ({type:CiActionEnum.SET_CIS_COUNT, payload}),
    
    
    setIsError: (payload:string): SetErrorAction => ({type:CiActionEnum.SET_ERROR, payload}),
    IsLoading: (payload:boolean): SetIsLoadingAction => ({type:CiActionEnum.SET_IS_LOADING, payload}),

    
    fetchCis: (searchP: SearchPagination, where: string, ICiObjects:string[] ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(CiActionCreators.setIsError(''))
         dispatch(CiActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_cis', where , '', searchP._limit, searchP._page,  searchP._offset  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             let cis_: any[] = response.data
             let _count =  response.headers['x-total-count'] || 0
             dispatch(CiActionCreators.setCisCount(_count))
             cis_ = translateObj(cis_, ICiObjects)
             let cis:ICi[] = cis_
             dispatch(CiActionCreators.setCis(cis))
             } else
             {
              dispatch(CiActionCreators.setCis([]))   
              dispatch(CiActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
          dispatch(CiActionCreators.setCis([]))     
          dispatch(CiActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(CiActionCreators.IsLoading(false))
       }
 
     }, 
    createCi: (ci: ICi,  multi:any, loginCiId:string, router:any = {}, setPathForEmpty:any = {} ) => async (dispatch: AppDispatch) => {
      dispatch(CiActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let ci_ = JSON.parse(JSON.stringify(ci)) 
        ICiObjectsMulti.map(v => {
          delete ci_[v]
        })
        const id = ci_.id
        delete ci_.id
        ci_.last_mod_by = loginCiId
        ci_.last_mod_dt =  nowToUnix().toString()
        //update
        if(id!=='0') {
          dispatch(CiActionCreators.IsLoading(true))
          const response = await  axiosFn("put", ci_, '*', 'ci', "id" , id  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
          let cis: ICi[] = response.data
          Object.keys(multi).map(v => {
            let arr:any[] = multi[v]
          })
          } else
          {
              dispatch(CiActionCreators.setIsError(i18n.t('data_problem'))) 
          } 
        }
        else //create
        {
          dispatch(CiActionCreators.IsLoading(true))
          const responseNew = await  axiosFn("post", ci_, '*', 'ci', "id" , ''  )  
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
            let new_id: any = responseNew.data[0].id
            dispatch(CiActionCreators.setSelectedCi({} as ICi))
            setPathForEmpty(RouteNames.CIS + '/' + new_id)
            router.push(RouteNames.EMPTY)
            Object.keys(multi).map(v => {
            let arr:any[] = multi[v]
          })
          } else
          {
              dispatch(CiActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
          } 
        }  
       } catch (e) {
       dispatch(CiActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(CiActionCreators.IsLoading(false))
      }

     },
    fetchCi: (id: string) => async (dispatch: AppDispatch) => {
      try {
       dispatch(CiActionCreators.setIsError(''))
         dispatch(CiActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_cis', '' , id  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
         let multiObject = {}
             if(response.data&&!hasError)
             {
             let cis_: any[] = response.data
             cis_ = translateObj(cis_, ICiObjects)
             let ci:ICi = cis_[0]
             dispatch(CiActionCreators.setSelectedCi(ci))
             ICiObjectsMulti.map( async  m=> {
               let first = ''
               let second = ''
               let third = ""
              if(m==='tickets') {  
                first = ' * '
                second = 'V_tickets'
                third = " ci  = '" + id + "'"
              } 
                const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
                console.log('m', m);
                multiObject = { ...multiObject, [m]: response_multi.data}
                dispatch(CiActionCreators.setSelectedCi({...ci, ...multiObject}))
            })
             } else
             {
                 dispatch(CiActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
        dispatch(CiActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(CiActionCreators.IsLoading(false))
       }
     },  
     fetchCiLog: (selectedCi:ICi ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(CiActionCreators.setIsError(''))
         dispatch(CiActionCreators.IsLoading(true))
         let ci_log: ICiLog[] = []
         const response = await  axiosFn("get", '', '*', 'V_ci_log', " ci = '" + selectedCi.id + "' order by last_mod_dt desc"  , ''  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             ci_log = response.data
             let _count =  response.headers['x-total-count'] || 0
             
             ci_log = ci_log.map(e=> {
              return { ...e, name:i18n.t(e.name) }  
               }
              ) 
              
             
             const new_selectedCi = {...selectedCi, ci_log: ci_log}
             dispatch(CiActionCreators.setSelectedCi({...new_selectedCi}))
             } 
             else
             {
              dispatch(CiActionCreators.setCis([]))   
              dispatch(CiActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
          dispatch(CiActionCreators.setCis([])) 
          console.log('fetchCiLog',e);
              
          dispatch(CiActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(CiActionCreators.IsLoading(false))
       }
 
     },  

}
