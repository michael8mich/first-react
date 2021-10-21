import { SelectOption } from "./ISearch";

export interface IOrg {
    id: string
    active: number
    name: string
    organizational_type: SelectOption
    phone: string 
    country: string 
    city: string
    address1: string
    address2: string
    address3: string
    manager: SelectOption
    description: string
    zip: string

}

export const IOrgObjects:string[] = ['organizational_type', 'manager']
export const IOrgRoFields:string[] = [] 
export const IOrgObjectsMulti:string[] = []

export const ORG_INFO_TYPE_DEPARTMENT = 'D421F990A306B50CF186BC38BFA7994A'
export const ORG_INFO_TYPE_LOCATION = 'CAE8F8B25793ADA7D9A2E379A05A4F47'
export const ORG_INFO_TYPE_ORGANIZATION = '70E59A35BD1EFBA2D2F022A831C93CB1'
export const ORG_INFO_TYPE_SITE = 'CB534CE7BA39798CC250C7DF7B5E2868'

export const DEPARTMENT_LIST = " ( organizational_type='"+ORG_INFO_TYPE_DEPARTMENT+"' ) "
export const LOCATION_LIST = " ( organizational_type='"+ORG_INFO_TYPE_LOCATION+"' ) "
export const ORGANIZATION_LIST = " ( organizational_type='"+ORG_INFO_TYPE_ORGANIZATION+"' ) "
export const SITE_LIST = " ( organizational_type='"+ORG_INFO_TYPE_SITE+"' ) "