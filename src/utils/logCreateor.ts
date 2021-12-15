
import { ITicketWfTpl } from '../models/ITicket';
import { axiosFn } from '../axios/axios'
import { nowToUnix } from './formManipulation';
import i18n from "i18next";
  
  export const logWfManipulation = async (w:ITicketWfTpl, action:string, ticketId: string, userId:string) => {
    let init_wf_values:any = { "name": action, "ticket":  ticketId  , old_value: '', 
    new_value: w.sequence + ' ' +  w.name +  ' ' + i18n.t('team') + ':' + (w?.team?.label ? w?.team?.label : '') +   ' ' + i18n.t('assignee') + ':' + (w?.assignee?.label ? w?.assignee?.label : '')}
    init_wf_values.last_mod_by = userId
    init_wf_values.last_mod_dt =  nowToUnix().toString()
    const responseNewLog = await  axiosFn("post", init_wf_values, '*', 'ticket_log', "id" , ''  ) 
  }