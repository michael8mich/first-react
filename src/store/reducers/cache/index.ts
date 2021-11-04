import { IQueriesCache } from "../../../models/ISearch"
import { CHART_CONFIG } from "../../../models/IChart"
import { CacheAction,CacheActionEnum, CacheState } from "./types"

const initialState: CacheState = {
    selectSmall: [] as any,
    queriesCache: [] as any,
    pathForEmpty: '',
    configs: [] as CHART_CONFIG[]
}

export default function CacheReducer(state = initialState, action:CacheAction ):CacheState {
    switch (action.type) {
        case CacheActionEnum.SET_SELECT_SMALL: {
            let s = { ...state.selectSmall, ...action.payload }
            return {...state, selectSmall: s }
        } 
        case CacheActionEnum.SET_QUERIES_CACHE: {
            let s = { ...state.queriesCache, ...action.payload }
            return {...state, queriesCache: s }
        } 
        case CacheActionEnum.SET_PATH_FOR_EMPTY: {
            return {...state, pathForEmpty: action.payload }
        } 
        case CacheActionEnum.SET_CONFIGS: {
            let s =  [...state.configs, action.payload] 
            return {...state, configs: s }
        } 
         case CacheActionEnum.SET_CONFIGS_CLEAN: {
            return {...state, configs: action.payload }
        } 
        default:
           return state
    }
}