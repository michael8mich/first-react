import { IOrg, IOrgObjects, IOrgObjectsMulti } from './../../../models/IOrg';
import { IUtil, IFilter, AlertPrp } from '../../../models/admin/IUtil';
import { AppDispatch } from '../..';
import { axiosFn } from '../../../axios/axios';
import { IUserObjects, IUserObjectsMulti, IUser } from '../../../models/IUser';
import { AdminActionEnum, SetUsersAction, SetErrorAction, SetIsLoadingAction, SetUtilsAction, SetFiltersAction, SetUtilsCountAction, SetUsersCountAction, SetSelectedUserAction, SetOrgsAction, SetSelectedOrgAction, SetOrgsCountAction, SetAlertAction } from './types';
import i18n from "i18next";
import { translateObj } from '../../../utils/translateObj';
import { SearchPagination } from '../../../models/ISearch';
import { nowToUnix } from '../../../utils/formManipulation';
function onlyUnique(value: string, index:number, self:string[]) {
  return self.indexOf(value) === index;
}



export const AdminActionCreators = {
    setUsers: (payload:IUser[]): SetUsersAction => ({type:AdminActionEnum.SET_USERS, payload}),
    setSelectedUser: (payload:IUser): SetSelectedUserAction => ({type:AdminActionEnum.SET_SELECTED_USER, payload}),
    setUsersCount: (payload:number): SetUsersCountAction => ({type:AdminActionEnum.SET_USERS_COUNT, payload}),
    
    setOrgs: (payload:IOrg[]): SetOrgsAction => ({type:AdminActionEnum.SET_ORGS, payload}),
    setSelectedOrg: (payload:IOrg): SetSelectedOrgAction => ({type:AdminActionEnum.SET_SELECTED_ORG, payload}),
    setOrgsCount: (payload:number): SetOrgsCountAction => ({type:AdminActionEnum.SET_ORGS_COUNT, payload}),

    setUtils: (payload:IUtil[]): SetUtilsAction => ({type:AdminActionEnum.SET_UTILS, payload}),
    setUtilsCount: (payload:number): SetUtilsCountAction => ({type:AdminActionEnum.SET_UTILS_COUNT, payload}),
    setFilters: (payload:IFilter[]): SetFiltersAction => ({type:AdminActionEnum.SET_FILTERS, payload}),
    setAlert: (payload:AlertPrp): SetAlertAction => ({type:AdminActionEnum.SET_ALERT, payload}),
    
    setIsError: (payload:string): SetErrorAction => ({type:AdminActionEnum.SET_ERROR, payload}),
    IsLoading: (payload:boolean): SetIsLoadingAction => ({type:AdminActionEnum.SET_IS_LOADING, payload}),
    
    fetchUtils: (searchP: SearchPagination, where: string ) => async (dispatch: AppDispatch) => {
      
      try {
      dispatch(AdminActionCreators.setIsError(''))
        dispatch(AdminActionCreators.IsLoading(true))
        const response = await  axiosFn("get", '', '*', 'utils', where , '', searchP._limit, searchP._page,  searchP._offset  )  
        let hasError = false;
        if(response.data["error"]) hasError = true;
            if(response.data&&!hasError)
            {
            let utils_: any[] = response.data
            let _count =  response.headers['x-total-count'] || 0
            dispatch(AdminActionCreators.setUtilsCount(_count))
            const IUserObjects:string[] = []
            //utils_ = translateObj(utils_, IUserObjects)
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
              dispatch(AdminActionCreators.setUtils([]))  
              dispatch(AdminActionCreators.setIsError(i18n.t('data_problem')))
            }   
      
       } catch (e) {
       dispatch(AdminActionCreators.setIsError(i18n.t('axios_error')))  
       dispatch(AdminActionCreators.setUtils([]))      
      } finally {
        dispatch(AdminActionCreators.IsLoading(false))
      }

     },
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

     },
    
    fetchUsers: (searchP: SearchPagination, where: string, IUserObjects:string[] ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(AdminActionCreators.setIsError(''))
         dispatch(AdminActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_contacts', where , '', searchP._limit, searchP._page,  searchP._offset  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             let users_: any[] = response.data
             let _count =  response.headers['x-total-count'] || 0
             dispatch(AdminActionCreators.setUsersCount(_count))
             users_ = translateObj(users_, IUserObjects)
             let users:IUser[] = users_
             dispatch(AdminActionCreators.setUsers(users))
             } else
             {
              dispatch(AdminActionCreators.setUsers([]))   
              dispatch(AdminActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
          dispatch(AdminActionCreators.setUsers([]))     
          dispatch(AdminActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(AdminActionCreators.IsLoading(false))
       }
 
     }, 
    createUser: (user: IUser,  multi:any, loginUserId:string ) => async (dispatch: AppDispatch) => {
      dispatch(AdminActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let user_ = JSON.parse(JSON.stringify(user)) 
        IUserObjectsMulti.map(v => {
          delete user_[v]
        })
        const id = user_.id
        delete user_.id
        user_.last_mod_by = loginUserId
        user_.last_mod_dt =  nowToUnix().toString()
        //update
        if(id!=='0') {
          dispatch(AdminActionCreators.IsLoading(true))
          const response = await  axiosFn("put", user_, '*', 'contact', "id" , id  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
          let users: IUser[] = response.data
          Object.keys(multi).map(v => {
            let arr:any[] = multi[v]
            arr.map(async m => {
              if(m.status) {
               
                if(v === 'roles')
                {
                  let json_ = {
                    parent: id,
                    parent_type: v,
                    util: m.value
                  }
                  const response = await  axiosFn("post", json_, '*', 'util_parent', "id" , ''  )  
                } else
                if(v === 'teams')
                {
                  let json_ = {
                    member: id,
                    team: m.value
                  }
                  const response = await  axiosFn("post", json_, '*', 'teammember', "id" , ''  )  
                } else
                if(v === 'members')
                {
                  let json_ = {
                    team: id,
                    member: m.value
                  }
                  const response = await  axiosFn("post", json_, '*', 'teammember', "id" , ''  )  
                }
                
              }
              else {
                if(v === 'roles')
                {
                const response = await  axiosFn("delete", '', '*', 'util_parent', "id" , m.code  )  
                } else
                if(v === 'teams' || v === 'members')
                {
                const response = await  axiosFn("delete", '', '*', 'teammember', "id" , m.code  )  
                }
              }
            })
          })
          } else
          {
              dispatch(AdminActionCreators.setIsError(i18n.t('data_problem'))) 
          } 
        }
        else //create
        {
          dispatch(AdminActionCreators.IsLoading(true))
          const responseNew = await  axiosFn("post", user_, '*', 'contact', "id" , ''  )  
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
            let new_id: any = responseNew.data[0].id
            Object.keys(multi).map(v => {
            let arr:any[] = multi[v]
            arr.map(async m => {
              if(m.status) {
                if(v === 'roles')
                {
                  let json_ = {
                    parent: new_id,
                    parent_type: v,
                    util: m.value
                  }
                  const response = await  axiosFn("post", json_, '*', 'util_parent', "id" , ''  )  
                } else
                if(v === 'teams')
                {
                  let json_ = {
                    member: new_id,
                    team: m.value
                  }
                  const response = await  axiosFn("post", json_, '*', 'teammember', "id" , ''  )  
                } else
                if(v === 'members')
                {
                  let json_ = {
                    team: new_id,
                    member: m.value
                  }
                  const response = await  axiosFn("post", json_, '*', 'teammember', "id" , ''  )  
                }
              }
            })
          })
          } else
          {
              dispatch(AdminActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
          } 
        }  
       } catch (e) {
       dispatch(AdminActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(AdminActionCreators.IsLoading(false))
      }

     },
     changeGroupMemberNotify: (notify:any[] ) => async (dispatch: AppDispatch) => {
      try { 
        notify.map(async v => {
            const response = await  axiosFn("put", {notify:v.notify}, '*', 'teammember', "id" , v.code  )        
          })
       } catch (e) {
       dispatch(AdminActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(AdminActionCreators.IsLoading(false))
      }

     },
    fetchUser: (id: string) => async (dispatch: AppDispatch) => {
      try {
       dispatch(AdminActionCreators.setIsError(''))
         dispatch(AdminActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_contacts', '' , id  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
         let multiObject = {}
             if(response.data&&!hasError)
             {
             let users_: any[] = response.data
             users_ = translateObj(users_, IUserObjects)
             let user:IUser = users_[0]
             dispatch(AdminActionCreators.setSelectedUser(user))
             IUserObjectsMulti.map( async  m=> {
               let first = ''
               let second = ''
               let third = ""
              if(m==='roles') {  
                first = ' util as value, name as label, id as code '
                second = 'V_util_parent'
                third = " parent = '" + id + "'"
              } 
              if(m==='teams') {  
                first = ' team as value, team_name as label, id as code '
                second = 'V_teammember'
                third = " member = '" + id + "'"
              } 
              if(m==='members') {  
                first = ' member as value, member_name as label, id as code, notify '
                second = 'V_teammember'
                third = " team  = '" + id + "'"
              } 
              if(m==='tickets') {  
                first = ' * '
                second = 'V_tickets'
                third = " customer  = '" + id + "'"
              } 
                const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
                console.log('m', m);
                multiObject = { ...multiObject, [m]: response_multi.data}
                dispatch(AdminActionCreators.setSelectedUser({...user, ...multiObject}))
            })
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
    fetchOrgs: (searchP: SearchPagination, where: string ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(AdminActionCreators.setIsError(''))
         dispatch(AdminActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_organizational_info', where , '', searchP._limit, searchP._page,  searchP._offset  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             let orgs_: any[] = response.data
             let _count =  response.headers['x-total-count'] || 0
             dispatch(AdminActionCreators.setOrgsCount(_count))
             orgs_ = translateObj(orgs_, IOrgObjects)
             let orgs:IOrg[] = orgs_
             dispatch(AdminActionCreators.setOrgs(orgs))
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
     createOrg: (org: IOrg, multi:any ) => async (dispatch: AppDispatch) => {
      dispatch(AdminActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let org_ = JSON.parse(JSON.stringify(org)) 
        IOrgObjectsMulti.map(v => {
          delete org_[v]
        })
        const id = org_.id
        delete org_.id
        //update
        if(id!=='0') {
          dispatch(AdminActionCreators.IsLoading(true))
          const response = await  axiosFn("put", org_, '*', 'organizational_info', "id" , id  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
          let orgs: IOrg[] = response.data
          // Object.keys(multi).map(v => {
          //   let arr:any[] = multi[v]
          //   arr.map(async m => {
          //     if(m.status) {
               
          //       if(v === 'roles')
          //       {
          //         let json_ = {
          //           parent: id,
          //           parent_type: v,
          //           util: m.value
          //         }
          //         const response = await  axiosFn("post", json_, '*', 'util_parent', "id" , ''  )  
          //       } else
          //       if(v === 'teams')
          //       {
          //         let json_ = {
          //           member: id,
          //           team: m.value
          //         }
          //         const response = await  axiosFn("post", json_, '*', 'teammember', "id" , ''  )  
          //       } else
          //       if(v === 'members')
          //       {
          //         let json_ = {
          //           team: id,
          //           member: m.value
          //         }
          //         const response = await  axiosFn("post", json_, '*', 'teammember', "id" , ''  )  
          //       }
                
          //     }
          //     else {
          //       if(v === 'roles')
          //       {
          //       const response = await  axiosFn("delete", '', '*', 'util_parent', "id" , m.code  )  
          //       } else
          //       if(v === 'teams' || v === 'members')
          //       {
          //       const response = await  axiosFn("delete", '', '*', 'teammember', "id" , m.code  )  
          //       }
          //     }
          //   })
          // })
          } else
          {
              dispatch(AdminActionCreators.setIsError(i18n.t('data_problem'))) 
          } 
        }
        else //create
        {
          dispatch(AdminActionCreators.IsLoading(true))
          const responseNew = await  axiosFn("post", org_, '*', 'organizational_info', "id" , ''  )  
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
            let new_id: any = responseNew.data[0].id
          //   Object.keys(multi).map(v => {
          //   let arr:any[] = multi[v]
          //   arr.map(async m => {
          //     if(m.status) {
          //       if(v === 'roles')
          //       {
          //         let json_ = {
          //           parent: new_id,
          //           parent_type: v,
          //           util: m.value
          //         }
          //         const response = await  axiosFn("post", json_, '*', 'util_parent', "id" , ''  )  
          //       } else
          //       if(v === 'teams')
          //       {
          //         let json_ = {
          //           member: new_id,
          //           team: m.value
          //         }
          //         const response = await  axiosFn("post", json_, '*', 'teammember', "id" , ''  )  
          //       } else
          //       if(v === 'members')
          //       {
          //         let json_ = {
          //           team: new_id,
          //           member: m.value
          //         }
          //         const response = await  axiosFn("post", json_, '*', 'teammember', "id" , ''  )  
          //       }
          //     }
          //   })
          // })
          } else
          {
              dispatch(AdminActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
          } 
        }  
       } catch (e) {
       dispatch(AdminActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(AdminActionCreators.IsLoading(false))
      }

     },
    fetchOrg: (id: string) => async (dispatch: AppDispatch) => {
      try {
       dispatch(AdminActionCreators.setIsError(''))
         dispatch(AdminActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_organizational_info', '' , id  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             let org_: any[] = response.data
             org_ = translateObj(org_, IOrgObjects)
             let org:IOrg = org_[0]
             dispatch(AdminActionCreators.setSelectedOrg(org))
            //  IOrgObjectsMulti.map( async  m=> {
            //    let first = ''
            //    let second = ''
            //    let third = ""
            //   if(m==='roles') {  
            //     first = ' util as value, name as label, id as code '
            //     second = 'V_util_parent'
            //     third = " parent = '" + id + "'"
            //   } 
            //   if(m==='teams') {  
            //     first = ' team as value, team_name as label, id as code '
            //     second = 'V_teammember'
            //     third = " member = '" + id + "'"
            //   } 
            //   if(m==='members') {  
            //     first = ' member as value, member_name as label, id as code '
            //     second = 'V_teammember'
            //     third = " team  = '" + id + "'"
            //   } 
            //     const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
            //     console.log('m', m);
            //     multiObject = { ...multiObject, [m]: response_multi.data}
            //     dispatch(AdminActionCreators.setSelectedUser({...user, ...multiObject}))
            // })
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
}
