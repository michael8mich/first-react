import { SelectOption } from "./ISearch";

export interface INotification {
    name:string,
	id:string,
	ticket?: SelectOption
	sended_to?: string
	sended_subject?: string
	sended_body?: string
	notification_type:SelectOption
	active: number
	send_to:string
	condition:string
	subject:string
	body:string
	last_mod_by: SelectOption
	last_mod_dt:string
	create_date:string
}



export const INotificationObjects:string[] = ['notification_type']
export const INotificationRoFields:string[] = [] 
export const INotificationObjectsMulti:string[] = []


export const NOTIFY_CLOSE = '9DB8554EBC822868C7837862B9709F84'
export const NOTIFY_COMMENT = 'DEB239774DF61313BD12CAA5CD02217A' 
export const NOTIFY_INIT = '132F40886003AAA7367BFBB6AF5F2C0D' 
export const NOTIFY_STATUS = '2CFFCF44C73DABD708F209A015FF52F3'  
export const NOTIFY_TRANSFER = '19E6AEC5EB0DB17391D8356A02657DE6'  