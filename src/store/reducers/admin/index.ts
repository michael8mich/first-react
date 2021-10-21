import { IOrg } from './../../../models/IOrg';
import { AlertPrp, IFilter, IUtil } from '../../../models/admin/IUtil';
import { IUser } from "../../../models/IUser"
import { AdminAction, AdminActionEnum, AdminState } from "./types"


const initialState: AdminState = {
    users: [] as IUser[],
    selectedUser: {} as IUser,
    usersCount: 0,
    orgs: [] as IOrg[],
    selectedOrg: {} as IOrg,
    orgsCount: 0,
    utils: [] as IUtil[],
    utilsCount: 0,
    filters: [] as IFilter[],
    alert: {} as AlertPrp,
    isLoading: false,
    error: ''

}

export default function AdminReducer(state = initialState, action:AdminAction ):AdminState {
    switch (action.type) {
        case AdminActionEnum.SET_USERS:
           return {...state, users: action.payload, isLoading: false }
        case  AdminActionEnum.SET_SELECTED_USER:
            return {...state, selectedUser: action.payload }  
        case  AdminActionEnum.SET_USERS_COUNT:
            return {...state, usersCount: action.payload }  
        
        case AdminActionEnum.SET_ORGS:
           return {...state, orgs: action.payload, isLoading: false }
        case  AdminActionEnum.SET_SELECTED_ORG:
            return {...state, selectedOrg: action.payload }  
        case  AdminActionEnum.SET_ORGS_COUNT:
            return {...state, orgsCount: action.payload }  
            
       case  AdminActionEnum.SET_ERROR:
           return {...state, error: action.payload, isLoading: false  }  
       case  AdminActionEnum.SET_UTILS:
           return {...state, utils: action.payload }  
       case  AdminActionEnum.SET_UTILS_COUNT:
            return {...state, utilsCount: action.payload }       
       case  AdminActionEnum.SET_IS_LOADING:
           return {...state, isLoading: action.payload }    
       case  AdminActionEnum.SET_FILTERS:
            return {...state, filters: action.payload }   
       case  AdminActionEnum.SET_ALERT:
                return {...state, alert: action.payload }         
        default:
           return state
    }
}