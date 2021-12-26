
import { ITicketCategory, ITicketCategoryObjects, ITicketCategoryObjectsMulti, ITicketPropertyObjects, ITicketPropertyObjectsMulti, ITicketPrpTpl, ITicketWfObjects, ITicketWfTpl, WF_STATUS_PEND, WF_STATUS_WAIT, WF_TASK_END_GROUP, WF_TASK_START_GROUP, WF_LOG_PEND, WF_STATUS_COMPLETE, ITicketAllWfsObjects, ITicketsAllWfs } from './../../../models/ITicket';

import { AppDispatch } from '../..';
import { axiosFn } from '../../../axios/axios';
import { ITicketObjects, ITicketObjectsMulti, ITicket, ITicketLog } from '../../../models/ITicket';
import { TicketActionEnum, SetTicketsAction, SetErrorAction, SetIsLoadingAction, SetTicketsCountAction, SetSelectedTicketAction, SetCategoriesAction, SetSelectedCategoryAction, SetCategoriesCountAction, SetPropertiesAction, SetSelectedPropertyAction, SetPropertiesCountAction, SetSelectedTicketPropertiesAction, SetCopiedTicketAction, SetSelectedTicketWfsAction, SetWfsAction, SetSelectedWfAction, SetWfsCountAction, SetTicketsAllWfsAction, SetTicketsAllWfsCountAction, SetSelectedWfIdAction } from './types';
import i18n from "i18next";
import { translateObj } from '../../../utils/translateObj';
import { SearchPagination } from '../../../models/ISearch';
import { nowToUnix, saveFormBuild } from '../../../utils/formManipulation';
import { IUser, IUserObjects, IUserObjectsMulti } from '../../../models/IUser';
import { useAction } from '../../../hooks/useAction';
import { AdminActionCreators } from '../admin/action-creators';
import { notify } from '../../../utils/notificatinSend';
import { INotification } from '../../../models/INotification';
import { ICiObjects } from '../../../models/ICi';
import { logWfManipulation } from '../../../utils/logCreateor';

function onlyUnique(value: string, index:number, self:string[]) {
  return self.indexOf(value) === index;
}



