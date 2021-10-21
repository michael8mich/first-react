import { IQueriesCache } from "../../../models/ISearch"
import { CacheAction,CacheActionEnum, CacheState } from "./types"

const initialState: CacheState = {
    selectSmall: [] as any,
    queriesCache: [] as any
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
        default:
           return state
    }
}