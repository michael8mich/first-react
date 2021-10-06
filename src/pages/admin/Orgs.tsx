import { Button, Card, Checkbox, Col, Divider, Form, Input, Layout, Modal, Radio, Row, Table, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { ColumnsType  } from 'antd/es/table';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../axios/axios';
import { SearchPagination, SelectOption } from '../../models/ISearch';
import { searchFormWhereBuild } from '../../utils/formManipulation';
import FilterOutlined from '@ant-design/icons/lib/icons/FilterOutlined';
import { useHistory } from 'react-router-dom';
import { RouteNames } from '../../router';
import { IObjects, IOrg } from '../../models/IOrg';

const SORT_DEFAULT = 'name asc'
const LIMIT_DEFAULT = '10'

const Orgs:FC = () => {
  const { t } = useTranslation();
  const searchP = {
    _limit: LIMIT_DEFAULT,
    _page: '1',
    _offset: SORT_DEFAULT
  } as SearchPagination
  const {error, isLoading, orgs, orgsCount } = useTypedSelector(state => state.admin)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const {fetchOrgs, setSelectSmall} = useAction()

  const [typeSelect, setTypeSelect] = useState('')


  useEffect(() => {
    fetchOrgs(searchP, where, IObjects)
      
  }, [])

  useEffect(() => {
   console.log('error', error);
  }, [error])

  useEffect( () => {
    setPagination({...pagination, total: orgsCount})
    }, [orgsCount]
  )
  const router = useHistory()
  const [pagination, setPagination] = useState({ current: +searchP._page, pageSize: +searchP._limit, total: orgsCount} as TablePaginationConfig )
  const [where, setWhere] = useState(' active = 1 ' as string )
  const [filter, setFilter] = useState({ } as Record<string, FilterValue | null> )
  const [form] = Form.useForm()
  const [viewForm, setViewForm] = useState(true )
  const goToObject = (event:any, id:string) => {
    event.stopPropagation()
    router.push(RouteNames.ORGS + '/' + id )
  }
  const columns: ColumnsType<IOrg> = [
    {
      key: 'name',
      title: t('name'),
      dataIndex: 'name',
      sorter: true,
      render: (name, record, index) => {
        return (
          <a onClick={(event) => goToObject(event, record.id  ) }>
            {name} 
          </a>
        );}
    
    },
    {
      key: 'address1',
      title: t('address1'),
      dataIndex: 'address1',
      sorter: true,
      // filters: filters
    },
    {
      key: 'phone',
      title: t('phone'),
      dataIndex: 'phone',
      sorter: true,
    }
    ,
    {
      key: 'organizational_type',
      title: t('organizational_type'),
      dataIndex: 'organizational_type',
      sorter: true,
      render: (name, record, index) => {
        return (
            <>        
            {record.organizational_type.label} 
            </>
        );}
    }
    ,
    {
      key: 'manager',
      title: t('manager'),
      // dataIndex: 'job_title',
      sorter: true,
      render: (name, record, index) => {
        return (
            <div>        
            {record.manager.label} 
            </div>
        );}
    }
  ]

    const handleTableChange = (pagination: TablePaginationConfig, filter: Record<string, FilterValue | null>, sorter: SorterResult<any> | SorterResult<any>[]   ) => {  
    setPagination({...pagination, total: orgsCount})
    setFilter(filter)
    let page = pagination.current?.toString() || '1'
    let sorter_ = JSON.parse(JSON.stringify(sorter))
    let _offset = 
    sorter_.field ?
    sorter_.field + ' ' + (sorter_.order ? sorter_.order === 'descend' ? ' DESC' : ' ASC' : ' ASC')
    : SORT_DEFAULT
    
    console.log('_offset',_offset);
    fetchOrgs({...searchP, _page: page, _offset: _offset } , where, IObjects) 
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

    const fastSearchArray = ['address1', 'address1', 'address1', 'name', 'phone', 'manager_name']
    const onFinish = async (values: any) => { 
      console.log('Success:', values);
      let where_ = searchFormWhereBuild(values, fastSearchArray)
      fetchOrgs({...searchP } , where_, IObjects)
      setWhere(where_)
      
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }
    const createNew = () => {
      router.push(RouteNames.ORGS + '/0')
    }
  return (
    <Layout style={{height:"100vh"}}>
      {error && 
      <h1>{error}</h1>
      }
      {viewForm ?
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
       
        <Row  >
           <Col xs={12} xl={6}  >
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
           <Col  xs={12} xl={6}>
           <Form.Item 
           // label={ t('type') }
           name="organizational_type"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
      menuPosition="fixed"
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('organizational_type') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'organizational_type',  ' top 30 name as label, id as value , code as code', 'utils', " type = 'organizational_type' ", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'organizational_type')}
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={6}  >
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
       <Col  xs={24} xl={8} >
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
        <Col  xs={24} xl={8}>
        <Form.Item 
         style={{ padding:'15px'}}
         wrapperCol={{ offset: 8, span: 16 }}>
         <Button type="primary" htmlType="submit" loading={isLoading}
         >
         { t('search') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="button" 
         onClick={() => form.resetFields() }
         >
         { t('clear') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button  style={{ background: "orange", borderColor: "white" }}
          onClick={() => createNew()  }
          >{t('add_new')}</Button>&nbsp;&nbsp;&nbsp;
         <FilterOutlined style={{color:'gray', fontSize: '24px'}}
         onClick={() => setViewForm(false)}
         />     
   
         </Form.Item>
         </Col>
     </Row>
   </Form>
  :
  <FilterOutlined 
  onClick={() => setViewForm(true)}
  style={{color:'green', fontSize: '24px'}}  
  rotate={180} />
      }
     
      <Row justify="center" align="middle" >
      <Table<IOrg> 
      rowClassName={(record) => record.active === 1 ? 'table-row-light' :  'table-row-dark'}
      columns={columns} 
      dataSource={orgs} 
      loading={isLoading}
      rowKey="id"
      bordered
      pagination={pagination}
      onChange={handleTableChange}
      title={() => <h3>{t('orgs')}</h3> }
      footer={() => t('total_count') + ' ' + orgsCount}
      style={{width: '100%', padding: '5px'}}
      // scroll={{ x: 1500, y: 700 }}
      expandable={{
        expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
        rowExpandable: record => record.description !== '',
      }}
      />
      </Row>
    </Layout>
  )
}



export default Orgs;
