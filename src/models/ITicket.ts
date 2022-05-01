import { INotification } from './INotification';
import { SelectOption } from "./ISearch";
import { IUser } from "./IUser";

export interface ITicket {
    id: string
    active: number
    name: string
    category: SelectOption
    categoryChanged:boolean
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
    customer_phone: string
    category_info: ITicketCategory
    tickets_log?: ITicketLog[]
    attachments?: number
    ticketProperties?: ITicketPrpTpl[]
    ticketPropertiesCount?: number
    ticketWfs?: ITicketWfTpl[]
    ticketWfsCount?: number
    customer_open_tickets?: number
    tickets_notifications: INotification[]
    width?: string | number | undefined
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
    ticket: SelectOption
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

export interface ITicketWfTpl {
id: string
name: string
description: string
last_mod_dt: string
last_mod_by: SelectOption
tcategory: SelectOption
task: SelectOption
sequence: string
assignee: SelectOption
team: SelectOption
deleteable: string
ci: SelectOption
creator: SelectOption
created_dt: string
done_by: SelectOption
done_dt: string
start_dt: string
group_task: number
active: number,
ticket?: SelectOption,
status?: SelectOption
}

export interface ITicketsAllWfs {
    id: string
    name: string
    description: string
    last_mod_dt: string
    last_mod_by: SelectOption
    tcategory: SelectOption
    task: SelectOption
    sequence: string
    assignee: SelectOption
    team: SelectOption
    deleteable: string
    ci: SelectOption
    creator: SelectOption
    created_dt: string
    done_by: SelectOption
    done_dt: string
    start_dt: string
    group_task: number
    active: number,
    ticket: SelectOption,
    status: SelectOption,
    requestor: SelectOption
    customer: SelectOption
    ticket_assignee: SelectOption
    ticket_team: SelectOption
    ticket_status_team: SelectOption,
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
export const ITicketRoFields:string[] = ['active','selectChange']
export const ITicketObjectsMulti:string[] = []
export const ITicketTemplateFields:string[] = ['status','customer', 'ticket_type', 'priority','assignee','team', 'urgency', 'ci', 'customer_phone', 'description']


export const ITicketCategoryObjects:string[] = [ 'priority','assignee','team', 'urgency', 'ticket', 'last_mod_by']
export const ITicketCategoryRoFields:string[] = []
export const ITicketCategoryObjectsMulti:string[] = ['ticket_types']


export const ITicketPropertyObjects:string[] = [ 'last_mod_by','factory','tcode_select']
export const ITicketPropertyRoFields:string[] = []
export const ITicketPropertyObjectsMulti:string[] = []

export const ITicketWfObjects:string[] = [ 'assignee','team','last_mod_by','tcategory','task','done_by']
export const ITicketWfRoFields:string[] = []
export const ITicketWfObjectsMulti:string[] = []


export const ITicketAllWfsObjects:string[] = [ 'assignee','team','last_mod_by','tcategory','task','done_by', 'ticket','status','requestor','customer','ticket_status','ticket_team','ticket_assignee']
export const ITicketAllWfsRoFields:string[] = []
export const ITicketAllWfsObjectsMulti:string[] = []


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

export const WF_STATUS_COMPLETE     =  {value:'9F2A9887CFE35AC82A1E8118DC3F3EC6', label: 'Complete', code: '3'}
export const WF_STATUS_HOLD         =  {value:'3FBD65B24DBB826BB79A34B940B7F85D', label: 'Hold', code: '2'}
export const WF_STATUS_PEND         =  {value:'0C1E63E62DD89EDD9BAC1F4CCD21F138', label: 'Pend', code: '1'}
export const WF_STATUS_REJECT       =  {value:'6512C117A00B0BB52E8976BB1EB2B71A', label: 'Reject', code: '2'}
export const WF_STATUS_WAIT         =  {value:'7BE1D7E465F8435D0FD8E49A9627A783', label: 'Wait', code: '0'}
export const WF_STATUS_CANCEL         =  {value:'9A6998BD6164F10BFE6EB689972C100C', label: 'Cancel', code: '4'}

export const WF_TASK_ACTION         =  {value:'AA99A605BBF9AF66FCB6B47B6FB4964A', label: 'Action', code: '1'}
export const WF_TASK_APPROVE        =  {value:'D2490593B887CFBEC738DB5F766C8A6D', label: 'Approve', code: '1'}
export const WF_TASK_START_GROUP    =  {value:'56727E39B14348D7AAB5268CD1775C42', label: 'Start Group', code: '2'}
export const WF_TASK_END_GROUP      =  {value:'FC5F3FE0F4BE0AA2477A3EC875E015D9', label: 'End Group', code: '3'}

export const WF_LOG_REJECT = 'Workflow Status Reject'
export const WF_LOG_PEND = 'Workflow Status Pend'
export const WF_LOG_COMPLETE = 'Workflow Status Complete'

export const WF_ = 'WF'
export const WF_Description_Changed = 'Description Changed'
export const WF_Assignee_Changed = 'Assignee Changed'
export const WF_Team_Changed = 'Team Changed'
