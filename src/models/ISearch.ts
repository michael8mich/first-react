export interface SearchPagination {
    _limit: string,
    _page: string,
    _offset: string 
  }
export interface SelectOption {
    readonly value: string;
    readonly label: string;
    readonly code: string;
    readonly color?: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
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