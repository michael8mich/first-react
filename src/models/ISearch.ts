
export const SIDER_NO_FOLDER = '2D73FF81318525D009623BD3433E696A'
export const HOME_FOLDER = 'E5D87D8CF5E08C28A4D4D8A1B9DBBBC5'
export const NEW_SIDER_FOLDER = 'E008D31969C1E1106BB4BC0293B0C876'
export interface SearchPagination {
    _limit: string,
    _page: string,
    _offset: string 
  }
export interface SelectOption {
    notify?: any;
    readonly value: string;
    readonly label: string;
    readonly code: string;
    readonly color?: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
  }
  export interface IQuery {
  name: string
	id: string
	object: string
	factory: string
	active: number
	query: string
	seq: number
	folder: string
	default: number
	last_mod_by: string
	last_mod_dt: string
	create_date: string
  count:string
  countPrev?: string
  index:number
  key?:string
  }
  export interface IQueriesCache {
    factory: string
    query: string
  }

