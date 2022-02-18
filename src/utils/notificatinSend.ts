import { replace } from 'lodash';
import { INotification, NOTIFY_CLOSE, NOTIFY_INIT, NOTIFY_TRANSFER } from './../models/INotification';
import { ITicket, STATUS_CLOSE, ITicketWfTpl } from './../models/ITicket';

import { axiosFn, axiosFnEmail } from '../axios/axios'
import { SELECT, FROM, WHERE } from './formManipulation';

export const notify = async (init: boolean, ticket_notify: ITicket, selectedTicket:ITicket = {} as ITicket, notificationsAll:INotification[] = [] as INotification[]) => {
  let notifications = [...notificationsAll]

   if(notifications.length===0) return
   if(init) 
    notifications = notifications.filter(n=>n.notification_type.value===NOTIFY_INIT&&n.active===1) 
   else
    notifications = notifications.filter(n=>n.notification_type.value!==NOTIFY_INIT&&n.active===1)
    
   let ticket_notify_arr = Object.entries(ticket_notify)
   let selectedTicket_arr = Object.entries(selectedTicket)
   if(init) {
    let ticket_num = {} as any
    ticket_num = await  axiosFn("get", '', 'name', 'ticket',  'id'  ,  selectedTicket_arr.find(t=>t[0]==='id')?.[1] )  
    selectedTicket_arr.push(['name', ticket_num.data[0].name])
   }

   notifications.map( async n=> {
    let get_event = false 
    if(!init) {
      if(n.notification_type.value === NOTIFY_CLOSE) {
        if(selectedTicket_arr.find(t=>t[0]==='status')?.[1].value !== STATUS_CLOSE.value &&
        ticket_notify_arr.find(t=>t[0]==='status')?.[1].value === STATUS_CLOSE.value
        )
        get_event = true
      }
      if(n.notification_type.value === NOTIFY_TRANSFER) {
        let assignee_before = selectedTicket_arr.find(t=>t[0]==='assignee')?.[1]?.value || ''
        let assignee = ticket_notify_arr.find(t=>t[0]==='assignee')?.[1]?.value || ''
        let team_before = selectedTicket_arr.find(t=>t[0]==='team')?.[1]?.value || ''
        let team = ticket_notify_arr.find(t=>t[0]==='team')?.[1]?.value || ''
        if(team_before !==  team
         ||
         assignee_before !==  assignee
        )
        get_event = true
      }
    } 
    if(!init)  
    if(!get_event) return
    let subject = n.subject
    let body = n.body
    let ticket_id = selectedTicket_arr.find(t=>t[0]==='id')
    let ticket_name = selectedTicket_arr.find(t=>t[0]==='name')
    let ticket_customer = ticket_notify_arr.find(t=>t[0]==='customer')
    let ticket_status = ticket_notify_arr.find(t=>t[0]==='status')
    let ticket_category = ticket_notify_arr.find(t=>t[0]==='category')
    let ticket_description = ticket_notify_arr.find(t=>t[0]==='description')
    let ticket_team = ticket_notify_arr.find(t=>t[0]==='team')
    let ticket_assignee = ticket_notify_arr.find(t=>t[0]==='assignee')
    let ticket_priority = ticket_notify_arr.find(t=>t[0]==='priority')
    let ticket_urgency = ticket_notify_arr.find(t=>t[0]==='urgency')
    if(ticket_name?.[1])
    {
      subject = subject.replace(/#ticket.name#/g, ticket_name?.[1] ? ticket_name?.[1] : '') 
      body = body.replace(/#ticket.name#/g, ticket_name?.[1] ? ticket_name?.[1] : '') 
    }
    if(ticket_id?.[1])
    {
      subject = subject.replace(/#ticket.id#/g, ticket_id?.[1] ? ticket_id?.[1] : '') 
      body = body.replace(/#ticket.id#/g, ticket_id?.[1] ? ticket_id?.[1] : '') 
    }
    if(ticket_customer?.[1])
    {
      subject = subject.replace(/#ticket.customer.name#/g, ticket_customer?.[1].label ? ticket_customer?.[1].label : '' ) 
      body = body.replace(/#ticket.customer.name#/g, ticket_customer?.[1].label ? ticket_customer?.[1].label : '') 
    }
    if(ticket_status?.[1])
    {
      subject = subject.replace(/#ticket.status.name#/g, ticket_status?.[1].label ? ticket_status?.[1].label : '' ) 
      body = body.replace(/#ticket.status.name#/g, ticket_status?.[1].label ? ticket_status?.[1].label : '') 
    }
    if(ticket_category?.[1])
    {
      subject = subject.replace(/#ticket.category.name#/g, ticket_category?.[1].label ? ticket_category?.[1].label : '') 
      body = body.replace(/#ticket.category.name#/g, ticket_category?.[1].label ? ticket_category?.[1].label : '')  
    }
    else
    {
      subject = subject.replace(/#ticket.category.name#/g, '') 
      body = body.replace(/#ticket.category.name#/g,  '') 
    }
    if(ticket_description?.[1])
    {
      subject = subject.replace(/#ticket.description#/g, ticket_description?.[1] ? ticket_description?.[1] : '' ) 
      body = body.replace(/#ticket.description#/g, ticket_description?.[1] ? ticket_description?.[1] : '') 
    }
    else
    {
      subject = subject.replace(/#ticket.description#/g, '' ) 
      body = body.replace(/#ticket.description#/g,  '') 
    }
    if(ticket_team?.[1])
    {
      subject = subject.replace(/#ticket.team.name#/g, ticket_team?.[1].label ? ticket_team?.[1].label : '' ) 
      body = body.replace(/#ticket.team.name#/g, ticket_team?.[1].label ? ticket_team?.[1].label : '' ) 
    }
    else
    {
      subject = subject.replace(/#ticket.team.name#/g,  '' ) 
      body = body.replace(/#ticket.team.name#/g, '' ) 
    }
    if(ticket_assignee?.[1])
    {
      subject = subject.replace(/#ticket.assignee.name#/g, ticket_assignee?.[1].label ? ticket_assignee?.[1].label : '') 
      body = body.replace(/#ticket.assignee.name#/g, ticket_assignee?.[1].label ? ticket_assignee?.[1].label : '' ) 
    }
    else
    {
      subject = subject.replace(/#ticket.assignee.name#/g,  '') 
      body = body.replace(/#ticket.assignee.name#/g,  '' ) 
    }
    
    if(ticket_priority?.[1])
    {
      subject = subject.replace(/#ticket.priority.name#/g, ticket_priority?.[1].label ? ticket_priority?.[1].label : '' ) 
      body = body.replace(/#ticket.priority.name#/g, ticket_priority?.[1].label ? ticket_priority?.[1].label : '' ) 
    }
    else
    {
      subject = subject.replace(/#ticket.priority.name#/g,  '' ) 
      body = body.replace(/#ticket.priority.name#/g,  '' ) 
    }
    if(ticket_urgency?.[1])
    {
      subject = subject.replace(/#ticket.urgency.name#/g, ticket_urgency?.[1].label ? ticket_urgency?.[1].label : '' ) 
      body = body.replace(/#ticket.urgency.name#/g, ticket_urgency?.[1].label ? ticket_urgency?.[1].label: '') 
    }
    {
      subject = subject.replace(/#ticket.urgency.name#/g,  '' ) 
      body = body.replace(/#ticket.urgency.name#/g,  '') 
    }
    
    
      console.log('subject', subject);
      //console.log('body', body);
    let emails_grp = ''
    

    let emails_obj = n.send_to.split(',')
    if(emails_obj.length===0) return
    let emails_where = ''

    emails_obj.map((e) =>{
      // let obj = Object.keys(ticket_notify).find(o=>o===e)
      
      let obj = ticket_notify_arr.find(t=>t[0]===e) 
      if(obj?.[1])
      if(obj?.[1].value)
      if(obj?.[0] === 'team'){
        emails_grp = SELECT + " member " + FROM + " teammember " + WHERE + " team = '"+obj?.[1].value+"'" 
      }
      else
       emails_where += "'"+obj?.[1].value+"',"


    })
    if(emails_where.length>0)
    emails_where = '(' + emails_where + ')'
    emails_where = emails_where.replace(',)',')')

    emails_where =  emails_where.length>0 ? " id IN " + emails_where : ""
    emails_where = emails_where.length>0 && emails_grp.length > 0  ? emails_where + " or id in (  (" +emails_grp+ ") )" : emails_where
    emails_where = emails_where.length===0 && emails_grp.length > 0  ? " id in (  (" +emails_grp+ ") )" : emails_where

  
    const response = await  axiosFn("get", '', 'email, name', 'V_contacts',  emails_where  , ''  )  
    let emails = response.data.filter((d: { email: string | null; })=>d.email !== null&&d.email !=='')
    if(emails.length===0) return

    let emails_addresses = emails.map((e: { email: any; })=>e.email)
    emails_addresses = Array.from(new Set([...emails_addresses]));

    let sended_obj:any = Object.assign({}, n)
    delete sended_obj.create_date
    delete sended_obj.id
    delete sended_obj.last_mod_by_name
    sended_obj.sended_to = emails.map((e: { name: any; })=> e.name).join(',')
    sended_obj.sended_subject = subject
    sended_obj.sended_body = body
    sended_obj.notification_type = sended_obj.notification_type.value
    sended_obj.ticket =  ticket_id?.[1]
    const responseNew = await  axiosFn("post", sended_obj, '*', 'notification_sended', "id" , ''  )  
    // emails_addresses.map( async ( e:string ) => {
    //   if(e.length>0)
    //     console.log(e);
    //     let hasError = false;
    //     const responseNew:any = await axiosFnEmail(e, subject, body )  
    //     if(responseNew.data["error"]) hasError = true;
    //     if(responseNew.data&&!hasError)
    //     {
    //       return 'Ok'
    //     }
    //     else 
    //     return responseNew.data["error"]
        
    // })

   })
}
export const notifyWf = async ( type: string, ticket:ITicket,  wf:ITicketWfTpl, notificationsAll:INotification[] = [] as INotification[]) => {
  let notifications = [...notificationsAll]
  let  n = notifications.find(n=>n.notification_type.value===type&&n.active===1) 
  if(!n) return  
  let wf_arr = Object.entries(wf)
  let selectedTicket_arr = Object.entries(ticket)

    let subject = n.subject
    let body = n.body
    let ticket_id = selectedTicket_arr.find(t=>t[0]==='id')
    let ticket_name = selectedTicket_arr.find(t=>t[0]==='name')
    let ticket_customer = selectedTicket_arr.find(t=>t[0]==='customer')
    let ticket_status = selectedTicket_arr.find(t=>t[0]==='status')
    let ticket_category = selectedTicket_arr.find(t=>t[0]==='category')
    let ticket_description = selectedTicket_arr.find(t=>t[0]==='description')
    let ticket_team = selectedTicket_arr.find(t=>t[0]==='team')
    let ticket_assignee = selectedTicket_arr.find(t=>t[0]==='assignee')
    let ticket_priority = selectedTicket_arr.find(t=>t[0]==='priority')
    let ticket_urgency = selectedTicket_arr.find(t=>t[0]==='urgency')



    if(ticket_name?.[1])
    {
      subject = subject.replace(/#ticket.name#/g, ticket_name?.[1] ? ticket_name?.[1] : '') 
      body = body.replace(/#ticket.name#/g, ticket_name?.[1] ? ticket_name?.[1] : '') 
    }
    if(ticket_id?.[1])
    {
      subject = subject.replace(/#ticket.id#/g, ticket_id?.[1] ? ticket_id?.[1] : '') 
      body = body.replace(/#ticket.id#/g, ticket_id?.[1] ? ticket_id?.[1] : '') 
    }
    if(ticket_customer?.[1])
    {
      subject = subject.replace(/#ticket.customer.name#/g, ticket_customer?.[1].label ? ticket_customer?.[1].label : '' ) 
      body = body.replace(/#ticket.customer.name#/g, ticket_customer?.[1].label ? ticket_customer?.[1].label : '') 
    }
    if(ticket_status?.[1])
    {
      subject = subject.replace(/#ticket.status.name#/g, ticket_status?.[1].label ? ticket_status?.[1].label : '' ) 
      body = body.replace(/#ticket.status.name#/g, ticket_status?.[1].label ? ticket_status?.[1].label : '') 
    }
    if(ticket_category?.[1])
    {
      subject = subject.replace(/#ticket.category.name#/g, ticket_category?.[1].label ? ticket_category?.[1].label : '') 
      body = body.replace(/#ticket.category.name#/g, ticket_category?.[1].label ? ticket_category?.[1].label : '')  
    }
    else
    {
      subject = subject.replace(/#ticket.category.name#/g, '') 
      body = body.replace(/#ticket.category.name#/g,  '') 
    }
    if(ticket_description?.[1])
    {
      subject = subject.replace(/#ticket.description#/g, ticket_description?.[1] ? ticket_description?.[1] : '' ) 
      body = body.replace(/#ticket.description#/g, ticket_description?.[1] ? ticket_description?.[1] : '') 
    }
    else
    {
      subject = subject.replace(/#ticket.description#/g, '' ) 
      body = body.replace(/#ticket.description#/g,  '') 
    }
    if(ticket_team?.[1])
    {
      subject = subject.replace(/#ticket.team.name#/g, ticket_team?.[1].label ? ticket_team?.[1].label : '' ) 
      body = body.replace(/#ticket.team.name#/g, ticket_team?.[1].label ? ticket_team?.[1].label : '' ) 
    }
    else
    {
      subject = subject.replace(/#ticket.team.name#/g,  '' ) 
      body = body.replace(/#ticket.team.name#/g, '' ) 
    }
    if(ticket_assignee?.[1])
    {
      subject = subject.replace(/#ticket.assignee.name#/g, ticket_assignee?.[1].label ? ticket_assignee?.[1].label : '') 
      body = body.replace(/#ticket.assignee.name#/g, ticket_assignee?.[1].label ? ticket_assignee?.[1].label : '' ) 
    }
    else
    {
      subject = subject.replace(/#ticket.assignee.name#/g,  '') 
      body = body.replace(/#ticket.assignee.name#/g,  '' ) 
    }
    
    if(ticket_priority?.[1])
    {
      subject = subject.replace(/#ticket.priority.name#/g, ticket_priority?.[1].label ? ticket_priority?.[1].label : '' ) 
      body = body.replace(/#ticket.priority.name#/g, ticket_priority?.[1].label ? ticket_priority?.[1].label : '' ) 
    }
    else
    {
      subject = subject.replace(/#ticket.priority.name#/g,  '' ) 
      body = body.replace(/#ticket.priority.name#/g,  '' ) 
    }
    if(ticket_urgency?.[1])
    {
      subject = subject.replace(/#ticket.urgency.name#/g, ticket_urgency?.[1].label ? ticket_urgency?.[1].label : '' ) 
      body = body.replace(/#ticket.urgency.name#/g, ticket_urgency?.[1].label ? ticket_urgency?.[1].label: '') 
    }
    {
      subject = subject.replace(/#ticket.urgency.name#/g,  '' ) 
      body = body.replace(/#ticket.urgency.name#/g,  '') 
    }
    
    //--------------------------- wf
    let wf_name = wf_arr.find(t=>t[0]==='name')
    let wf_description = wf_arr.find(t=>t[0]==='description')
    let wf_team = wf_arr.find(t=>t[0]==='team')
    let wf_assignee = wf_arr.find(t=>t[0]==='assignee')
    let wf_task = wf_arr.find(t=>t[0]==='task') 

    
    if(wf_name?.[1])
    {
      subject = subject.replace(/#wf.name#/g, wf_name?.[1] ? wf_name?.[1] : '') 
      body = body.replace(/#wf.name#/g, wf_name?.[1] ? wf_name?.[1] : '') 
    }
    if(wf_description?.[1])
    {
      subject = subject.replace(/#wf.description#/g, wf_description?.[1] ? wf_description?.[1] : '' ) 
      body = body.replace(/#wf.description#/g, wf_description?.[1] ? wf_description?.[1] : '') 
    }
    else
    {
      subject = subject.replace(/#wf.description#/g, '' ) 
      body = body.replace(/#wf.description#/g,  '') 
    }
    if(wf_team?.[1])
    {
      subject = subject.replace(/#wf.team.name#/g, wf_team?.[1].label ? wf_team?.[1].label : '' ) 
      body = body.replace(/#wf.team.name#/g, wf_team?.[1].label ? wf_team?.[1].label : '' ) 
    }
    else
    {
      subject = subject.replace(/#wf.team.name#/g,  '' ) 
      body = body.replace(/#wf.team.name#/g, '' ) 
    }
    if(wf_assignee?.[1])
    {
      subject = subject.replace(/#wf.assignee.name#/g, wf_assignee?.[1].label ? wf_assignee?.[1].label : '') 
      body = body.replace(/#wf.assignee.name#/g, wf_assignee?.[1].label ? wf_assignee?.[1].label : '' ) 
    }
    else
    {
      subject = subject.replace(/#wf.assignee.name#/g,  '') 
      body = body.replace(/#wf.assignee.name#/g,  '' ) 
    }

    if(wf_task?.[1])
    {
      subject = subject.replace(/#wf.task.name#/g, wf_task?.[1].label ? wf_task?.[1].label : '') 
      body = body.replace(/#wf.task.name#/g, wf_task?.[1].label ? wf_task?.[1].label : '' ) 
    }
    else
    {
      subject = subject.replace(/#wf.task.name#/g,  '') 
      body = body.replace(/#wf.task.name#/g,  '' ) 
    }

    let emails_grp = ''
    let emails_obj = n.send_to.split(',')
    if(emails_obj.length===0) return
    let emails_where = ''

    emails_obj.map((e) =>{
      
      let obj = wf_arr.find(t=>t[0]===e) 
      if(obj?.[1])
      if(obj?.[1].value)
      if(obj?.[0] === 'team'){
        emails_grp = SELECT + " member " + FROM + " teammember " + WHERE + " team = '"+obj?.[1].value+"'" 
      }
      else
       emails_where += "'"+obj?.[1].value+"',"


    })
    if(emails_where.length>0)
    emails_where = '(' + emails_where + ')'
    emails_where = emails_where.replace(',)',')')

    emails_where =  emails_where.length>0 ? " id IN " + emails_where : ""
    emails_where = emails_where.length>0 && emails_grp.length > 0  ? emails_where + " or id in (  (" +emails_grp+ ") )" : emails_where
    emails_where = emails_where.length===0 && emails_grp.length > 0  ? " id in (  (" +emails_grp+ ") )" : emails_where

  
    const response = await  axiosFn("get", '', 'email, name', 'V_contacts',  emails_where  , ''  )  
    let emails = response.data.filter((d: { email: string | null; })=>d.email !== null&&d.email !=='')
    if(emails.length===0) return

    let emails_addresses = emails.map((e: { email: any; })=>e.email)
    emails_addresses = Array.from(new Set([...emails_addresses]));

    let sended_obj:any = Object.assign({}, n)
    delete sended_obj.create_date
    delete sended_obj.id
    delete sended_obj.last_mod_by_name
    sended_obj.sended_to = emails.map((e: { name: any; })=> e.name).join(',')
    sended_obj.sended_subject = subject
    sended_obj.sended_body = body
    sended_obj.notification_type = sended_obj.notification_type.value
    sended_obj.ticket =  ticket_id?.[1]
    const responseNew = await  axiosFn("post", sended_obj, '*', 'notification_sended', "id" , ''  )  

}
