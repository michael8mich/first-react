
import { SelectOption } from "./ISearch";
import { ITicket } from "./ITicket";


export interface ICi {
    id: string
    active: number
    name: string
    ci_class: SelectOption
    ci_family: string
    ci_status: SelectOption
    ci_user: SelectOption
    ci_model: SelectOption
    manufacturer: string
    location: SelectOption
    ip:string
    serial:string
    mac:string
    acquire_dt:string
    install_dt:string
    expiration_dt:string
    warranty_start_dt:string
    warranty_end_dt:string
    description: string
    last_mod_by: SelectOption
    last_mod_dt: string
    create_date: string
    open_tickets_count?: number
    open_tickets: ITicket[]
}
export interface ICisLog {
    id: string
	name: string
	ticket: SelectOption
	old_value: string
	new_value: string
	value_obj: string
	old_value_obj_id: SelectOption
	new_value_obj_id: SelectOption
	last_mod_by: SelectOption
	last_mod_dt: string
	create_date: string
    last_mod_by_name: string
}


export const ICiObjects:string[] = ['ci_status','ci_class', 'ci_user', 'ci_model', 'location', 'last_mod_by']
export const ICiRoFields:string[] = ['active', 'ci_family','manufacturer']
export const ICiObjectsMulti:string[] = []

export const STATUS_IN_SERVICE  =  {value:'CCFF86D7881D00C1CD7B8BE02D05BCFD', label: 'In Service', code: '1'}
export const STATUS_IN_STORAGE     =  {value:'1EEE7D7DAE1C11EDEE55156A8864F166', label: 'in Storage', code: '1'}
export const STATUS_OUT_OF_SERVICE     =  {value:'2E6BB749F3A43B9B9D0614551D090C83', label: 'Out of Service', code: '0'}
export const STATUS_IN_REPAIR =  {value:'244D4CB145F75C16955BA9F73A38043D', label: 'In Repair', code: '1'}
export const STATUS_IN_CONTRIBUTION =  {value:'50C91506C9C5F7AF63940622F6442CA9', label: 'In contribution', code: '0'}


