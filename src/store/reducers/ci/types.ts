
import { ICi } from '../../../models/ICi';


export interface CiState {
    cis: ICi[]
    cisCount: number
    selectedCi: ICi
    isLoading: boolean
    error: string
   
}

export enum CiActionEnum {
    SET_CIS = "SET_CIS",
    SET_SELECTED_CI = "SET_SELECTED_CI",
    SET_CIS_COUNT = "SET_CIS_COUNT",
    
    SET_IS_LOADING = "SET_IS_LOADING",
    SET_ERROR = "SET_ERROR",
}

export interface SetCisAction {
    type: CiActionEnum.SET_CIS,
    payload: ICi[]
}
export interface SetSelectedCiAction {
    type: CiActionEnum.SET_SELECTED_CI,
    payload: ICi
}
export interface SetCisCountAction {
    type: CiActionEnum.SET_CIS_COUNT,
    payload: number
}

export interface SetErrorAction {
    type: CiActionEnum.SET_ERROR,
    payload: string
}


export interface SetIsLoadingAction {
    type: CiActionEnum.SET_IS_LOADING,
    payload: boolean
}

export type CiAction = 
SetCisAction |
SetSelectedCiAction |
SetCisCountAction |
SetErrorAction | 
SetIsLoadingAction 




