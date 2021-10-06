export interface CacheState {
    selectSmall: any[]
}
export enum CacheActionEnum {
    SET_SELECT_SMALL = "SET_SELECT_SMALL",
}

export interface SetCacheSmallAction {
    type: CacheActionEnum.SET_SELECT_SMALL,
    payload: any
}
export type CacheAction = 
SetCacheSmallAction 