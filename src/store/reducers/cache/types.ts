import { IQueriesCache } from "../../../models/ISearch";

export interface CacheState {
    selectSmall:  any[]
    queriesCache: any[]
}
export enum CacheActionEnum {
    SET_SELECT_SMALL = "SET_SELECT_SMALL",
    SET_QUERIES_CACHE = "SET_QUERIES_CACHE",
}

export interface SetCacheSmallAction {
    type: CacheActionEnum.SET_SELECT_SMALL,
    payload: any
}

export interface SetCacheQueriesAction {
    type: CacheActionEnum.SET_QUERIES_CACHE,
    payload: any
}

export type CacheAction = 
SetCacheSmallAction |
SetCacheQueriesAction
