import { IUtil, IFilter } from '../../../models/admin/IUtil';
import { AppDispatch } from '../..';
import { axiosFn } from '../../../axios/axios';
import { IUser } from '../../../models/IUser';
import { AdminActionEnum, SetUsersAction, SetErrorAction, SetIsLoadingAction, SetUtilsAction, SetFiltersAction, SetUtilsCountAction } from './types';
import i18n from "i18next";
import { translateObj } from '../../../utils/translateObj';
import { SearchPagination } from '../../../models/ISearch';
function onlyUnique(value: string, index:number, self:string[]) {
  return self.indexOf(value) === index;
}



export const AdminActionCreators = {
    setGuests: (payload:IUser[]): SetUsersAction => ({type:AdminActionEnum.SET_USERS, payload}),
    setUtils: (payload:IUtil[]): SetUtilsAction => ({type:AdminActionEnum.SET_UTILS, payload}),
    setUtilsCount: (payload:number): SetUtilsCountAction => ({type:AdminActionEnum.SET_UTILS_COUNT, payload}),
    setFilters: (payload:IFilter[]): SetFiltersAction => ({type:AdminActionEnum.SET_FILTERS, payload}),
    setIsError: (payload:string): SetErrorAction => ({type:AdminActionEnum.SET_ERROR, payload}),
    IsLoading: (payload:boolean): SetIsLoadingAction => ({type:AdminActionEnum.SET_IS_LOADING, payload}),
    fetchUtils: (searchP: SearchPagination ) => async (dispatch: AppDispatch) => {
     try {
        dispatch(AdminActionCreators.IsLoading(true))
        const where = ``
        const response = await  axiosFn("get", '', '*', 'utils', where , '', searchP._limit, searchP._page,  searchP._offset  )  
        let hasError = false;
        if(response.data["error"]) hasError = true;
            if(response.data&&!hasError)
            {
            let utils_: any[] = response.data
            let _count =  response.headers['x-total-count'] || 0
            dispatch(AdminActionCreators.setUtilsCount(_count))
            const IObjects:string[] = []
            //utils_ = translateObj(utils_, IObjects)
            //let utils:IUtil[] = utils_.filter(ev=> ev.active === 1 )
            let utils:IUtil[] = utils_
            let types:string[] = []
            
              utils.map(u => {
                types.push(u.type)
              })
              types = Array.from(new Set(types)); 
              let filters: IFilter[] = []
              types.map(t=>{
                filters.push({text: t, value: t })
              })
              console.log('types',types);
              console.log('filters',filters);
              
      
              dispatch(AdminActionCreators.setFilters(filters))
            dispatch(AdminActionCreators.setUtils(utils))
            } else
            {
                dispatch(AdminActionCreators.setIsError(i18n.t('data_problem')))
            }   
      
       } catch (e) {
       dispatch(AdminActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(AdminActionCreators.IsLoading(false))
      }

     },
    //  fetchGuests: (search: string ) => async (dispatch: AppDispatch) => {
    //   try {
    //      dispatch(EventActionCreators.IsLoading(true))
 
    //      const where = ` name like '%${search}%'  `
    //      const response = await  axiosFn("get", '', '*', 'contact', where , ''  )  
    
    //      let hasError = false;
    //      if(response.data["error"]) hasError = true;
    //          if(response.data&&!hasError)
    //          {
    //          let users: IUser[] = response.data
    //          console.log('users',users);
    //          dispatch(EventActionCreators.setGuests(users))
    //          } else
    //          {
    //              dispatch(EventActionCreators.setIsError(i18n.t('data_problem'))) 
    //          }   
       
    //     } catch (e) {
    //     dispatch(EventActionCreators.setIsError(i18n.t('axios_error')))        
    //    } finally {
    //      dispatch(EventActionCreators.IsLoading(false))
    //    }
 
    //  }, 
     createUtil: (util: IUtil ) => async (dispatch: AppDispatch) => {
      dispatch(AdminActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let util_ = JSON.parse(JSON.stringify(util)) 
        delete util_.id
        //update
        if(util.id) {
          dispatch(AdminActionCreators.IsLoading(true))
          const response = await  axiosFn("put", util_, '*', 'utils', "id" , util.id  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
          let utils: IUtil[] = response.data
          } else
          {
              dispatch(AdminActionCreators.setIsError(i18n.t('data_problem'))) 
          } 
        }
        else //create
        {
          dispatch(AdminActionCreators.IsLoading(true))
          const responseNew = await  axiosFn("post", util, '*', 'utils', "id" , ''  )  
          debugger
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
          let utils: IUtil[] = responseNew.data
          } else
          {
              dispatch(AdminActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
              
          } 
  
        dispatch(AdminActionCreators.IsLoading(true))
        const response = await  axiosFn("post", util_, '*', 'utils', "id" , ''  )  
        }  
      
       } catch (e) {
       dispatch(AdminActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(AdminActionCreators.IsLoading(false))
      }

     }
}