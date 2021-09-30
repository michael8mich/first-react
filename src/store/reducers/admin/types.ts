import { IUtil, IFilter } from '../../../models/admin/IUtil';
import { IUser } from '../../../models/IUser';


export interface AdminState {
    users: IUser[]
    usersCount: number
    utils: IUtil[]
    utilsCount: number
    filters: IFilter[]
    isLoading: boolean
    error: string
}

export enum AdminActionEnum {
    SET_USERS = "SET_USERS",
    SET_ERROR = "SET_ERROR",
    SET_UTILS = "SET_UTILS",
    SET_UTILS_COUNT = "SET_UTILS_COUNT",
    SET_FILTERS = "SET_FILTERS",
    SET_IS_LOADING = "SET_IS_LOADING"
}

export interface SetUsersAction {
    type: AdminActionEnum.SET_USERS,
    payload: IUser[]
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

export interface SetIsLoadingAction {
    type: AdminActionEnum.SET_IS_LOADING,
    payload: boolean
}

export type AdminAction = 
SetUsersAction |
SetErrorAction | 
SetUtilsAction | 
SetIsLoadingAction |
SetFiltersAction |
SetUtilsCountAction


