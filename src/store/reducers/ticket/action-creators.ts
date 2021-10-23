import { ITicketCategory, ITicketCategoryObjects, ITicketCategoryObjectsMulti, ITicketPropertyObjects, ITicketPropertyObjectsMulti, ITicketPrpTpl } from './../../../models/ITicket';

import { AppDispatch } from '../..';
import { axiosFn } from '../../../axios/axios';
import { ITicketObjects, ITicketObjectsMulti, ITicket, ITicketLog } from '../../../models/ITicket';
import { TicketActionEnum, SetTicketsAction, SetErrorAction, SetIsLoadingAction, SetTicketsCountAction, SetSelectedTicketAction, SetCategoriesAction, SetSelectedCategoryAction, SetCategoriesCountAction, SetPropertiesAction, SetSelectedPropertyAction, SetPropertiesCountAction } from './types';
import i18n from "i18next";
import { translateObj } from '../../../utils/translateObj';
import { SearchPagination } from '../../../models/ISearch';
import { nowToUnix, saveFormBuild } from '../../../utils/formManipulation';
import { IUser, IUserObjects, IUserObjectsMulti } from '../../../models/IUser';
function onlyUnique(value: string, index:number, self:string[]) {
  return self.indexOf(value) === index;
}



export const TicketActionCreators = {
    setTickets: (payload:ITicket[]): SetTicketsAction => ({type:TicketActionEnum.SET_TICKETS, payload}),
    setSelectedTicket: (payload:ITicket): SetSelectedTicketAction => ({type:TicketActionEnum.SET_SELECTED_TICKET, payload}),
    setTicketsCount: (payload:number): SetTicketsCountAction => ({type:TicketActionEnum.SET_TICKETS_COUNT, payload}),
    
    setCategories: (payload:ITicketCategory[]): SetCategoriesAction => ({type:TicketActionEnum.SET_CATEGORIES, payload}),
    setSelectedCategory: (payload:ITicketCategory): SetSelectedCategoryAction => ({type:TicketActionEnum.SET_SELECTED_CATEGORY, payload}),
    setCategoriesCount: (payload:number): SetCategoriesCountAction => ({type:TicketActionEnum.SET_CATEGORIES_COUNT, payload}),

    setProperties: (payload:ITicketPrpTpl[]): SetPropertiesAction => ({type:TicketActionEnum.SET_PROPERTIES, payload}),
    setSelectedProperty: (payload:ITicketPrpTpl): SetSelectedPropertyAction => ({type:TicketActionEnum.SET_SELECTED_PROPERTY, payload}),
    setPropertiesCount: (payload:number): SetPropertiesCountAction => ({type:TicketActionEnum.SET_PROPERTIES_COUNT, payload}),

    setIsError: (payload:string): SetErrorAction => ({type:TicketActionEnum.SET_ERROR, payload}),
    IsLoading: (payload:boolean): SetIsLoadingAction => ({type:TicketActionEnum.SET_IS_LOADING, payload}),

    fetchTickets: (searchP: SearchPagination, where: string ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(TicketActionCreators.setIsError(''))
         dispatch(TicketActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_tickets', where , '', searchP._limit, searchP._page,  searchP._offset  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             let tickets_: any[] = response.data
             let _count =  response.headers['x-total-count'] || 0
             dispatch(TicketActionCreators.setTicketsCount(_count))
             tickets_ = translateObj(tickets_, ITicketObjects)
             let tickets:ITicket[] = tickets_
             dispatch(TicketActionCreators.setTickets(tickets))
             } else
             {
              dispatch(TicketActionCreators.setTickets([]))   
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
          dispatch(TicketActionCreators.setTickets([])) 
          console.log('fetchTickets',e);
              
          dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(TicketActionCreators.IsLoading(false))
       }
 
     },
    fetchTicketLog: (selectedTicket:ITicket ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(TicketActionCreators.setIsError(''))
         dispatch(TicketActionCreators.IsLoading(true))
         let tickets_log: ITicketLog[] = []
         const response = await  axiosFn("get", '', '*', 'V_ticket_log', " ticket = '" + selectedTicket.id + "' order by last_mod_dt desc"  , ''  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             tickets_log = response.data
             let _count =  response.headers['x-total-count'] || 0
             
             tickets_log = tickets_log.map(e=> {
              return { ...e, name:i18n.t(e.name) }  
               }
              ) 
              
             
             const new_selectedTicket = {...selectedTicket, tickets_log: tickets_log}
             dispatch(TicketActionCreators.setSelectedTicket({...new_selectedTicket}))
             } 
             else
             {
              dispatch(TicketActionCreators.setTickets([]))   
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
          dispatch(TicketActionCreators.setTickets([])) 
          console.log('fetchTicketLog',e);
              
          dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(TicketActionCreators.IsLoading(false))
       }
 
     },   
    createTicket: (ticket: ITicket,  multi:any, loginTicketId:string, prp: ITicketPrpTpl[] = [] ) => async (dispatch: AppDispatch) => {
      dispatch(TicketActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let ticket_ = JSON.parse(JSON.stringify(ticket)) 
        ITicketObjectsMulti.map(v => {
          delete ticket_[v]
        })
        const id = ticket_.id
        delete ticket_.id
        ticket_.last_mod_by = loginTicketId
        ticket_.last_mod_dt =  nowToUnix().toString()

        //update
        if(id!=='0') {
          dispatch(TicketActionCreators.IsLoading(true))
          const response = await  axiosFn("put", ticket_, '*', 'ticket', "id" , id  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
          let tickets: ITicket[] = response.data
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
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
          } 
        }
        else //create
        {
          dispatch(TicketActionCreators.IsLoading(true))
          ticket_.log_agent = loginTicketId
          const responseNew = await  axiosFn("post", ticket_, '*', 'ticket', "id" , ''  )  
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
            let new_id: string = responseNew.data[0].id
            let emptyTicket = {} as ITicket
            dispatch(TicketActionCreators.setSelectedTicket( {...emptyTicket, id: new_id }))
            let p_index = 1;
            prp.map(async p=> {
              let p_ = JSON.parse(JSON.stringify(p))  
              delete p_.id
              saveFormBuild(p_)
              const responseNew = await  axiosFn("post", {...p_, ticket:new_id}, '*', 'tprp', "id" , ''  ) 
              if(prp.length === p_index) {
                const responseProperties = await  axiosFn("get", {...p_, ticket:new_id}, '*', 'V_tprp', " ticket ='" + new_id + "' order by sequence " , ''  ) 
                if(responseProperties.data) {
                  dispatch(TicketActionCreators.setSelectedTicket( {...emptyTicket, ticketProperties: responseProperties.data })) 
                }
              }
              p_index ++ 
            })


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
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
          } 
        }  
       } catch (e) {
       dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))    
       console.log('createTicket',e);    
      } finally {
        dispatch(TicketActionCreators.IsLoading(false))
      }

     },
    fetchTicket: (id: string) => async (dispatch: AppDispatch) => {
      try {
        if(id==='0') return
         dispatch(TicketActionCreators.setIsError(''))
         dispatch(TicketActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_tickets', '' , id  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
         let multiObject = {}
             if(response.data&&!hasError)
             {
             let tickets_: any[] = response.data
             tickets_ = translateObj(tickets_, ITicketObjects)
             let ticket:ITicket = tickets_[0]
             dispatch(TicketActionCreators.setSelectedTicket(ticket))
             const responseProperties = await  axiosFn("get", '', '*', 'V_tprp', " ticket ='" + ticket.id + "' order by sequence " , ''  ) 
             
             if(responseProperties.data) 
               dispatch(TicketActionCreators.setSelectedTicket( {...ticket, ticketProperties: translateObj(responseProperties.data, ITicketPropertyObjects)}) )
            //  ITicketObjectsMulti.map( async  m=> {
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
            //     first = ' member as value, member_name as label, id as code, notify '
            //     second = 'V_teammember'
            //     third = " team  = '" + id + "'"
            //   } 
            //     const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
            //     console.log('m', m);
            //     multiObject = { ...multiObject, [m]: response_multi.data}
            //     dispatch(TicketActionCreators.setSelectedTicket({...ticket, ...multiObject}))
            // })
             } else
             {
                 dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
        dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))     
        console.log('fetchTicket',e);    
       } finally {
         dispatch(TicketActionCreators.IsLoading(false))
       }
     },   
    getCustomerInfo: (selectedTicket:ITicket, id: string) => async (dispatch: AppDispatch) => {
       try{ 
        const response = await  axiosFn("get", '', '*', 'V_contacts', '' , id  )  
        let hasError = false;
        if(response.data["error"]) hasError = true;

            if(response.data&&!hasError)
            {
            let users_: any[] = response.data
            users_ = translateObj(users_, IUserObjects)
            let multiObject = {}
            let user:IUser = users_[0]
            const new_selectedTicket = {...selectedTicket, customer_info: user}
             dispatch(TicketActionCreators.setSelectedTicket({...new_selectedTicket}))
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
               third = " customer  = '" + id + "' AND active = 1 and id<>'" + selectedTicket.id + "'"
             } 
               const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
               
             let mObj = response_multi.data
             if(m==='tickets') mObj = translateObj(mObj, ITicketObjects)

               multiObject = { ...multiObject, [m]: mObj}
             
               let user___ = {...user, ...multiObject }  
               dispatch(TicketActionCreators.setSelectedTicket({...new_selectedTicket, customer_info:  user___}))
           })
            }
          } catch (e) {
            dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))        
          } finally {
            dispatch(TicketActionCreators.IsLoading(false))
          }
    },
    CleanSelectedTicket: () => async (dispatch: AppDispatch) => {
      let emptyTicket = {} as ITicket
      dispatch(TicketActionCreators.setSelectedTicket(emptyTicket))
    },
    createTicketActivity: (ticketLog: ITicketLog, loginTicketId:string ) => async (dispatch: AppDispatch) => {
      dispatch(TicketActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let ticketLog_ = JSON.parse(JSON.stringify(ticketLog)) 

        const id = ticketLog_.id
        delete ticketLog_.id
        ticketLog_.last_mod_by = loginTicketId
        ticketLog_.last_mod_dt =  nowToUnix().toString()
        //create
        {
          dispatch(TicketActionCreators.IsLoading(true))
          const responseNew = await  axiosFn("post", ticketLog_, '*', 'ticket_log', "id" , ''  )  
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
            let new_id: string = responseNew.data[0].id
            console.log('new_id',new_id);
            
          } else
          {
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
          } 
        }  
       } catch (e) {
       dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))    
       console.log('createTicketActivity',e);    
      } finally {
        dispatch(TicketActionCreators.IsLoading(false))
      }

     },
   //------------------
    fetchCategories: (searchP: SearchPagination, where: string ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(TicketActionCreators.setIsError(''))
         dispatch(TicketActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_ticket_category', where , '', searchP._limit, searchP._page,  searchP._offset  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             let tickets_category_: any[] = response.data
             let _count =  response.headers['x-total-count'] || 0
             dispatch(TicketActionCreators.setCategoriesCount(_count))
             tickets_category_ = translateObj(tickets_category_, ITicketCategoryObjects)
             let tickets_category:ITicketCategory[] = tickets_category_
             dispatch(TicketActionCreators.setCategories(tickets_category))
             } else
             {
              dispatch(TicketActionCreators.setCategories([]))   
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
          dispatch(TicketActionCreators.setCategories([])) 
          console.log('fetchCategories',e);
              
          dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(TicketActionCreators.IsLoading(false))
       }
 
     },
    createCategory: (category: ITicketCategory,  multi:any, loginTicketId:string ) => async (dispatch: AppDispatch) => {
      dispatch(TicketActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let category_ = JSON.parse(JSON.stringify(category)) 
        ITicketCategoryObjectsMulti.map(v => {
          delete category_[v]
        })
        const id = category_.id
        delete category_.id
        category_.last_mod_by = loginTicketId
        category_.last_mod_dt =  nowToUnix().toString()
        //update
        if(id!=='0') {
          dispatch(TicketActionCreators.IsLoading(true))
          const response = await  axiosFn("put", category_, '*', 'ticket_category', "id" , id  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
          let category: ITicketCategory[] = response.data
          Object.keys(multi).map(v => {
            let arr:any[] = multi[v]
            arr.map(async m => {
              if(m.status) {
               
                if(v === 'ticket_types')
                {
                  let json_ = {
                    parent: id,
                    parent_type: v,
                    util: m.value
                  }
                  const response = await  axiosFn("post", json_, '*', 'util_parent', "id" , ''  )  
                } 
              }
              else {
                if(v === 'ticket_types')
                {
                const response = await  axiosFn("delete", '', '*', 'util_parent', "id" , m.code  )  
                } 
              }
            })
          })
          } else
          {
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
          } 
        }
        else //create
        {
          dispatch(TicketActionCreators.IsLoading(true))
          const responseNew = await  axiosFn("post", category_, '*', 'ticket_category', "id" , ''  )  
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
            let new_id: string = responseNew.data[0].id
            let emptyCategory = {} as ITicketCategory
            dispatch(TicketActionCreators.setSelectedCategory( {...emptyCategory, id: new_id }))
            
            Object.keys(multi).map(v => {
            let arr:any[] = multi[v]
            arr.map(async m => {
              if(m.status) {
                if(v === 'ticket_types')
                {
                  let json_ = {
                    parent: new_id,
                    parent_type: v,
                    util: m.value
                  }
                  const response = await  axiosFn("post", json_, '*', 'util_parent', "id" , ''  )  
                } 
              }
            })
          })
          } else
          {
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
          } 
        }  
       } catch (e) {
       dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))    
       console.log('createCategory',e);    
      } finally {
        dispatch(TicketActionCreators.IsLoading(false))
      }

     }, 
    fetchCategory: (id: string) => async (dispatch: AppDispatch) => {
      try {
        if(id==='0') return
         dispatch(TicketActionCreators.setIsError(''))
         dispatch(TicketActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_ticket_category', '' , id  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
         let multiObject = {}
             if(response.data&&!hasError)
             {
             let category_: any[] = response.data
             category_ = translateObj(category_, ITicketCategoryObjects)
             let category:ITicketCategory = category_[0]
             dispatch(TicketActionCreators.setSelectedCategory(category))
             ITicketCategoryObjectsMulti.map( async  m=> {
               let first = ''
               let second = ''
               let third = ""
              if(m==='ticket_types') {  
                first = ' util as value, name as label, id as code '
                second = 'V_util_parent'
                third = " parent = '" + id + "'"
              } 
             
                const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
                console.log('m', m);
                multiObject = { ...multiObject, [m]: response_multi.data}
                dispatch(TicketActionCreators.setSelectedCategory({...category, ...multiObject}))
            })
             } else
             {
                 dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
        dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))     
        console.log('fetchCategory',e);    
       } finally {
         dispatch(TicketActionCreators.IsLoading(false))
       }
     }, 
   //------------------
    fetchProperties: (categoryId: string ) => async (dispatch: AppDispatch) => {
      try {
      dispatch(TicketActionCreators.setIsError(''))
        dispatch(TicketActionCreators.IsLoading(true))
        const response = await  axiosFn("get", '', '*', 'V_tprptpls', " category = '" + categoryId + "' order by sequence" )  
        let hasError = false;
        if(response.data["error"]) hasError = true;
            if(response.data&&!hasError)
            {
            let properties_: any[] = response.data
            properties_ = translateObj(properties_, ITicketPropertyObjects)
            let properties:ITicketPrpTpl[] = properties_
            // properties.map(o=>{
            //   if(o.code)
            // })

            dispatch(TicketActionCreators.setProperties(properties))
            } else
            {
              dispatch(TicketActionCreators.setProperties([]))   
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
            }   
      
        } catch (e) {
          dispatch(TicketActionCreators.setProperties([])) 
          console.log('fetchProperties',e);
              
          dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(TicketActionCreators.IsLoading(false))
      }

    },
    createProperty: (property: ITicketPrpTpl,  multi:any, loginTicketId:string ) => async (dispatch: AppDispatch) => {
      dispatch(TicketActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let property_ = JSON.parse(JSON.stringify(property)) 
        ITicketCategoryObjectsMulti.map(v => {
          delete property_[v]
        })
        const id = property_.id
        delete property_.id
        property_.last_mod_by = loginTicketId
        property_.last_mod_dt =  nowToUnix().toString()
        //update
        if(id!=='0') {
          dispatch(TicketActionCreators.IsLoading(true))
          const response = await  axiosFn("put", property_, '*', 'tprptpl', "id" , id  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
          let property: ITicketPrpTpl[] = response.data
          // Object.keys(multi).map(v => {
          //   let arr:any[] = multi[v]
          //   arr.map(async m => {
          //     if(m.status) {
              
          //       if(v === 'ticket_types')
          //       {
          //         let json_ = {
          //           parent: id,
          //           parent_type: v,
          //           util: m.value
          //         }
          //         const response = await  axiosFn("post", json_, '*', 'util_parent', "id" , ''  )  
          //       } 
          //     }
          //     else {
          //       if(v === 'ticket_types')
          //       {
          //       const response = await  axiosFn("delete", '', '*', 'util_parent', "id" , m.code  )  
          //       } 
          //     }
          //   })
          // })
          } else
          {
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
          } 
        }
        else //create
        {
          dispatch(TicketActionCreators.IsLoading(true))
          const responseNew = await  axiosFn("post", property_, '*', 'tprptpl', "id" , ''  )  
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
            let new_id: string = responseNew.data[0].id
            let emptyProperty = {} as ITicketPrpTpl
            dispatch(TicketActionCreators.setSelectedProperty( {...emptyProperty, id: new_id }))
            
          //   Object.keys(multi).map(v => {
          //   let arr:any[] = multi[v]
          //   arr.map(async m => {
          //     if(m.status) {
          //       if(v === 'ticket_types')
          //       {
          //         let json_ = {
          //           parent: new_id,
          //           parent_type: v,
          //           util: m.value
          //         }
          //         const response = await  axiosFn("post", json_, '*', 'util_parent', "id" , ''  )  
          //       } 
          //     }
          //   })
          // })
          } else
          {
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
          } 
        }  
      } catch (e) {
      dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))    
      console.log('createProperty',e);    
      } finally {
        dispatch(TicketActionCreators.IsLoading(false))
      }

    }, 
    fetchProperty: (id: string) => async (dispatch: AppDispatch) => {
      try {
        if(id==='0') return
        dispatch(TicketActionCreators.setIsError(''))
        dispatch(TicketActionCreators.IsLoading(true))
        const response = await  axiosFn("get", '', '*', 'V_tprptpls', '' , id  )
        let hasError = false;
        if(response.data["error"]) hasError = true;
        let multiObject = {}
            if(response.data&&!hasError)
            {
            let property_: any[] = response.data
            property_ = translateObj(property_, ITicketPropertyObjects)
            let property:ITicketPrpTpl = property_[0]
            dispatch(TicketActionCreators.setSelectedProperty(property))
            //  ITicketPropertyObjectsMulti.map( async  m=> {
            //    let first = ''
            //    let second = ''
            //    let third = ""
            //   if(m==='ticket_types') {  
            //     first = ' util as value, name as label, id as code '
            //     second = 'V_util_parent'
            //     third = " parent = '" + id + "'"
            //   } 
            
            //     const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
            //     console.log('m', m);
            //     multiObject = { ...multiObject, [m]: response_multi.data}
            //     dispatch(TicketActionCreators.setSelectedCategory({...category, ...multiObject}))
            // })
            } else
            {
                dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
            }   
      
        } catch (e) {
        dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))     
        console.log('fetchProperty',e);    
      } finally {
        dispatch(TicketActionCreators.IsLoading(false))
      }
    },   
    
}
