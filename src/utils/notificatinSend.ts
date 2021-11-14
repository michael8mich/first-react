import { INotification } from './../models/INotification';
import { ITicket } from './../models/ITicket';

import { axiosFnEmail } from '../axios/axios'

export const notify = async (init: boolean, ticket_notify: ITicket, selectedTicket:ITicket = {} as ITicket, notificationsAll:INotification[] = [] as INotification[]) => {
  debugger
  let send_to: string = ''
  let subject: string = ''
  let body: string = ''
  
  let hasError = false;
  //const responseNew:any = await axiosFnEmail(send_to, subject, body )  
  // if(responseNew.data["error"]) hasError = true;
  // if(responseNew.data&&!hasError)
  // {
  //   return 'Ok'
  // }
  // else 
  // return responseNew.data["error"]
}