export const TicketActionCreators = {
    setTickets: (payload:ITicket[]): SetTicketsAction => ({type:TicketActionEnum.SET_TICKETS, payload}),
    setSelectedTicket: (payload:ITicket): SetSelectedTicketAction => ({type:TicketActionEnum.SET_SELECTED_TICKET, payload}),
    setCopiedTicket: (payload: ITicket): SetCopiedTicketAction => ({type:TicketActionEnum.SET_COPIED_TICKET, payload}),
    setTicketsCount: (payload:number): SetTicketsCountAction => ({type:TicketActionEnum.SET_TICKETS_COUNT, payload}),

    setTicketsAllWfs: (payload:ITicketsAllWfs[]): SetTicketsAllWfsAction => ({type:TicketActionEnum.SET_TICKETS_ALL_WFS, payload}),
    setTicketsAllWfsCount: (payload:number): SetTicketsAllWfsCountAction => ({type:TicketActionEnum.SET_TICKETS_ALL_WFS_COUNT, payload}),
    setSelectedWfsId: (payload:string): SetSelectedWfIdAction => ({type:TicketActionEnum.SET_SELECTED_WF_ID, payload}),

    SetSelectedTicketProperties: (payload:ITicketPrpTpl[]): SetSelectedTicketPropertiesAction => ({type:TicketActionEnum.SET_SELECTED_TICKET_PROPERTIES, payload}),
    SetSelectedTicketWfs: (payload:ITicketWfTpl[]): SetSelectedTicketWfsAction => ({type:TicketActionEnum.SET_SELECTED_TICKET_WFS, payload}),
    
    
    setCategories: (payload:ITicketCategory[]): SetCategoriesAction => ({type:TicketActionEnum.SET_CATEGORIES, payload}),
    setSelectedCategory: (payload:ITicketCategory): SetSelectedCategoryAction => ({type:TicketActionEnum.SET_SELECTED_CATEGORY, payload}),
    setCategoriesCount: (payload:number): SetCategoriesCountAction => ({type:TicketActionEnum.SET_CATEGORIES_COUNT, payload}),

    setProperties: (payload:ITicketPrpTpl[]): SetPropertiesAction => ({type:TicketActionEnum.SET_PROPERTIES, payload}),
    setSelectedProperty: (payload:ITicketPrpTpl): SetSelectedPropertyAction => ({type:TicketActionEnum.SET_SELECTED_PROPERTY, payload}),
    setPropertiesCount: (payload:number): SetPropertiesCountAction => ({type:TicketActionEnum.SET_PROPERTIES_COUNT, payload}),

    setWfs: (payload:ITicketWfTpl[]): SetWfsAction => ({type:TicketActionEnum.SET_WFS, payload}),
    setSelectedWf: (payload:ITicketWfTpl): SetSelectedWfAction => ({type:TicketActionEnum.SET_SELECTED_WF, payload}),
    setWfsCount: (payload:number): SetWfsCountAction => ({type:TicketActionEnum.SET_WFS_COUNT, payload}),

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
    fetchTicketNotifications: (selectedTicket:ITicket ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(TicketActionCreators.setIsError(''))
         dispatch(TicketActionCreators.IsLoading(true))
         let tickets_notifications: INotification[] = []
         const response = await  axiosFn("get", '', '*', 'notification_sended', " ticket = '" + selectedTicket.id + "' order by create_date desc"  , ''  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
              tickets_notifications = response.data
             let _count =  response.headers['x-total-count'] || 0
             
            //  tickets_notification = tickets_notification.map(e=> {
            //   return { ...e, name:i18n.t(e.name) }  
            //    }
            //   ) 
              
             
             const new_selectedTicket = {...selectedTicket, tickets_notifications: tickets_notifications}
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
     fetchTicketWfs: (selectedTicket:ITicket ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(TicketActionCreators.setIsError(''))
         dispatch(TicketActionCreators.IsLoading(true))
         let ticketWfs: ITicketWfTpl[] = []
         const response = await  axiosFn("get", '', '*', 'V_wfs', " ticket = '" + selectedTicket.id + "' order by sequence"  , ''  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
              ticketWfs = response.data
              let _count =  response.headers['x-total-count'] || 0
              ticketWfs = translateObj(ticketWfs, [...ITicketWfObjects, 'status', 'ticket'])
            //  tickets_wfs = tickets_log.map(e=> {
            //   return { ...e, name:i18n.t(e.name) }  
            //    }
            //   ) 
              
             
             const new_selectedTicket = {...selectedTicket, ticketWfs: ticketWfs}
             dispatch(TicketActionCreators.setSelectedTicket({...new_selectedTicket}))
             } 
             else
             {
              dispatch(TicketActionCreators.setTickets([]))   
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
             }   
       
        } catch (e) {
          dispatch(TicketActionCreators.setTickets([])) 
          console.log('fetchticketWfs',e);
              
          dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(TicketActionCreators.IsLoading(false))
       }
 
     },   
    createTicket: (ticket: ITicket,  multi:any, loginTicketId:string, prp: ITicketPrpTpl[] = [], values:any = {}, selectedTicket:ITicket = {} as ITicket, notificationsAll:INotification[] = [] as INotification[], router:any = {}, setPathForEmpty:any = {}) => async (dispatch: AppDispatch) => {
      dispatch(TicketActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let ticket_ = JSON.parse(JSON.stringify(ticket)) 
        let ticket_notify = JSON.parse(JSON.stringify(ticket)) 
        ITicketObjectsMulti.map(v => {
          delete ticket_[v]
        })
        const id = ticket_.id
        const name = ticket_.name
        delete ticket_.name
        delete ticket_.id
        ticket_.last_mod_by = loginTicketId
        ticket_.last_mod_dt =  nowToUnix().toString()

        const categoryChanged = ticket_?.categoryChanged || false
        delete ticket_.categoryChanged

        //update
        if(id!=='0') {
          dispatch(TicketActionCreators.IsLoading(true))
          const response = await  axiosFn("put", ticket_, '*', 'ticket', "id" , id  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
            dispatch(AdminActionCreators.setAlert({
              type: 'success' ,
              message: i18n.t('ticket') + ' ' + (id === '0' ? i18n.t('created_success') : i18n.t('updated_success')),
              closable: true ,
              showIcon: true ,
              visible: true,
              autoClose: 10 
            }))
           
            
          notify(false, values, selectedTicket, notificationsAll )  
          let ticket: ITicket[] = response.data
          if(prp.length>0) {
            let p_index = 1;
            prp.map(async p=> {
              let p_ = JSON.parse(JSON.stringify(p))  
              delete p_.id
              saveFormBuild(p_)
              if(p.ticket)
                await  axiosFn("put", {...p_}, '*', 'tprp', "id" , p.id  ) 
              else
              {
                await  axiosFn("post", {...p_, ticket:id}, '*', 'tprp', "id" , ''  )
              }
              
              if(prp.length === p_index) {
                const responseProperties = await  axiosFn("get", {...p_, ticket:id}, '*', 'V_tprp', " ticket ='" + id + "' order by sequence " , ''  ) 
                if(responseProperties.data) {
                  //dispatch(TicketActionCreators.setSelectedTicket( {...ticket[0], id:id, name:name, ticketProperties: translateObj(responseProperties.data, ITicketPropertyObjects)  })) 
                  dispatch(TicketActionCreators.SetSelectedTicketProperties(translateObj(responseProperties.data, ITicketPropertyObjects)))
                }
              }
              p_index ++ 
            })
            //--wfs
            if(categoryChanged) {
              const responseWfs = await  axiosFn("get", '',  'assignee,deleteable,description,name,sequence,task,tcategory,team,ci,team_name,assignee_name,task_name', 'V_wftpls', " tcategory ='" + ticket_.category + "' order by sequence " , ''  ) 
              if(responseWfs?.data?.length!==0) {
                
                let wftpls_:any[] = responseWfs.data
                let prev_wf = {} as any
                let start_group = false
                let end_group = false
                wftpls_.map( async (w, index)  => {
                   let team_name = w.team_name || ''
                   let assignee_name = w.assignee_name || ''
                   let task_name = w.task_name || ''
                   delete  w.team_name
                   delete w.assignee_name
                   delete w.task_name
                    prev_wf = w
                    if(w.task===WF_TASK_START_GROUP)
                    start_group = true
                    if(w.task===WF_TASK_END_GROUP)
                    start_group = false
                    w.ticket = id
                    if(index===0 || start_group){
                      w.status = WF_STATUS_PEND.value
                      w.start_dt = nowToUnix()
                    }
                    else
                    w.status = WF_STATUS_WAIT.value
                    w.created_dt =  nowToUnix().toString()
                    const responseNewWf = await  axiosFn("post", w, '*', 'wf', "id" , ''  )  
                    if(w.status === WF_STATUS_PEND.value) {
                        //notify(true, values, {...selectedTicket, id:new_id }, notificationsAll ) 
                        logWfManipulation({...w, team: {value:team_name,label:team_name}, assignee: {value:assignee_name,label:assignee_name}, 
                           task: {value:task_name,label:task_name, sequence: w.sequence}}, 
                          WF_LOG_PEND, id, loginTicketId) 
                    }
                    
                })
              }
            }
          
          } else
          dispatch(TicketActionCreators.SetSelectedTicketProperties(translateObj([], ITicketPropertyObjects)))
          
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
            dispatch(AdminActionCreators.setAlert({
              type: 'success' ,
              message:  i18n.t('ticket') + ' ' + (id === '0' ? i18n.t('created_success') : i18n.t('updated_success')),
              closable: true ,
              showIcon: true ,
              visible: true,
              autoClose: 10 
            }))
            
           
            let new_id: string = responseNew.data[0].id
            notify(true, values, {...selectedTicket, id:new_id }, notificationsAll )  
            let init_values:any = { "name": 'Create New', "ticket": new_id , old_value: '', new_value: '' }
            init_values.last_mod_by = loginTicketId
            init_values.last_mod_dt =  nowToUnix().toString()
            const responseNewLog = await  axiosFn("post", init_values, '*', 'ticket_log', "id" , ''  )  
                    
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
                  dispatch(TicketActionCreators.SetSelectedTicketProperties(translateObj(responseProperties.data, ITicketPropertyObjects)))
                  //dispatch(TicketActionCreators.setSelectedTicket( {...emptyTicket, ticketProperties: translateObj(responseProperties.data, ITicketPropertyObjects)  })) 
                }
              }
              p_index ++ 
            })
            //--wfs
            const responseWfs = await  axiosFn("get", '',  'assignee,deleteable,description,name,sequence,task,tcategory,team,ci,team_name,assignee_name,task_name', 'V_wftpls', " tcategory ='" + ticket_.category + "' order by sequence " , ''  ) 
            if(responseWfs?.data?.length!==0) {
              let wftpls_:any[] = responseWfs.data
              let prev_wf = {} as any
              let start_group = false
              wftpls_.map( async (w, index)  => {
                 let team_name = w.team_name || ''
                 let assignee_name = w.assignee_name || ''
                 let task_name = w.task_name || ''
                 delete  w.team_name
                 delete w.assignee_name
                 delete w.task_name
                  prev_wf = w
                  if(w.task===WF_TASK_START_GROUP.value)
                  start_group = true
                  if(w.task===WF_TASK_END_GROUP.value)
                  start_group = false
                  w.ticket = new_id
                  if(index===0 || start_group){
                    if(w.task===WF_TASK_START_GROUP.value)
                    w.status = WF_STATUS_COMPLETE.value
                    else
                    w.status = WF_STATUS_PEND.value
                    w.start_dt = nowToUnix()
                  }
                  else
                  w.status = WF_STATUS_WAIT.value
                  w.created_dt =  nowToUnix().toString()
                  const responseNewWf = await  axiosFn("post", w, '*', 'wf', "id" , ''  )  
                  if(w.status === WF_STATUS_PEND.value) {
                      //notify(true, values, {...selectedTicket, id:new_id }, notificationsAll ) 
                      logWfManipulation({...w, team: {value:team_name,label:team_name}, assignee: {value:assignee_name,label:assignee_name}, 
                         task: {value:task_name,label:task_name, sequence: w.sequence}}, 
                        WF_LOG_PEND, new_id, loginTicketId) 
                  }
                  
              })
            }
           

          } else
          {
            dispatch(AdminActionCreators.setAlert({
              type: 'warning' ,
              message: i18n.t('data_problem'),
              closable: true ,
              showIcon: true ,
              visible: true,
              autoClose: 10 
            }))
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
          } 
        }  
       } catch (e) {
       dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))    
       dispatch(AdminActionCreators.setAlert({
        type: 'warning' ,
        message: i18n.t('axios_error'),
        closable: true ,
        showIcon: true ,
        visible: true,
        autoClose: 10 
      }))
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
             let prp:any[] = []
             let ticketWfs:any[] = [] 
             const responseProperties = await  axiosFn("get", '', '*', 'V_tprp', " ticket ='" + ticket.id + "' order by sequence " , ''  ) 
             if(responseProperties.data) {
              prp = translateObj(responseProperties.data, ITicketPropertyObjects)
              dispatch(TicketActionCreators.setSelectedTicket( {...ticket, ticketProperties: prp}) )
             }
             

             const responseWfs = await  axiosFn("get", '', '*', 'V_wfs', " ticket = '" + ticket.id + "' order by sequence"  , ''  )
             if(responseWfs.data) 
             {
              ticketWfs = responseWfs.data
              let _count =  responseWfs.headers['x-total-count'] || 0
              ticketWfs = translateObj(ticketWfs, [...ITicketWfObjects, 'status', 'ticket'])
              dispatch(TicketActionCreators.setSelectedTicket( {...ticket, ticketWfs: ticketWfs}) )
             }

              
            
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
             if(m==='cis') {  
              first = ' * '
              second = 'V_cis'
              third = " ci_user  = '" + id + "' AND active = 1 "
            } 
               const response_multi = await  axiosFn("get", '', first, second,  third , ''  )  
               
             let mObj = response_multi.data
             if(m==='tickets') mObj = translateObj(mObj, ITicketObjects)
             if(m==='cis') mObj = translateObj(mObj, ICiObjects)
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
            dispatch(AdminActionCreators.setAlert({
              type: 'success' ,
              message: i18n.t('log') + ' ' + i18n.t('updated_success'),
              closable: true ,
              showIcon: true ,
              visible: true,
              autoClose: 10 
            }))
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
    fetchTicketsAllWfs: (searchP: SearchPagination, where: string ) => async (dispatch: AppDispatch) => {
      try {
       dispatch(TicketActionCreators.setIsError(''))
         dispatch(TicketActionCreators.IsLoading(true))
         const response = await  axiosFn("get", '', '*', 'V_allWfs', where , '', searchP._limit, searchP._page,  searchP._offset  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             let ticketsAllWfs_: any[] = response.data
             let _count =  response.headers['x-total-count'] || 0
             dispatch(TicketActionCreators.setTicketsAllWfsCount(_count))
             ticketsAllWfs_ = translateObj(ticketsAllWfs_, ITicketAllWfsObjects)
             let ticketsAllWfs:ITicketsAllWfs[] = ticketsAllWfs_
             dispatch(TicketActionCreators.setTicketsAllWfs(ticketsAllWfs))
             } else
             {
              dispatch(TicketActionCreators.setTicketsAllWfs([]))   
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
        const response = await  axiosFn("get", '', '*, 1 as visible ', 'V_tprptpls', " category = '" + categoryId + "' order by sequence" )  
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
    //------------------
    fetchWfs: (categoryId: string ) => async (dispatch: AppDispatch) => {
      try {
      dispatch(TicketActionCreators.setIsError(''))
        dispatch(TicketActionCreators.IsLoading(true))
        const response = await  axiosFn("get", '', '*, 1 as visible ', 'V_wftpls', " tcategory = '" + categoryId + "' order by sequence" )  
        let hasError = false;
        if(response.data["error"]) hasError = true;
            if(response.data&&!hasError)
            {
            let wf_: any[] = response.data
            wf_ = translateObj(wf_, ITicketWfObjects)
            let wf:ITicketWfTpl[] = wf_
            // properties.map(o=>{
            //   if(o.code)
            // })
            
            dispatch(TicketActionCreators.setWfs(wf))
            } else
            {
              dispatch(TicketActionCreators.setProperties([]))   
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
            }   
      
        } catch (e) {
          dispatch(TicketActionCreators.setProperties([])) 
          console.log('fetchWfs',e);
              
          dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(TicketActionCreators.IsLoading(false))
      }

    },
    createWf: (wf: ITicketWfTpl,  multi:any, loginTicketId:string ) => async (dispatch: AppDispatch) => {
      dispatch(TicketActionCreators.setIsError(''))
      try { 
        let hasError = false;
        let wf_ = JSON.parse(JSON.stringify(wf)) 
        ITicketCategoryObjectsMulti.map(v => {
          delete wf_[v]
        })
        const id = wf_.id
        delete wf_.id
        wf_.last_mod_by = loginTicketId
        wf_.last_mod_dt =  nowToUnix().toString()
        //update
        if(id!=='0') {
          dispatch(TicketActionCreators.IsLoading(true))
          const response = await  axiosFn("put", wf_, '*', 'wftpl', "id" , id  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
          let wf: ITicketWfTpl[] = response.data
          } else
          {
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
          } 
        }
        else //create
        {
          dispatch(TicketActionCreators.IsLoading(true))
          const responseNew = await  axiosFn("post", wf_, '*', 'wftpl', "id" , ''  )  
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
            let new_id: string = responseNew.data[0].id
            let emptyWf = {} as ITicketWfTpl
            dispatch(TicketActionCreators.setSelectedWf( {...emptyWf, id: new_id }))
            
          } else
          {
              dispatch(TicketActionCreators.setIsError(i18n.t('data_problem'))) 
              console.log('Real Error', responseNew.data["error"]);
          } 
        }  
      } catch (e) {
      dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))    
      console.log('createWf',e);    
      } finally {
        dispatch(TicketActionCreators.IsLoading(false))
      }

    }, 
    fetchWf: (id: string) => async (dispatch: AppDispatch) => {
      try {
        if(id==='0') return
        dispatch(TicketActionCreators.setIsError(''))
        dispatch(TicketActionCreators.IsLoading(true))
        const response = await  axiosFn("get", '', '*', 'V_wftpls', '' , id  )
        let hasError = false;
        if(response.data["error"]) hasError = true;
        let multiObject = {}
            if(response.data&&!hasError)
            {
            let wf_: any[] = response.data
            wf_ = translateObj(wf_, ITicketPropertyObjects)
            let property:ITicketPrpTpl = wf_[0]
            dispatch(TicketActionCreators.setSelectedProperty(property))
            } else
            {
                dispatch(TicketActionCreators.setIsError(i18n.t('data_problem')))
            }   
      
        } catch (e) {
        dispatch(TicketActionCreators.setIsError(i18n.t('axios_error')))     
        console.log('fetchWf',e);    
      } finally {
        dispatch(TicketActionCreators.IsLoading(false))
      }
    },     
    
}

