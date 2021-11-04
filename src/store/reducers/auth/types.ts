import { IQuery, SelectOption } from '../../../models/ISearch';
import { IUser } from './../../../models/IUser';
export interface AuthState {
    isAuth: boolean,
    user: IUser,
    fromLocation: string,
    isLoading: boolean,
    error: string,
    siderQueries: IQuery[]
    defaultRole: SelectOption
}

export enum AuthActionEnum {
    SET_AUTH = "SET_AUTH",
    SET_FROM_LOCATION = "SET_FROM_LOCATION",
    SET_ERROR = "SET_ERROR",
    SET_USER = "SET_USER",
    SET_IS_LOADING = "SET_IS_LOADING",
    SET_SIDER_QUERIES = "SET_SIDER_QUERIES",
    SET_DEFAULT_ROLE = "SET_DEFAULT_ROLE"
}

export interface SetAuthAction {
    type: AuthActionEnum.SET_AUTH,
    payload: boolean
}

export interface SetFromLocationAction {
    type: AuthActionEnum.SET_FROM_LOCATION,
    payload: string
}

export interface SetErrorAction {
    type: AuthActionEnum.SET_ERROR,
    payload: string
}

export interface SetUserAction {
    type: AuthActionEnum.SET_USER,
    payload: IUser
}

export interface SetIsLoadingAction {
    type: AuthActionEnum.SET_IS_LOADING,
    payload: boolean
}

export interface SetSiderQueriesAction {
    type: AuthActionEnum.SET_SIDER_QUERIES,
    payload: IQuery[]
}
export interface SetDefaultRoleAction {
    type: AuthActionEnum.SET_DEFAULT_ROLE,
    payload: SelectOption
}

export type Authentication = 
SetAuthAction |
SetFromLocationAction | 
SetErrorAction | 
SetUserAction | 
SetIsLoadingAction | 
SetSiderQueriesAction |
SetDefaultRoleAction


