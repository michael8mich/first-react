import { Button, Card, Checkbox, Col, Divider, Form, Input, Layout, Modal, Radio, Row, Table, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { ColumnsType  } from 'antd/es/table';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../hooks/useAction';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../../axios/axios';
import { SearchPagination, SelectOption } from '../../../models/ISearch';
import { FROM, searchFormWhereBuild, SELECT, uTd, WHERE } from '../../../utils/formManipulation';
import FilterOutlined from '@ant-design/icons/lib/icons/FilterOutlined';
import { useHistory } from 'react-router-dom';
import { RouteNames } from '../../../router';
import { ITicketCategoryObjects, ITicketCategory, ITicketCategoryObjectsMulti } from '../../../models/ITicket';
import { ASSIGNEE_LIST, GROUP_LIST, NOT_GROUP_LIST } from '../../../models/IUser';

const SORT_DEFAULT = 'name asc'
const LIMIT_DEFAULT = '10'
const WHERE_DEFAULT = ' active = 1 '

const TCategories:FC = () => {
  const { t } = useTranslation();
  const searchP = {
    _limit: LIMIT_DEFAULT,
    _page: '1',
    _offset: SORT_DEFAULT
  } as SearchPagination
  const {error, isLoading, categories, categoriesCount } = useTypedSelector(state => state.ticket)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const {fetchCategories, setSelectSmall} = useAction()

  const [typeSelect, setTypeSelect] = useState('')


  useEffect(() => {
    fetchCategories(searchP, where)
      
  }, [])

  useEffect(() => {
   console.log('error', error);
  }, [error])

  useEffect( () => {
    setPagination({...pagination, total: categoriesCount})
    }, [categoriesCount]
  )
  const router = useHistory()
  const [pagination, setPagination] = useState({ current: +searchP._page, pageSize: +searchP._limit, total: categoriesCount} as TablePaginationConfig )
  const [where, setWhere] = useState(WHERE_DEFAULT as string )
  const [filter, setFilter] = useState({ } as Record<string, FilterValue | null> )
  const [form] = Form.useForm()
  const [viewForm, setViewForm] = useState(true )
  const goToObject = (event:any, id:string) => {
    event.stopPropagation()
    router.push(RouteNames.TCATEGORIES + '/' + id )
  }
  const columns: ColumnsType<ITicketCategory> = [
    {
      key: 'name',
      title: t('ticket_name'),
      dataIndex: 'name',
      sorter: true,
      render: (name, record, index) => {
        return (
          <a onClick={(event) => goToObject(event, record.id  ) }>
            {name} 
          </a>
        );}
    }
    ,
    {
      key: 'priority',
      title: t('priority'),
      dataIndex: 'priority',
      sorter: true,
      render: (priority, record ) => {
        return (
            <div>        
            {record.priority && record.priority.label} 
            </div>
        );}
    }
    ,
    {
      key: 'team',
      title: t('team'),
      dataIndex: 'team',
      sorter: true,
      render: (team, record) => {
        return (
            <div>        
            {record.team && record.team.label} 
            </div>
        );}
    }
    ,
    {
      key: 'assignee',
      title: t('assignee'),
      dataIndex: 'assignee',
      sorter: true,
      render: ( assignee, record) => {
        return (
            <div>        
            {record.assignee && record.assignee.label} 
            </div>
        );}
    }
  ]

    const handleTableChange = (pagination: TablePaginationConfig, filter: Record<string, FilterValue | null>, sorter: SorterResult<any> | SorterResult<any>[]   ) => {  
    setPagination({...pagination, total: categoriesCount})
    setFilter(filter)
    let page = pagination.current?.toString() || '1'
    let sorter_ = JSON.parse(JSON.stringify(sorter))
    let pageSize = pagination.pageSize || LIMIT_DEFAULT
    let _offset = 
    sorter_.field ?
    sorter_.field + ' ' + (sorter_.order ? sorter_.order === 'descend' ? ' DESC' : ' ASC' : ' ASC')
    : SORT_DEFAULT
    
    console.log('_offset',_offset);
    fetchCategories({...searchP, _page: page, _offset: _offset, _limit: pageSize.toString() } , where) 
  }

   
  const initSelectOptions:any = {

  }
  const [selectOptions , setSelectOptions] = useState(initSelectOptions)
  const initSelectValues:any = {
  
  }
  const [selectValues , setSelectValues] = useState(initSelectValues) 
  const promiseOptions = async (inputValue: string, name: string, what:string, tname:string, where:string, big: boolean = false) => {

    if(Object.keys(selectSmall).find( k=> k === name) && inputValue.length === 0 ) {
        let arr:any = {...selectSmall}
  
        if(inputValue.length === 0)
        return arr[name]
        else
        return arr[name].filter((i:SelectOption) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
      }
      
    let not_found = !Object.keys(selectOptions).find( k=> k === name)
      if(not_found || big) {
        if(inputValue.length !== 0 && big) {
          where = " (" + where + ") and name like N'%" + inputValue + "%' "
        }
        const response = await  axiosFn("get", '', what, tname, where , ''  )  
      let hasError = false;
      if(response.data["error"]) hasError = true;
        if(response.data&&!hasError)
        {
          setSelectOptions({...selectOptions, [name]: response.data}) 
          if(inputValue.length === 0 )
          setSelectSmall( { [name]: response.data } )
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
       setSelectValues({...selectOptions, [name]: selectChange })
    }
    const SelectStyles = {
      container: (provided: any) => ({
        ...provided,
        width: '100%',
        opacity: '1 !important'
      })
    };

    const fastSearchArray = ['name', 'assignee_name', 'team_name']
    const onFinish = async (values: any) => { 
      console.log('Success:', values);
      let valuesMulti:string = ''
      let ticket_types_where = ''
      ITicketCategoryObjectsMulti.map(t => {
        if(values[t])
        values[t].map( (a: { value: string; }, index: number) => {
          valuesMulti += "'" + a.value.replace("'", "''") + "'" + (values[t].length-1 !== index ? ' , ' : '')
        })
        if(t==='ticket_types' && valuesMulti.length!==0)
        ticket_types_where = " id in ( "+SELECT+" parent "+FROM+" util_parent "+WHERE+" parent_type = 'ticket_types' and util in ("+ valuesMulti +")) "
        delete values[t]  
       })
      
      let where_ = searchFormWhereBuild(values, fastSearchArray)
      if(where_.length>0 && ticket_types_where.length>0)
      where_ = where_ + ' AND ' + ticket_types_where 
      else
      where_ = where_ + ' ' + ticket_types_where 

      fetchCategories({...searchP } , where_)
      setWhere(where_)
      
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }
    const createNew = () => {
      router.push(RouteNames.TCATEGORIES + '/0')
    }
    const buildTitle = () =>
    {
        return (
          <h1 style={{padding:'10px'}}>{   t('search')} { t('tcategories')}</h1>
        )
    }
  return (
    <Layout style={{height:"100vh"}}>
      <Card style={{background:'#fafafa', border:'solid 1px lightgray', marginTop:'10px'}}>
      {error && 
     <h1 className='ErrorH1'>{error}</h1>
      }
       <Form
       // layout="vertical"
       form={form}
       name="basic"
       // labelCol={{ span: 8 }}
       // wrapperCol={{ span: 30 }}
       initialValues={{active: true}}
       onFinish={onFinish}
       onFinishFailed={onFinishFailed}
       autoComplete="off" 
       > 
        <Row>
        <div style={{display:'flex', justifyContent:'start'}}>
        <Col  xs={12} xl={24}>
        
         {buildTitle()}
         </Col>
         <Col  xs={12} xl={24}>
         <Button type="primary" htmlType="submit" loading={isLoading}
         >
         { t('search') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="button" 
         onClick={() => form.resetFields() }
         >
         { t('clear') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button  style={{ background: "#01a77c", borderColor: "white" }}
          onClick={() => createNew()  }
          >{t('add_new')}</Button>&nbsp;&nbsp;&nbsp;
          {viewForm ? 
         <FilterOutlined style={{color:'gray', fontSize: '24px'}}
         onClick={() => setViewForm(false)}
         />  :
          <FilterOutlined 
          onClick={() => setViewForm(true)}
          style={{color:'green', fontSize: '24px'}}  
          rotate={180} />  
        } 
        
         </Col>
         </div>
        </Row>
        {viewForm &&
        <>
        <Row  >
           <Col xs={24} xl={5}  >
           <Form.Item
           // label={ t('name') }
           name="name" 
           style={{ padding:'5px'}} > 
           <Input 
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('name') }
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={5}  >
           <Form.Item 
           // label={ t('type') }
           name="ticket_types"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
           menuPosition="fixed"
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('ticket_type') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ticket_types',  ' top 30 name as label, id as value , code as code', 'utils', " type = 'ticket_type' ", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'ticket_types')}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={4}  >
           <Form.Item
           label={ t('active') }
           name="active" 
           style={{ padding:'5px'}} 
           valuePropName="checked"
           > 
           <Checkbox 
             style={{ height:'38px', width: 'maxContent'}}
             defaultChecked={true}
           />
           </Form.Item>
           </Col>
      </Row>
        <Row >
           <Col xs={24} xl={5} >
           <Form.Item 
           // label={ t('type') }
           name="team"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
           menuPosition="fixed"
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('team') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'team',  ' top 20 name as label, id as value , id as code ', 'V_contacts', GROUP_LIST , false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'team')}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={4}  > 
           <Form.Item 
           // label={ t('type') }
           name="assignee"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
           menuPosition="fixed"
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('assignee') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'assignee',  ' top 20 name as label, id as value , id as code ', 'V_contacts', ASSIGNEE_LIST , false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'assignee')}
           />
           </Form.Item>
           </Col>
          <Col  xs={24} xl={12} >
          <Form.Item
        //  label={ t('fast_search') }
          name="fast_search" 
          style={{display:'flex', width:'100%', padding:'5px'}} > 
          <Input 
          style={{ height:'38px', width: '400px'}}
          placeholder={ t('fast_search') }
          />
          </Form.Item>
          </Col>
     </Row>
     </>
      }
   </Form>
     
      <Row justify="center" align="middle" >
      <Table<ITicketCategory> 
      rowClassName={(record) => record.active === 1 ? 'table-row-light' :  'table-row-dark'}
      columns={columns} 
      dataSource={categories} 
      loading={isLoading}
      rowKey={record => record.id}
      bordered
      pagination={pagination}
      onChange={handleTableChange}
      title={() => <h3>{t('tcategories')}</h3> }
      footer={() => t('total_count') + ' ' + categoriesCount}
      style={{width: '100%', padding: '5px'}}
      // scroll={{ x: 1500, y: 700 }}
      expandable={{
        expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
        rowExpandable: record => record.description !== '',
      }}
      />
      </Row>
      </Card>
    </Layout>
  )
}



export default TCategories;

