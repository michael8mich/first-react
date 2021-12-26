import { FROM, SELECT, WHERE } from "../utils/formManipulation";
import { ICi } from "./ICi";
import { SelectOption } from "./ISearch";
import { ITicket } from "./ITicket";

export interface IUser {
    id: string
    active: number
    username: string
    email: string
    last_name: string
    first_name: string
    name: string
    locale: string
    login: string
    contact_number: string
    direction: string
    job_title: SelectOption
    contact_type: SelectOption
    phone: string 
    mobile_phone: string 
    additional_phone: string
    description: string
    manager: SelectOption
    primary_group: SelectOption
    organization: SelectOption
    location: SelectOption
    location_address1: string
    location_address2: string
    location_address3: string
    department: SelectOption
    site: SelectOption
    roles: SelectOption[]
    defaultRole: SelectOption
    teams: SelectOption[]
    members: SelectOption[]
    tickets: ITicket[]
    cis: ICi[]
    

    last_mod_by: SelectOption
    last_mod_dt: string
    create_date: string
    token?: string
}

export const IUserObjects:string[] = ['contact_type', 'job_title','primary_group','manager', 'organization','location','department','site','last_mod_by']
export const IUserRoFields:string[] = ['location_address1', 'location_address2','location_address3', 'last_mod_by', 'create_date', 'last_mod_dt']
export const IUserObjectsMulti:string[] = ['roles','teams','members', 'tickets','cis']

export const TEAM_TYPE_ID = 'F349B208096C5B982D8205DED91F5FA4'
export const NOT_GROUP_LIST = " ( contact_type<>'"+TEAM_TYPE_ID+"' ) "
export const GROUP_LIST = " ( contact_type='"+TEAM_TYPE_ID+"' ) "

export const ASSIGNEE_TYPE_ID = '3BDB6B6DBE05CF95B7E76C977A9AF04C'
export const NOT_ASSIGNEE_LIST = " ( contact_type<>'"+ASSIGNEE_TYPE_ID+"' ) "
export const ASSIGNEE_LIST = " ( contact_type='"+ASSIGNEE_TYPE_ID+"' ) "


export const ORG_INFO_TYPE_DEPARTMENT = 'D421F990A306B50CF186BC38BFA7994A'
export const ORG_INFO_TYPE_LOCATION = 'CAE8F8B25793ADA7D9A2E379A05A4F47'
export const ORG_INFO_TYPE_ORGANIZATION = '70E59A35BD1EFBA2D2F022A831C93CB1'
export const ORG_INFO_TYPE_SITE = 'CB534CE7BA39798CC250C7DF7B5E2868'

export const CONTACT_TYPE_EMPLOYEE = {value: 'DF13F7767C2BE7B8D7FC9F399044EA81', label: 'Employee'}
export const DEFAULT_ROLE = {value: '71C0A9F05FD57E4DCCDC38C16787FEAF', label: 'Employee', code: ''}

export const ANALYST_DTP = " ( team in ("+ SELECT +" team "+ FROM +" teammember "+WHERE+" member = 'currentUser' ) " +
"  or assignee = 'currentUser' or customer = 'currentUser' ) "
export const ANALYST_DTP_REPORTS = " ( team in ("+ SELECT +" team "+ FROM +" teammember "+WHERE+" member = 'currentUser' ) " +
"  ) "

export const EMPLOYEE_DTP = " (  customer = 'currentUser' ) "
