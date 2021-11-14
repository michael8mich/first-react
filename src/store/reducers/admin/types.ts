import { IUtil, IFilter, AlertPrp } from '../../../models/admin/IUtil';
import { INotification } from '../../../models/INotification';
import { IOrg } from '../../../models/IOrg';
import { IUser } from '../../../models/IUser';


export interface AdminState {
    users: IUser[]
    usersCount: number
    selectedUser: IUser
    orgs: IOrg[]
    orgsCount: number
    selectedOrg: IOrg

    notifications: INotification[]
    notificationsAll: INotification[]
    notificationCount: number
    selectedNotification: INotification

    utils: IUtil[]
    utilsCount: number
    filters: IFilter[]
    alert: AlertPrp
    isLoading: boolean
    error: string
   
}

export enum AdminActionEnum {
    SET_USERS = "SET_USERS",
    SET_SELECTED_USER = "SET_SELECTED_USER",
    SET_USERS_COUNT = "SET_USERS_COUNT",
    SET_ORGS = "SET_ORGS",
    SET_SELECTED_ORG = "SET_SELECTED_ORG",
    SET_ORGS_COUNT = "SET_ORGS_COUNT",

    SET_NOTIFICATIONS = "SET_NOTIFICATIONS",
    SET_NOTIFICATIONS_ALL = "SET_NOTIFICATIONS_ALL",
    SET_SELECTED_NOTIFICATION = "SET_SELECTED_NOTIFICATION",
    SET__NOTIFICATION_COUNT = "SET__NOTIFICATION_COUNT",

    SET_UTILS = "SET_UTILS",
    SET_UTILS_COUNT = "SET_UTILS_COUNT",
    SET_FILTERS = "SET_FILTERS",
    SET_ALERT = "SET_ALERT",
    SET_IS_LOADING = "SET_IS_LOADING",
    SET_ERROR = "SET_ERROR",
}

export interface SetUsersAction {
    type: AdminActionEnum.SET_USERS,
    payload: IUser[]
}
export interface SetSelectedUserAction {
    type: AdminActionEnum.SET_SELECTED_USER,
    payload: IUser
}
export interface SetUsersCountAction {
    type: AdminActionEnum.SET_USERS_COUNT,
    payload: number
}

export interface SetOrgsAction {
    type: AdminActionEnum.SET_ORGS,
    payload: IOrg[]
}
export interface SetSelectedOrgAction {
    type: AdminActionEnum.SET_SELECTED_ORG,
    payload: IOrg
}
export interface SetOrgsCountAction {
    type: AdminActionEnum.SET_ORGS_COUNT,
    payload: number
}


export interface SetNotificationsAction {
    type: AdminActionEnum.SET_NOTIFICATIONS,
    payload: INotification[]
}
export interface SetNotificationsAllAction {
    type: AdminActionEnum.SET_NOTIFICATIONS_ALL,
    payload: INotification[]
}

export interface SetSelectedNotificationsAction {
    type: AdminActionEnum.SET_SELECTED_NOTIFICATION,
    payload: INotification
}
export interface SetNotificationsCountAction {
    type: AdminActionEnum.SET__NOTIFICATION_COUNT,
    payload: number
}

export interface SetErrorAction {
    type: AdminActionEnum.SET_ERROR,
    payload: string
}

export interface SetUtilsAction {
    type: AdminActionEnum.SET_UTILS,
    payload: IUtil[]
}

export interface SetUtilsCountAction {
    type: AdminActionEnum.SET_UTILS_COUNT,
    payload: number
}

export interface SetFiltersAction {
    type: AdminActionEnum.SET_FILTERS,
    payload: IFilter[]
}

export interface SetAlertAction {
    type: AdminActionEnum.SET_ALERT,
    payload: AlertPrp
}

export interface SetIsLoadingAction {
    type: AdminActionEnum.SET_IS_LOADING,
    payload: boolean
}

export type AdminAction = 
SetUsersAction |
SetSelectedUserAction |
SetUsersCountAction |
SetOrgsAction |
SetSelectedOrgAction |
SetOrgsCountAction |
SetErrorAction | 
SetUtilsAction | 
SetIsLoadingAction |
SetFiltersAction |
SetUtilsCountAction |
SetAlertAction |
SetNotificationsAction | 
SetSelectedNotificationsAction | 
SetNotificationsCountAction |
SetNotificationsAllAction



