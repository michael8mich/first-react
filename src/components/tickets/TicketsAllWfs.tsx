import { Alert, Badge, Button, Card, Checkbox, Col, DatePicker, Divider, Dropdown, Form, Input, Layout, Menu, Modal, Pagination, Popover, Radio, Row, Table, TablePaginationConfig, Tooltip } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { ColumnsType  } from 'antd/es/table';
import  {FC, Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../axios/axios';
import { IQueriesCache, IQuery, SearchPagination, SelectOption } from '../../models/ISearch';
import { DATETIMEFORMAT, searchFormWhereBuild, uTd } from '../../utils/formManipulation';
import { FilterOutlined, ExclamationCircleOutlined, UsergroupAddOutlined, PaperClipOutlined, FileSearchOutlined,
  FileExcelOutlined, PlusCircleOutlined, MinusCircleOutlined, BranchesOutlined }  from '@ant-design/icons/lib/icons';
import { useHistory, useParams } from 'react-router-dom';
import { RouteNames } from '../../router';
import { ITicketObjects, ITicketsAllWfs, ITicket, PRIORITY_HIGH, PRIORITY_MEDIUM, URGENCY_HIGH, URGENCY_MEDIUM, URGENCY_LOW, STATUS_CLOSE, ITicketLog, ITicketPrpTpl, WF_STATUS_COMPLETE, ITicketWfTpl, ITicketWfObjects, WF_STATUS_CANCEL, WF_STATUS_PEND, WF_TASK_START_GROUP, WF_TASK_END_GROUP } from '../../models/ITicket';
import { ANALYST_DTP, ASSIGNEE_LIST, GROUP_LIST, NOT_GROUP_LIST } from '../../models/IUser';
import ActivityForm from '../../pages/ticket/ActivityForm';
import QueryBuild from '../QueryBuild';
import PopoverDtl from '../../pages/ticket/PopoverDtl';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import {CSVLink} from "react-csv"
import { translateObj } from '../../utils/translateObj';
const { RangePicker } = DatePicker;
const SORT_DEFAULT = 'last_mod_dt desc'
const LIMIT_DEFAULT = '25'
const WHERE_DEFAULT = " status =  '" + WF_STATUS_PEND.value + "'"

const TicketsAllWfs:FC = () => {
  const { t } = useTranslation();
  const searchP = {
    _limit: LIMIT_DEFAULT,
    _page: '1',
    _offset: SORT_DEFAULT
  } as SearchPagination
  const {error, isLoading, ticketsAllWfs, ticketsAllWfsCount } = useTypedSelector(state => state.ticket)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const {fetchTicketsAllWfs, setSelectSmall, createTicket, createTicketActivity, setSelectedProperty, setProperties,setAlert, setPathForEmpty, setSelectedWfsId} = useAction()
  const {user, defaultRole } = useTypedSelector(state => state.auth)
  const [typeSelect, setTypeSelect] = useState('')
  const queryParams = new URLSearchParams(window.location.hash);
  const {queriesCache } = useTypedSelector(state => state.cache)

  const dataPartition = (where: string) => {

   where = "(" + where + ") AND ( task not in ('"+ WF_TASK_START_GROUP.value +"','"+ WF_TASK_END_GROUP.value +"') )" 
   if(defaultRole)
   if(defaultRole.label !== 'Admin') {
    return ANALYST_DTP.replace(/currentUser/g, user.id) + ( where !== '' ? " AND ( " + where + ")" : "" )
   }
   return where
  }
  useEffect(() => {
    if(Object.keys(queriesCache).find( k=> k === 'ticketAllWfs')) {
      let arr:any = {...queriesCache}
      fetchTicketsAllWfs(searchP, dataPartition(arr['ticketAllWfs']))
    }
    else
    fetchTicketsAllWfs(searchP, dataPartition(where))  
  }, [queriesCache])

  useEffect(() => {
   console.log('error', error);
  }, [error])

  useEffect( () => {
    setPagination({...pagination, total: ticketsAllWfsCount})
    }, [ticketsAllWfsCount]
  )
  const router = useHistory()
  const [pagination, setPagination] = useState({ current: +searchP._page, pageSize: +searchP._limit, total: ticketsAllWfsCount } as TablePaginationConfig )
  const [sorter, setSorter ] = useState(SORT_DEFAULT)
  const [where, setWhere] = useState(WHERE_DEFAULT as string )
  const [filter, setFilter] = useState({ } as Record<string, FilterValue | null> )
  const [form] = Form.useForm()
  const [viewForm, setViewForm] = useState(true )
  const [modalVisible, setModalVisible] = useState(false)
  const [activityType, setActivityType] = useState('') 
  const [selectedTicket, setSelectedTicket] = useState({} as ITicket)  
  const goToObject = (event:any, id:string, wf_id:string) => {
    event.stopPropagation()
    setSelectedWfsId(wf_id)
    router.push(RouteNames.TICKETS + '/' + id )
  }
  const priColors = (record:ITicket) => {
    let color = "green"
    if(record.priority?.value === PRIORITY_HIGH.value)
    color = 'red'
    if(record.priority?.value === PRIORITY_MEDIUM.value)
    color = 'orange'
    return {color: color}
  }

  const urgColors = (record:ITicket) => {
    let color = "green"
    if(record.urgency?.value === URGENCY_HIGH.value)
    color = 'red'
    if(record.urgency?.value === URGENCY_MEDIUM.value)
    color = 'orange'
    return {color: color}
  }
  const toMe = (record:ITicket) =>
  {
    let obj:any =  { assignee:user.id } 
    let id:string = record.id
    createTicket({...obj, id}, {}, user.id)
    ticketsAllWfs.map(t=>{
      if(t.id===id) 
      {
        t.assignee = { label: user.name, value: user.id, code: user.id, notify: false }
      }      
    })

  }
  const pathTrowEmpty = (path:string) => {
    setPathForEmpty(path)
    router.push(RouteNames.EMPTY)
  }

  const close_validation_fail = async (record:ITicket) => {
    let ret = false
    if(record?.ticketWfsCount) 
      if(record?.ticketWfsCount>0)
      {
        const response = await  axiosFn("get", '', '*', 'V_wfs', " ticket = '" + record.id + "'" , ''  ) 
        let wfs =  translateObj(response.data, ITicketWfObjects)
        let errorMsg = t('not_completed_workflows') 
        if(wfs)
        if(wfs?.length>0) {
          wfs.map(w=> {
            if(w.status?.value !== WF_STATUS_COMPLETE.value || w.status?.value !== WF_STATUS_CANCEL.value) 
            ret = true
          })
        }
        if(ret)
        {
          setAlert({
            type: 'warning' ,
            message: errorMsg ,
            closable: true ,
            showIcon: true ,
            visible: true,
            autoClose: 10 
          })
          return true
        }
      }  
      return false
  }
  const toClose = async (record:ITicket, type: string) =>
  {
    if(await close_validation_fail(record)) return  
    setSelectedTicket(record)
    setActivityType(type)
    setModalVisible(true)
    let id:string = record.id
    let obj:any =  { status:STATUS_CLOSE.value } 
    createTicket({...obj, id}, {}, user.id)
    ticketsAllWfs.map(t=>{
      if(t.id===id) 
      {
        t.status = STATUS_CLOSE
      }      
    })
  }
  
  const toComment = (record:ITicket, type: string) =>
  {
    setSelectedTicket(record)
    setActivityType(type)
    setModalVisible(true)
  }


  async function  SubmitActivity(values:any) {
    if(activityType === 'New Log Comment')
    {
       values = {...values, name: activityType, ticket: selectedTicket.id, old_value: '' }
       createTicketActivity(values, user.id)
       
    }
    if(activityType === 'Close Comment')
    {
      if(values.new_value) 
      {
        values = {...values, name: activityType, ticket: selectedTicket.id, old_value: '' }
        createTicketActivity(values, user.id)

      } 
     }
     setModalVisible(false)

  }
  
  const { height, width } = useWindowDimensions();
  const columns: ColumnsType<ITicketsAllWfs> = [
    {
      key: 'ticket_name',
      title: t('ticket_name'),
      sorter: true,
      fixed: 'left',
      width: 140,
      render: (ticket_name, record, index) => {
        return (
          <div 
             onClick={(event) => goToObject(event, record.ticket?.value, record.id  ) } style={{cursor: 'pointer'}}>
             {  record.ticket?.label }  
          </div>
        );}
    },
    {
      key: 'name',
      title: t('name'),
      sorter: true,
      render: (task, record, index) => {
        return (
          <div>
             {  record.name }  
          </div>
        );}
    },
    {
      key: 'task',
      title: t('task'),
      sorter: true,
      fixed: 'left',
      width: 140,
      render: (task, record, index) => {
        return (
          <div>
             {  record.task?.label }  
          </div>
        );}
    },
    {
      key: 'start_dt',
      title: t('start_dt'),
      dataIndex: 'start_dt',
      sorter: true,
      render: (create_date, record, index) => {
        return (
            <div>
              {uTd(record.start_dt)} 
            </div>
        )}
    
    },
    {
      key: 'customer',
      title: t('customer'),
      dataIndex: 'customer',
      sorter: true,
      render: ( customer, record) => {
        return (
            <div>        
            {record.customer && record.customer?.label} 
            </div>
        );}
    },
    {
      key: 'status',
      title: t('status'),
      dataIndex: 'status',
      sorter: true,
      render: ( status, record) => {
        return (
            <div>        
            {record.status && record.status?.label} 
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
            {record.team && record.team?.label} 
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
            {record.assignee && record.assignee?.label} 
            </div>
        );}
    }
    ,
    {
      key: 'category',
      title: t('tcategory'),
      dataIndex: 'category',
      sorter: true,
      fixed: width > 500 && 'right' ,
      render: (category, record ) => {
        return (
            <div>        
            {record.tcategory && record.tcategory?.label} 
            </div>
        );}
    }
  ]
  const columnsCsv: { label: string, key: string }[] = [
    { label: t('ticket_name'), key: "ticket_name" }, 
    { label: t('create_date'), key: "create_date" }, 
    { label: t('customer'), key: "customer" }, 
    { label: t('ticket_status'), key: "ticket_status" }, 
    { label: t('team'), key: "team" }, 
    { label: t('assignee'), key: "assignee" }, 
    { label: t('category'), key: "category" }, 
    { label: t('priority'), key: "priority" }, 
    { label: t('urgency'), key: "urgency" }, 
    { label: t('description'), key: "description" }, 
    { label: t('close_date'), key: "close_date" }, 
  ]
   
  const csvConvert = () => {
    let ticketsAllWfs_csv:any[] = []
    ticketsAllWfs.map( t => 
      ticketsAllWfs_csv.push(
            {
              ticket_name: t.name,
              create_date: uTd(t.last_mod_dt),
              customer: t.customer?.label,
              ticket_status: t.status?.label,
              team: t.team?.label,
              assignee: t.assignee?.label,
              category: t.tcategory?.label,
              // priority: t.priority?.label,
              // urgency: t.urgency?.label,
              description: t.description,
              done_date:uTd(t.done_dt)
            }
          )
        )
            return   ticketsAllWfs_csv
  }
  

    const handleTableChange = (pagination: TablePaginationConfig, filter: Record<string, FilterValue | null>, sorter: SorterResult<any> | SorterResult<any>[]   ) => {  
    setPagination({...pagination, total: ticketsAllWfsCount })
    setFilter(filter)
    let page = pagination.current?.toString() || '1'
    let sorter_ = JSON.parse(JSON.stringify(sorter))
    let pageSize = pagination.pageSize || LIMIT_DEFAULT
    let _offset = 
    sorter_.field ?
    sorter_.field + ' ' + (sorter_.order ? sorter_.order === 'descend' ? ' DESC' : ' ASC' : ' ASC')
    : SORT_DEFAULT
    setSorter(_offset)
    console.log('_offset',_offset);
    fetchTicketsAllWfs({...searchP, _page: page, _offset: _offset, _limit: pageSize.toString()  } , dataPartition(where)) 
  }
  const handlePaginationChange = (page:number, pageSize:number | undefined) => {
    setPagination({...pagination, total: ticketsAllWfsCount, pageSize, current:page   })
    setFilter(filter)
    let pageSize_ = pageSize || ''
    fetchTicketsAllWfs({...searchP, _page: page.toString(), _offset: sorter, _limit: pageSize_?.toString()  } , dataPartition(where)) 
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

    const fastSearchArray = ['name', 'task_name', 'ticket_name', 'customer_name', 'description', 'team_name', 'assignee_name']
    const onFinish = async (values: any) => { 
      console.log('Success:', values);
      let where_ = searchFormWhereBuild(values, fastSearchArray)
      fetchTicketsAllWfs({...searchP } , dataPartition(where_))
      setWhere(where_)
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }
    const createNew = () => {
      setSelectedTicket({} as ITicket)
      setSelectedProperty({} as ITicketPrpTpl)
      setProperties([] as ITicketPrpTpl[])
      router.push(RouteNames.TICKETS + '/0')
    }
    const buildTitle = () =>
    {
        return (
          <h1 style={{padding:'10px'}}>{   t('search')} { t('wfs')}</h1>
        )
    }
    
  const [vewAdditionalFilter, setVewAdditionalFilter ] = useState(false)
  return (
    <Layout style={{height:"100vh"}}>
      <Card style={{background:'#fafafa', border:'solid 1px lightgray', marginTop:'10px'}}>
      {error && 
      <h1>{error}</h1>
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
         <Col  xs={12} xl={24} >
         <Button type="primary" htmlType="submit" loading={isLoading} key="search"
         >
         { t('search') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="button" key="clear"
         onClick={() => form.resetFields() }
         >
         { t('clear') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button  style={{ background: "#01a77c", borderColor: "white" }} key="add_new"
          onClick={() => createNew()  }
          >{t('add_new')}</Button>&nbsp;&nbsp;&nbsp;
          {viewForm ? 
         <FilterOutlined style={{color:'gray', fontSize: '24px'}}
         onClick={() => setViewForm(false)}
         />  :
          <FilterOutlined key="setViewForm"
          onClick={() => setViewForm(true)}
          style={{color:'green', fontSize: '24px'}}  
          rotate={180} />  
        } 
         </Col>
         <Button 
         >
         <FileExcelOutlined style={{color:'#1eb386'}}/>&nbsp;
         <CSVLink
              filename={"Expense_Table.csv"}
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
         </div>
        </Row>
        {viewForm &&
        <>
        <Row  >
         
           <Col xs={24} xl={3}  sm={12} lg={8} >
           <Form.Item
           // label={ t('name') }
           name="ticket_name" 
           style={{ padding:'5px'}} > 
           <Input 
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('t-name') }
           />
           </Form.Item>
           {
               vewAdditionalFilter ? 
               <Tooltip title={t('close_additionalFilter')}>
               <MinusCircleOutlined  
               onClick={()=>setVewAdditionalFilter(false)}
               />
               </Tooltip> : 
               <Tooltip title={  t('open_additionalFilter')}>
               <PlusCircleOutlined 
               onClick={()=>setVewAdditionalFilter(true)}
               />
                </Tooltip>

             }
           </Col>
           <Col xs={24} xl={5}  sm={12} lg={8} >
           <Form.Item 
           // label={ t('type') }
           name="customer"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
           menuPosition="fixed"
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('customer') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'customer',  ' top 20 name as label, id as value , isnull(phone, mobile_phone) as code ', 'V_contacts', NOT_GROUP_LIST , false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'customer')}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={10}  sm={12} lg={8} >
           <Form.Item 
           // label={ t('tcategory') }
           name="tcategory"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
           menuPosition="fixed"
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('tcategory') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'tcategory',  ' top 200 name as label, id as value , id as code ', 'ticket_category', " active = 1 " , false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'tcategory')}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={3}  sm={12} lg={8} >
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
     {
        vewAdditionalFilter && <>
           <Row >
        <Col xs={24} xl={3}  sm={12} lg={8}>
           <Form.Item 
           // label={ t('type') }
           name="task"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
           menuPosition="fixed"
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('task') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'task',  ' top 30 name as label, id as value , code as code', 'utils', " type = 'wf_task' and id not in ('"+ WF_TASK_START_GROUP.value +"','"+ WF_TASK_END_GROUP.value +"')", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'task')}
           />
           </Form.Item>
           </Col>
        <Col xs={24} xl={4}  sm={12} lg={8}>
           <Form.Item 
           // label={ t('type') }
           name="status"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
           menuPosition="fixed"
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('status') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'status',  ' top 30 name as label, id as value , code as code', 'utils', " type = 'wf_status' ", true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'status')}
           />
           </Form.Item>
           </Col>   
        <Col xs={24} xl={5}  sm={12} lg={8}>
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
        <Col xs={24} xl={4}  sm={12} lg={8} > 
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
        </Row>
      
        <Row>
          <Col xs={24} xl={8} sm={12} lg={8} >
           <Form.Item
           label={ t('create_date') }
           name="created_dt" 
           style={{ padding:'5px'}} > 
            <RangePicker 
            format={DATETIMEFORMAT}
            placeholder={t('created_dt')}
            showTime={{ format: 'HH:mm' }} 
            />
           </Form.Item>
           </Col>
           <Col xs={24} xl={8} sm={12} lg={8} >
           <Form.Item
           label={ t('start_dt') }
           name="start_dt" 
           style={{ padding:'5px'}} > 
            <RangePicker 
            format={DATETIMEFORMAT}
            placeholder={t('start_dt')}
            showTime={{ format: 'HH:mm' }} 
            />
           </Form.Item>
           </Col>
        </Row>

        </>
     }
     

        <Row>	
        <Col xs={24} xl={12} >
        <Form.Item
       //  label={ t('fast_search') }
        name="fast_search" 
        style={{display:'flex', width:'100%', padding:'5px'}} > 
        <Input 
         style={{ height:'38px', width: '250px'}}
         placeholder={ t('fast_search') }
        />
        </Form.Item>
        </Col>
        <Col xs={24} xl={12} >
        {
          <QueryBuild 
          where={where}
          factory={'ticket'}
          />
        }
        </Col>
        </Row>
     </>
      }
   </Form>
     
      <Row justify="center" align="middle" >
      <Pagination 
      {...pagination }
      onChange={handlePaginationChange}
      />
      <Table<ITicketsAllWfs> 
       onRow={(record, rowIndex) => {
        return {
          onClick: event => {}, // click row
        };
      }}
      rowClassName={(record) => record.active === 1 ? 'table-row-light' :  'table-row-dark'}
      columns={columns} 
      dataSource={ticketsAllWfs} 
      loading={isLoading}
      rowKey={record => record.id}
      bordered
      pagination={pagination}
      onChange={handleTableChange}
      title={() => <h3>{t('wfs') + ' ' + t('total_count') + ' ' + ticketsAllWfsCount }</h3> }
      footer={() => t('total_count') + ' ' + ticketsAllWfsCount}
      style={{width: '100%', padding: '5px'}}
      scroll={{ x: 1500, y: 550 }}
      expandable={{
        expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
        rowExpandable: record => record.description !== '',
      }}
      />
      </Row>
      </Card>
      <Modal
       title={t(activityType) + ' ' +  t('wf') + ' ' + t('number') + ' '  + selectedTicket?.name }
       footer={null}
       onCancel={() => setModalVisible(false)}
       visible={modalVisible}
       >
         <ActivityForm 
         submit={description => SubmitActivity(description) }
         type={activityType}
         modalVisible={modalVisible}
         />
       </Modal> 
    </Layout>
  )
}



export default TicketsAllWfs;

