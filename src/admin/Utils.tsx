import { Button, Card, Layout, Modal, Row, Table, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult, SortOrder } from 'antd/lib/table/interface';
import { ColumnsType, ColumnType  } from 'antd/es/table';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import UtilForm from '../components/admin/UtilForm';
import { useAction } from '../hooks/useAction';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { IUtil, IFilter } from '../models/admin/IUtil';
import MSelect from '../components/MSelect/MSelect';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../axios/axios';
import { SearchPagination } from '../models/ISearch';


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


const Utils:FC = () => {
  const { t } = useTranslation();
  const searchP = {
    _limit: '5',
    _page: '1',
    _offset: "name asc" 
  } as SearchPagination
  const [modalVisible, setModalVisible] = useState(false)
  const {error, isLoading, utils,filters,utilsCount } = useTypedSelector(state => state.admin)
  const {fetchUtils, createUtil, setUtils} = useAction()

  const [typeSelect, setTypeSelect] = useState('')
  function  SubmitUtil(util:IUtil) {
    debugger
    if(!error) {
       setModalVisible(false)
       fetchUtils(searchP)
       setSelectedId('')
    }
  }

  useEffect(() => {
    fetchUtils(searchP)
      
  }, [])

  useEffect(() => {
   console.log('error', error);
   
      
  }, [error])

  useEffect(
    () => {
    setPagination({...pagination, total: utilsCount})
    }, [utilsCount]
  )

  const [pagination, setPagination] = useState({ current: +searchP._page, pageSize: +searchP._limit, total: utilsCount} as TablePaginationConfig )
  const [sorter, setSorter] =  useState( {} as SorterResult<any> | SorterResult<any>[])
  const [filter, setFilter] = useState({ } as Record<string, FilterValue | null> )
  const [selectedId, setSelectedId] = useState('')
  
  const goToObject = (event:any, id:string) => {
    event.stopPropagation()
    setModalVisible(true)
    setSelectedId(id)
  }
  const columns: ColumnsType<IUtil> = [
    {
      key: 'id',
      title: 'Id',
      dataIndex: 'id',
      sorter: true,
      render: (id) => {
        return (
          <a
            // onClick={(event) => event.stopPropagation()}
            // href={name}
            // target="_blank"
            onClick={(event) => goToObject(event, id  ) }
          >
            {id} 
          </a>
        );}
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      render: (name, id) => {
        return (
          <a
            // onClick={(event) => event.stopPropagation()}
            // href={name}
            // target="_blank"
            onClick={(event) => goToObject(event, name  ) }
          >
            {name} 
          </a>
        );}
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      sorter: true,
      filters: filters
    },
    {
      key: 'code',
      title: 'Code',
      dataIndex: 'code',
    }
  ]

    const handleTableChange = (pagination: TablePaginationConfig, filter: Record<string, FilterValue | null>, sorter: SorterResult<any> | SorterResult<any>[]   ) => {  
      
    setPagination({...pagination, total: utilsCount})
    console.log('pagination',pagination);
    setSorter(sorter)
    //console.log('sorter',sorter);
    setFilter(filter)
    //console.log('filter',filter); 
    let page = pagination.current?.toString() || '1'
    fetchUtils({...searchP, _page: page } ) 

    
     //if(sorter)
     //{
      //  let sorter_ = JSON.parse(JSON.stringify(sorter))
      //  let order:string = sorter_.order ? sorter_.field : 'ascend'
      //  let field:string =  sorter_.field ? sorter_.field : 'name'
      //  if(order === 'ascend' )
      //  {
      //   utils.sort(function(a:IUtil, b:IUtil) {
      //     console.log('a', a[''+field]);
      //     console.log('b', b);
      //     return a.name.localeCompare(b.name)
      //   });
      //  }
      //  else
      //  {
      //   utils.sort(function(a:IUtil, b:IUtil) {
      //     return b[field].localeCompare(a[field])
      //   });
      //  }

      //console.log('sorter', JSON.parse(JSON.stringify(sorter) ));
    // }
  }
  const openCloseModal = (value:boolean) => {
    if(!value)  setSelectedId('')
    setModalVisible(value)
  }

   interface SelectOption {
    readonly value: string;
    readonly label: string;
    readonly code: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
  }
  
   
  // const promiseOptions = (inputValue: string) =>
  //   new Promise<SelectOption[]>((resolve) => {
  //     console.log('promiseOptions');
      
  //     setTimeout(() => {
  //       resolve(filterColors(inputValue));
  //     }, 1000);
  //   });
  const initSelectOptions:any = {
    type: [] as SelectOption[],
    name: [] as SelectOption[]
  }
  const [selectOptions , setSelectOptions] = useState(initSelectOptions)
  const initSelectValues:any = {
    // type: {label: 'contact_num', value: 'contact_num', code: 'contact_num'} as any,
    // name: {label: 'customer', value: 'F6E06AC23A9245858C5827585249DC16', code: 'F6E06AC23A9245858C5827585249DC16'} as any

    type: {} as any,
    name: {} as any,
  }
  const [selectValues , setSelectValues] = useState(initSelectValues) 
  const promiseOptions = async (inputValue: string, name: string, what:string, tname:string, where:string, big: boolean = false) => {
    console.log(where);
    
    if(selectOptions[name].length === 0 || big) {
      const response = await  axiosFn("get", '', what, tname, where , ''  )  
    let hasError = false;
    if(response.data["error"]) hasError = true;
      if(response.data&&!hasError)
      {
        setSelectOptions({...selectOptions, [name]: response.data}) 
        return response.data
      } 
    }
    else // not big table
      {
        return selectOptions[name].filter((i:SelectOption) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
      }
  }  
  const selectChanged = (selectChange:any, name:string) =>
    {
       console.log('selectChange', selectChange);
       setSelectValues({...selectOptions, [name]: selectChange })
    }

  return (
    <Layout>
      {
        utilsCount && 
        <h1>{utilsCount}</h1> 
      }
      {error && 
      <h1>{error}</h1>
      }
       <AsyncSelect 
       isClearable={true}
       placeholder="type"
       cacheOptions 
       defaultOptions
       loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'type',  'distinct type as label, type as value , type as code', 'utils', '', false )} 
       onChange={(selectChange:any) => selectChanged(selectChange, 'type')}
       value={selectValues.type}
       />
       <AsyncSelect 
       isClearable={true}
       placeholder="name"
       cacheOptions={false} 
       defaultOptions
       loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'name',  ' top 10 name as label, id as value , id as code', 'utils', ` name like '%${inputValue.trim()}%' `, true )} 
       onChange={(selectChange:any) => selectChanged(selectChange, 'name')}
       value={selectValues.name}
       />
      {/* <MSelect
        mode={'tags'}
        placeholder = "Search By name or type"
        style = {{ width: '25%' }}
        tname = "utils"
        where = ""
        what = " distinct type as label, type as value , type as code "
      /> */}
  
      <Row justify="center" align="middle" >
      <Table<IUtil> 
      columns={columns} 
      dataSource={utils} 
      loading={isLoading}
      rowKey="id"
      pagination={pagination}
      onChange={handleTableChange}
      />
      </Row>
      <Row justify="center" align="middle" >
      <Row justify="center">          
          <Button 
          onClick={() => openCloseModal(true)  }
          >{t('add_new')}</Button>
       </Row>
       <Modal
       title={t('add_new')}
       footer={null}
       onCancel={() => openCloseModal(false) }
       visible={modalVisible}
       >
         <Card>
           <UtilForm
           submit={util => SubmitUtil(util) }
           utils={utils}
           modalVisible={modalVisible}
           selectedId={selectedId}
           clearSelectedId={() => setSelectedId('') }
           />
         </Card>
       </Modal>
      </Row>
    </Layout>
  )
}



export default Utils;