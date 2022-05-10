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
import { nowDateString, searchFormWhereBuild, uTd } from '../../utils/formManipulation';
import { FilterOutlined, FileExcelOutlined } from '@ant-design/icons/lib/icons';
import { GROUP_LIST, IUserObjects, IUser, NOT_GROUP_LIST, TEAM_TYPE_ID } from '../../models/IUser';
import { useHistory } from 'react-router-dom';
import { RouteNames } from '../../router';
import QueryBuild from '../../components/QueryBuild';
import { CSVLink } from 'react-csv';

const SORT_DEFAULT = 'name asc'
const LIMIT_DEFAULT = '10'
const WHERE_DEFAULT = ' active = 1  AND ' + NOT_GROUP_LIST

const Users:FC = () => {
  const { t } = useTranslation();
  const searchP_ = {
    _limit: LIMIT_DEFAULT,
    _page: '1',
    _offset: SORT_DEFAULT
  } as SearchPagination
  const {error, isLoading, users, usersCount } = useTypedSelector(state => state.admin)
  const {selectSmall, queriesCache } = useTypedSelector(state => state.cache)
  const {fetchUsers, setSelectSmall, setQueriesCache, setAlert} = useAction()
  const [typeSelect, setTypeSelect] = useState('')
  const [qName, setQName] = useState('')  

  const [searchP, setSearchP] = useState(searchP_)

  useEffect(() => {
    if(Object.keys(queriesCache).find( k=> k === 'contact')) {
      let arr:any = {...queriesCache}
      fetchUsers(searchP, arr['contact'], IUserObjects)
      setQName(arr['contact_label'])
    }
    else
    fetchUsers(searchP, where, IUserObjects)
      
  }, [queriesCache] )

  useEffect(() => {
   console.log('error', error);
  }, [error])

  useEffect( () => {
    setPagination({...pagination, total: usersCount})
    }, [usersCount]
  )
  const router = useHistory()
  const [pagination, setPagination] = useState({ current: +searchP._page, pageSize: +searchP._limit, total: usersCount} as TablePaginationConfig )
  const [where, setWhere] = useState(WHERE_DEFAULT as string )
  const [filter, setFilter] = useState({ } as Record<string, FilterValue | null> )
  const [form] = Form.useForm()
  const [viewForm, setViewForm] = useState(true )
  const goToObject = (event:any, id:string) => {
    event.stopPropagation()
    router.push(RouteNames.USERS + '/' + id )
  }
  const columns: ColumnsType<IUser> = [
    {
      key: 'name',
      title: t('name'),
      dataIndex: 'name',
      sorter: true,
      width: 140,
      render: (name, record, index) => {
        return (
          <a onClick={(event) => goToObject(event, record.id  ) }>
            {name} 
          </a>
        );},
        fixed: 'left'
    
    },
    {
      key: 'login',
      title: t('login_name'),
      dataIndex: 'login',
      sorter: true,
      // filters: filters
    },
    {
      key: 'email',
      title: t('email'),
      dataIndex: 'email',
      sorter: true,
    }
    ,
    {
      key: 'contact_type',
      title: t('contact_type'),
      dataIndex: 'contact_type',
      sorter: true,
      render: (name, record, index) => {
        return (
            <>        
            {record.contact_type.label} 
            </>
        );}
    }
    ,
    {
      key: 'job_title',
      title: t('job_title'),
      // dataIndex: 'job_title',
      sorter: true,
      render: (name, record, index) => {
        return (
            <div>        
            {record.job_title.label} 
            </div>
        );}
    }
  ]

    const handleTableChange = (pagination: TablePaginationConfig, filter: Record<string, FilterValue | null>, sorter: SorterResult<any> | SorterResult<any>[]   ) => {  
    setPagination({...pagination, total: usersCount})
    setFilter(filter)
    let page = pagination.current?.toString() || '1'
    let sorter_ = JSON.parse(JSON.stringify(sorter))
    let pageSize = pagination.pageSize || LIMIT_DEFAULT
    let _offset = 
    sorter_.field ?
    sorter_.field + ' ' + (sorter_.order ? sorter_.order === 'descend' ? ' DESC' : ' ASC' : ' ASC')
    : SORT_DEFAULT
    
    console.log('_offset',_offset);
    fetchUsers({...searchP, _page: page, _offset: _offset, _limit: pageSize.toString() } , where, IUserObjects) 
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

    const fastSearchArray = ['login', 'name', 'email']
    const onFinish = async (values: any) => { 
      setQName('')
      setQueriesCache({ contact: '', contact_label: '' })
      console.log('Success:', values);
      let usersTeams = values.usersTeams
      delete values.usersTeams 
      let where_ = searchFormWhereBuild(values, fastSearchArray)
      where_ = where_ + ( where_.length > 0 ? ' AND ' + usersTeams : usersTeams )
      console.log(where_);
      fetchUsers({...searchP } , where_, IUserObjects)
      setWhere(where_)
      
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }
    const createNew = () => {
      router.push(RouteNames.USERS + '/0')
    }
    const buildTitle = () =>
    {
        return (
          <h1 style={{padding:'10px'}}>{   t('search')} { t('users')}</h1>
        )
    }
    const columnsCsv: { label: string, key: string }[] = [
      { label: t('last_name'), key: "last_name" }, 
      { label: t('first_name'), key: "first_name" }, 
      { label: t('email'), key: "email" }, 
      { label: t('username'), key: "username" }, 
      { label: t('locale'), key: "locale" }, 
      { label: t('contact_number'), key: "contact_number" }, 
      { label: t('job_title'), key: "job_title" }, 
      { label: t('contact_type'), key: "contact_type" }, 
      { label: t('phone'), key: "phone" }, 
      { label: t('mobile_phone'), key: "mobile_phone" }, 
      { label: t('additional_phone'), key: "additional_phone" }, 
      { label: t('manager'), key: "manager" }, 
      { label: t('organization'), key: "organization" }, 
      { label: t('location'), key: "location" }, 
      { label: t('department'), key: "department" }, 
      { label: t('site'), key: "site" }, 
      { label: t('defaultRole'), key: "defaultRole" }, 
    ]
     
    const csvConvert = () => {
      let tickets_csv:any[] = []
          users.map( t => 
            tickets_csv.push(
              {
                last_name: t.last_name,
                first_name: t.first_name,
                email: t.email,
                username: t.login,
                locale: t.locale,
                contact_number: t.contact_number,
                assignee: t.job_title?.label,
                contact_type: t.contact_type?.label,
                priority: t.phone,
                mobile_phone: t.mobile_phone,
                additional_phone: t.additional_phone,
                manager: t.manager?.label,
                organization: t.organization?.label,
                location: t.location?.label,
                department: t.department?.label,
                site: t.site?.label,
                defaultRole: t.defaultRole?.label,
              }
            )
          )
          return   tickets_csv
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
       initialValues={{active: true, usersTeams: NOT_GROUP_LIST}}
       onFinish={onFinish}
       onFinishFailed={onFinishFailed}
       autoComplete="off" 
       > 
       <Row>
        <div style={{display:'flex', justifyContent:'start'}}>
        <Col  xs={4} sm={6} xl={24}>
        
         {buildTitle()}
         </Col>
         
         <Col  xs={20} sm={18} xl={24} >
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
          >{t('add_new', { object: t('user') })}</Button>&nbsp;&nbsp;&nbsp;
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
         <Button 
         >
         <FileExcelOutlined style={{color:'#1eb386'}}/>&nbsp;
         <CSVLink
              filename={ t('users') + "_" + nowDateString() + ".csv" }
              data={csvConvert()}
              headers={columnsCsv}
              className="btn btn-primary"
              onClick={()=>{
                setAlert({
                  type: 'success' ,
                  message: t('list_to_csv_success') ,
                  closable: true ,
                  showIcon: true ,
                  visible: true,
                  autoClose: 10 
                })
              }}
            >
              {t('export_to_csv')}
            </CSVLink> 
            </Button>
            <Row >
            
              <Col>
            <Input 
            style={{
                  width: 50,
                  height: 31,
                  marginLeft: 5,
                  marginRight: 5,
                  borderColor:'gray'
                }}
            value={pagination.pageSize}
            onChange={(event) => {
              setPagination({...pagination, pageSize: +event.target.value});
              setSearchP({...searchP, _limit: event.target.value })   
            }
            }
            />
            </Col> 
            <Col>
            <label >
            {t('size') + ' ' + t('page')}
            </label>
            </Col>
            </Row>
         </div>
        </Row>
        {viewForm &&
        <>
        <Row  >
           <Col xs={24} xl={6}  >
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
           <Col xs={24} xl={6}>
           <Form.Item 
           // label={ t('type') }
           name="contact_type"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
           menuPosition="absolute"
           maxMenuHeight={150}
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('type') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'contact_type',  ' top 30 name as label, id as value , code as code', 'utils', " type = 'contact_type' ", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'contact_type')}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={6}  >
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
           <Col xs={24} xl={6}  >
           <Form.Item
          //  label={ t('active') }
           name="usersTeams" 
           style={{ padding:'5px'}} 
           > 
           <Radio.Group defaultValue={NOT_GROUP_LIST} buttonStyle="solid">
            <Radio.Button value={NOT_GROUP_LIST}>{t('users')}</Radio.Button>
            <Radio.Button value={GROUP_LIST}>{t('teams')}</Radio.Button>
          </Radio.Group>
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
         style={{ height:'38px', width: 'maxContent'}}
         placeholder={ t('fast_search') }
        />
        </Form.Item>
        </Col>
        <Col xs={24} xl={12} >
        {
          <QueryBuild 
          where={where}
          factory={'contact'}
          />
        }
        </Col>
       </Row>
       </>
      }
   </Form>

     
      <Row justify="center" align="middle" >
      <Table<IUser> 
      rowClassName={(record) => record.active === 1 ? 'table-row-light' :  'table-row-dark'}
      columns={columns} 
      dataSource={users} 
      loading={isLoading}
      rowKey="id"
      bordered
      pagination={pagination}
      onChange={handleTableChange}
      title={() => <h3>{t('users')}/{t('teams') + ' ' + t('total_count') + ' ' + usersCount }  { qName ? (t('query') +  ': ' + qName) : '' }</h3> }
      footer={() => t('total_count') + ' ' + usersCount}
      style={{width: '100%', padding: '5px'}}
      scroll={{ x: 1500, y: 550 }}
      // scroll={{ x: 1500, y: 700 }}
      // expandable={{
      //   expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
      //   rowExpandable: record => record.description !== '',
      // }}
      />
      </Row>
      </Card>
    </Layout>
  )
}



export default Users;

