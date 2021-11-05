import { CHART_CONFIG } from "../../../models/IChart";
import { IQueriesCache } from "../../../models/ISearch";

export interface CacheState {
    selectSmall:  any[]
    queriesCache: any[]
    pathForEmpty: string
    configs: CHART_CONFIG[]
}
export enum CacheActionEnum {
    SET_SELECT_SMALL = "SET_SELECT_SMALL",
    SET_QUERIES_CACHE = "SET_QUERIES_CACHE",
    SET_PATH_FOR_EMPTY = "SET_PATH_FOR_EMPTY",
    SET_CONFIGS = "SET_CONFIGS",
    SET_CONFIGS_ARR = "SET_CONFIGS_ARR"
}

export interface SetCacheSmallAction {
    type: CacheActionEnum.SET_SELECT_SMALL,
    payload: any
}

export interface SetCacheQueriesAction {
    type: CacheActionEnum.SET_QUERIES_CACHE,
    payload: any
}

export interface SetPathForEmptyAction {
    type: CacheActionEnum.SET_PATH_FOR_EMPTY,
    payload: string
}

export interface SetConfigsAction {
    type: CacheActionEnum.SET_CONFIGS,
    payload: CHART_CONFIG
}

export interface SetConfigsCleanAction {
    type: CacheActionEnum.SET_CONFIGS_ARR,
    payload: CHART_CONFIG[]
}

export type CacheAction = 
SetCacheSmallAction |
SetCacheQueriesAction |
SetPathForEmptyAction |
SetConfigsAction |
SetConfigsCleanAction
