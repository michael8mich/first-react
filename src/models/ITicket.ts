import { INotification } from './INotification';
import { SelectOption } from "./ISearch";
import { IUser } from "./IUser";

export interface ITicket {
    id: string
    active: number
    name: string
    category: SelectOption
    status: SelectOption
    priority: SelectOption
    urgency: SelectOption
    requestor: SelectOption
    customer: SelectOption
    assignee: SelectOption
    team: SelectOption
    asset: SelectOption 
    log_agent: SelectOption
    ticket_type: SelectOption
    ci: SelectOption
    description: string
    last_mod_by: SelectOption
    last_mod_dt: string
    create_date: string
    close_date: string
    customer_info: IUser
    category_info: ITicketCategory
    tickets_log?: ITicketLog[]
    attachments?: number
    ticketProperties?: ITicketPrpTpl[]
    ticketPropertiesCount?: number
    customer_open_tickets?: number
    tickets_notifications: INotification[]
}
export interface ITicketLog {
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

export interface ITicketCategory {
    id: string
    active: number
    name: string
    priority: SelectOption
    urgency: SelectOption
    assignee: SelectOption
    team: SelectOption
    ticket_types: SelectOption[]
    description: string
    last_mod_by: SelectOption
    last_mod_dt: string
    create_date: string
}

export interface ITicketPrpTpl {
    id: string
	name: string
	factory: SelectOption
	category: string
	sequence: string
	width: number
	pattern: string
	defaultValue: string
	placeholder: string
	description: string
    code: string
	last_mod_by: SelectOption
	last_mod_dt: string
	create_date: string
	active: number
    listCode: string[]
    
    ticket:string
	value: string
	valueObj: SelectOption
    tcode_select: SelectOption
    dependence: string
    visible: number 
}
export interface INameBoolValue {
    name: string
    value: boolean
}

export interface IIFrame {
    width:string,
    height:string,
    url:string
  }





export const ITicketObjects:string[] = ['status','customer', 'ticket_type', 'priority','assignee','team', 'urgency', 'last_mod_by', 'log_agent', 'category', 'ci']
export const ITicketRoFields:string[] = ['active']
export const ITicketObjectsMulti:string[] = []

export const ITicketCategoryObjects:string[] = [ 'priority','assignee','team', 'urgency', 'last_mod_by']
export const ITicketCategoryRoFields:string[] = []
export const ITicketCategoryObjectsMulti:string[] = ['ticket_types']


export const ITicketPropertyObjects:string[] = [ 'last_mod_by','factory','tcode_select']
export const ITicketPropertyRoFields:string[] = []
export const ITicketPropertyObjectsMulti:string[] = []



export const TICKET_REQUEST  = { value: 'FB470C07301C0205D428E9514812797B' , label: 'בקשה', code: '' }
export const TICKET_INCIDENT =  { value: '3FED64901D962681BE84BDE68F03354B' , label: 'קריאה', code: '' }
export const TICKET_PROBLEM  =  { value: 'D1266F9E45D78F3992449AABCBC86C4F' , label: 'בעיה', code: '' } 


export const STATUS_CREATED  =  {value:'5FDF6F00251B68DE29700A2E48EF3790', label: 'Created', code: '1'}
export const STATUS_OPEN     =  {value:'6BB748FE81BD8C3FF3A2B7FC83192D0D', label: 'Opened', code: '1'}
export const STATUS_HOLD     =  {value:'409AE1C47CA59447D867804C1FDB390E', label: 'Hold', code: '2'}
export const STATUS_CANCELED =  {value:'AF87F7217E5CD566C3B1841DBDB5CDC2', label: 'Canceled', code: '0'}
export const STATUS_WAITING_FOR_TREATMENT =  {value:'BDB5FB22E63203528D40E0A299648D2B', label: 'Waiting for Treatment', code: '1'}
export const STATUS_IN_TREATMENT =  {value:'B78139C41374360B873D49CB738E5A90', label: 'In treatment', code: '1'}
export const STATUS_CLOSE        =  {value:'66516467D6A05B4CCC76CDC794DD7554', label: 'Close', code: '0'}


export const PRIORITY_HIGH   =  {value:'27F515416704A54027E8EFBCE8CEFB58', label: 'גבוע', code: '1'}
export const PRIORITY_MEDIUM =  {value:'B29340D0556E69DF2600CE66971A33A5', label: 'בינוני', code: '2'}
export const PRIORITY_LOW    =  {value:'4B099705C755214605B23F6CEC46D732', label: 'נמוכה', code: '3'}

export const URGENCY_HIGH    =  {value:'EDC864A88A6F54B180F0F00ECF51698B', label: 'מערכתית', code: '1'}
export const URGENCY_MEDIUM  =  {value:'B5307E628146CF695CE1BD6409A73B9C', label: 'איזורית', code: '2'}
export const URGENCY_LOW     =  {value:'21F6F911FF94FADDE3660D771B73D844', label: 'פרטניט', code: '3'}



export const PRP_FACTORY_OBJECT =  'E14B10CAFD57AD9F72D08DD5F646FC53'
export const PRP_FACTORY_DATE =  '2C73B5FBF41C4CA07DB83022FA9B9272'
export const PRP_FACTORY_LIST =  '78BE32E17B6C1B2147D35FDF5086BFE7'
export const PRP_FACTORY_TEXT =  '687F2052E72F59FC6FAE9F66AC0A2F53'

