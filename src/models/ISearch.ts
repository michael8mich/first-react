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
  count:number
  index:number
  }
  export interface IQueriesCache {
    factory: string
    query: string
  }

// interface Pagination  {
//   current: number,
//   pageSize: number
// }
// interface Sorter {
//     column?: ColumnType<any> | undefined;
//     order?: SortOrder | undefined;
//     field?: React.Key | readonly React.Key[] | undefined;
//     columnKey?: React.Key | undefined;
// }
// interface SortProperty  {
//   sortOrder: number,
//   property: string[]
// } 