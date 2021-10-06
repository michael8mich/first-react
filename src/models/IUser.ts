import { SelectOption } from "./ISearch";

export interface IUser {
    id: string
    active: number
    username: string
    email: string
    last_name: string
    first_name: string
    name: string
    locale: string
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
    teams: SelectOption[]
    members: SelectOption[]
}

export const IObjects:string[] = ['contact_type', 'job_title','primary_group','manager', 'organization','location','department','site']
export const IRoFields:string[] = ['location_address1', 'location_address2','location_address3']
export const IObjectsMulti:string[] = ['roles','teams','members']

export const TEAM_TYPE_ID = 'F349B208096C5B982D8205DED91F5FA4'
export const NOT_GROUP_LIST = " ( contact_type<>'"+TEAM_TYPE_ID+"' ) "
export const GROUP_LIST = " ( contact_type='"+TEAM_TYPE_ID+"' ) "

export const ORG_INFO_TYPE_DEPARTMENT = 'D421F990A306B50CF186BC38BFA7994A'
export const ORG_INFO_TYPE_LOCATION = 'CAE8F8B25793ADA7D9A2E379A05A4F47'
export const ORG_INFO_TYPE_ORGANIZATION = '70E59A35BD1EFBA2D2F022A831C93CB1'
export const ORG_INFO_TYPE_SITE = 'CB534CE7BA39798CC250C7DF7B5E2868'