import { Button, Card, Checkbox, Col, Collapse, Descriptions, List, Form, Input, Layout, Modal, Radio, Row, Select, Space, Spin, Table, TablePaginationConfig, Tabs, DatePicker} from 'antd';
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import  {FC, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../axios/axios';
import {  SelectOption } from '../../models/ISearch';
import { DATETIMEFORMAT, PRPID, saveFormBuild, saveFormBuildMulti, uTd } from '../../utils/formManipulation';
import {  ASSIGNEE_LIST, GROUP_LIST, NOT_GROUP_LIST } from '../../models/IUser';
import { Link, NavLink, useHistory, useParams } from 'react-router-dom';
import { Params } from '../../models/IParams';
import { getValidatorsToProp, validators } from '../../utils/validators';
import classes from './TicketDtl.module.css'
import { ITicket, ITicketCategory, ITicketCategoryObjects, ITicketLog, ITicketObjects, ITicketObjectsMulti, ITicketPrpTpl, ITicketRoFields, PRIORITY_LOW, STATUS_CLOSE, STATUS_CREATED, TICKET_REQUEST, URGENCY_LOW } from '../../models/ITicket';
import { ColumnsType } from 'antd/lib/table';
import { TabsPosition } from 'antd/lib/tabs';
import { RouteNames } from '../../router';
import UserAddOutlined from '@ant-design/icons/lib/icons/UserAddOutlined';
import Avatar from 'antd/lib/avatar/avatar';
import { getScrollTop } from 'react-select/dist/declarations/src/utils';
import { translateObj } from '../../utils/translateObj';
import ActivityForm from './ActivityForm';
import UploadFiles from '../../components/admin/UploadFiles';
import moment from 'moment';
interface RefObject {
  upload_files: (id:string) => void
  get_files: () => void
}
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const TicketDtl:FC = () => {
  const { t } = useTranslation();
  const {fetchTicket, createTicket, fetchTicketLog, getCustomerInfo, CleanSelectedTicket, createTicketActivity, setAlert, fetchProperties, setProperties} = useAction()
  const {error, isLoading, tickets, selectedTicket, properties } = useTypedSelector(state => state.ticket)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const {user } = useTypedSelector(state => state.auth)
  const { Option } = Select;
  const { TextArea } = Input;

  const uploadRef=useRef<RefObject>(null)
  const [userCurrentLoaded] = useState(selectedTicket)
  const [form] = Form.useForm()
  const [ro, setRo] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [activityType, setActivityType] = useState('') 
  const [init, setInit] = useState(false) 
  const [ticketPrp, setTicketPrp] = useState([] as ITicketPrpTpl[] ) 
  const [ticketId, setTicketId] = useState('0') 
  let {id} = useParams<Params>()
  
  const router = useHistory()
  useEffect( () => {
    debugger
     setTicketId(id)
      if(id==='0')  {
        setRo(false)
        CleanSelectedTicket()
        setInit(true)
      } else {
        fetchTicket(id) 
        get_files()
      }
   }, [])

  function getTicket() {
      fetchTicket(ticketId) 
      get_files()
  }
  const upload_files = (id:string) => {
    if(uploadRef.current)
    {
       uploadRef.current.upload_files(id)
    }
  }
  const get_files = () => {
    if(uploadRef.current)
    {
       uploadRef.current.get_files()
    }
  }
  function setFormValues() {
    if(ticketId!=='0') {
      let curTicket:any = selectedTicket
      const currUserFields= Object.keys(curTicket)
      const  formFields = Object.keys((form.getFieldsValue()))
      const form_set_values = {} as any
      formFields.map(ff => {
        if(ff.indexOf(PRPID)!=-1)
        {
          let obj = ticketPrp.find(p=>PRPID+p.id === ff) 
          if(obj) {
            if(obj.factory.label.toString()=="Date")
            {
              if(obj.value) 
                form_set_values[ff] = moment(+obj.value*1000)
            } else
            if(obj.factory.label.toString()=="Object")
            form_set_values[ff] = { label: obj.value, value: obj.valueObj }
            else
            form_set_values[ff] = obj.value
          }
        }
        else
        form_set_values[ff] = curTicket[ff]
      })
      form.setFieldsValue(form_set_values);
    }
  }
   useEffect(() => {
    if(id!=='0')
    setFormValues()
   }, [selectedTicket])

  useEffect(() => {
   console.log('error', error);
  }, [error])

  useEffect( () => {
     if(ticketId==='0') {
      if(Object.keys(selectedTicket).find( k=> k === 'id'))
      {
        if(!Object.keys(selectedTicket).find( k=> k === 'name'))
        {
          afterUpdateCreate()
          fetchTicket(selectedTicket.id)
          setTicketId(selectedTicket.id) 
          upload_files(selectedTicket.id)
          
        }
      }
     }
   }, [selectedTicket?.id])

   useEffect(() => {
     if(selectedTicket.ticketProperties){
      setTicketPrp(selectedTicket.ticketProperties)
     } 
  }, [selectedTicket.ticketProperties])

  useEffect(() => {
    if(properties)
    setTicketPrp(properties)
 }, [properties])

  useEffect(() => {
     if(ticketPrp&&ro)
      setFormValues()
 }, [ ticketPrp])

  
  const [customerInfo, setCustomerInfo] = useState(false) 
  const [category_info, setcategory_info] = useState({} as ITicketCategory)
  const getCustomerInfoFn = () => {
    setCustomerInfo(!customerInfo)
    {
      if(!selectedTicket.customer_info && selectedTicket?.customer?.value)
      getCustomerInfo({...selectedTicket} , selectedTicket.customer.value)
    }
    
  }

  const initSelectOptions:any = {
  }
  const [selectOptions , setSelectOptions] = useState(initSelectOptions)

  const [assigneeArr , setAssigneeArr] = useState([])
  const [teamArr , setTeamArr] = useState([])
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
          if(inputValue.length === 0 || big)
          //setSelectSmall( { [name]: response.data } )
          return response.data
        } 
      }
      else // not big table
        {
          return selectOptions[name].filter((i:SelectOption) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
        }
    }  
    const loadAssTeam = async (name:string) => {
         if(ro) return
         let what = 'top 200 name as label, id as value , id as code '
         let tname =  'V_contacts'
         let where = ''
         let assignee = form.getFieldValue('assignee')
         let team = form.getFieldValue('team')
         if(name === 'assignee' ) {
          where =  ASSIGNEE_LIST
           if(team?.value)
           if(team?.value?.length !== 0)
           {
            where += " and id in (select member from teammember where team = '"+team.value+"')"
           }
         }
         if(name === 'team') {
           where =  GROUP_LIST
           if(assignee?.value)
           if(assignee?.value?.length !== 0)
           {
            where += " and id in (select team from teammember where member = '"+assignee.value+"')"
           }
         }

         const response = await  axiosFn("get", '', what, tname, where , ''  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
           if(response.data&&!hasError)
           {
             setSelectOptions({...selectOptions, [name]: response.data}) 
             if(name === 'assignee')
             setAssigneeArr(response.data)
             if(name === 'team')
             setTeamArr(response.data)
           }
      }     
     const selectChanged = async (selectChange:any, name:string) =>
      {
       if(name==='customer') {
           if(selectChange?.value) {
            getCustomerInfo({...selectedTicket, customer:selectChange }, selectChange?.value)
           }   
       }
       if(name==='category') {
        if(selectChange?.value) {
          setTicketPrp([])
          const response = await  axiosFn("get", '', '*', 'V_ticket_category', " id = '" + selectChange?.value + "'" , ''  )  
          let category_info =  translateObj(response?.data, ITicketCategoryObjects)
          if(category_info[0]?.team?.value) {
            form.setFieldsValue({ team: category_info[0]?.team }) 
            fetchProperties(category_info[0].id)
          }
        }   
    }
    setSelectValues({...selectOptions, [name]: selectChange })
      }
    const SelectStyles = {
      container: (provided: any) => ({
        ...provided,
        width: '100%',
        opacity: '1 !important'
      })
    };
    
    const afterUpdateCreate = () => {
      setAlert({
        type: 'success' ,
        message: id === '0' ? t('created_success') : t('updated_success'),
        closable: true ,
        showIcon: true ,
        visible: true,
        autoClose: 10 
      })
      if(!init)
      getTicket()
      setRo(true)
      setCustomerInfo(false)
    }

  const propertyBuild = (values:any, prp: ITicketPrpTpl[]) => {
    interface IFormValue {
      id:string,
      value: any
    }
    let prp_val = [] as any[]  
     Object.keys(values).map(k=>{
      if(k.indexOf(PRPID)!=-1){
        let newObj = {id: k.replace(PRPID,''),
        value: values[k] || ''}
        prp_val.push(newObj)
      }
    })
    let prp_ = prp.map(p => {
     let val = prp_val.find(v=> v.id === p.id) || ''
     let value
     let valueObj
     val.value = val.value || ''
      if(val.value instanceof moment )
      {
       value = val.value.unix() 
      } else
      if(val.value instanceof Object )
      {
        value = val.value.label
        valueObj = val.value
      }
      else 
      value = val.value
      return {...p, id : p.id ? p.id : '0', value:value, valueObj: valueObj ? valueObj : '' }
    })
    let new_prp:ITicketPrpTpl[] = [...prp_] 
    return new_prp
  }


    const onFinish = async (values: any) => {
      debugger 
      values = form.getFieldsValue()
      const values_ = {...values}
      ITicketRoFields.map(r => {
        delete values_[r]
      })
      let prp = propertyBuild({...values_}, ticketPrp)
      Object.keys(values_).map(v=> {
        if(v.indexOf(PRPID)!= -1)
        delete values_[v]
      })
      let valuesMulti =  saveFormBuildMulti({...values_},{...selectedTicket});
      saveFormBuild(values_)
      createTicket({...values_, id:ticketId, name:selectedTicket.name}, valuesMulti, user.id, [...prp])
      if(!init)
      afterUpdateCreate()
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }

    const cancelUpdate = () => {
      if(ticketId==='0') {
        router.push(RouteNames.TICKETS)
      } else {
        setRo(true) 
        getTicket()
      }

    }

    const buildTitle = () =>
    {
        return (
          ticketId === '0'? 
          <h1 style={{padding:'10px'}}>{ !ro && t('create_new') } { t('ticket')} { selectedTicket?.name &&  t('number') + selectedTicket?.name} </h1>:
          <h1 style={{padding:'10px'}}>{ ! ro && t('update') } { t('ticket')}   { t('number')} { selectedTicket?.name }</h1>
        )
    }

    
    const customerLabel = () =>
    {
        return (
          <>
          <UserAddOutlined 
          className={classes.customerLabel}
          onClick={() => getCustomerInfoFn()}
          /> &nbsp;&nbsp;{ t('customer')} 
          </>
        )
    }
   

    const [tabPosition, setTabPosition] = useState('top' as TabsPosition )
    const changeTabPosition = (e:any) => {
      setTabPosition(e.target.value)
    }
    const buildTabPositins = () => {
      return (
        <Space style={{ marginBottom: 24,  paddingLeft:'10px', paddingRight:'10px' }}>
        <Radio.Group value={tabPosition} onChange={changeTabPosition}>
          <Radio.Button key="top" value="top"><UpOutlined /></Radio.Button>
          <Radio.Button key="bottom" value="bottom"><DownOutlined /></Radio.Button>
          <Radio.Button key="left" value="left"><LeftOutlined /></Radio.Button>
          <Radio.Button key="right" value="right"><RightOutlined /></Radio.Button>
        </Radio.Group>
      </Space>
      )
      
    } 
    const tabChangeFunction = (key:any) => {
      if(key==='log')
      {
        fetchTicketLog(selectedTicket)
        
      }
      console.log(key);
    }
  const edit = (event:any) => {
    event.preventDefault()
    if(id==='0')
    router.push(RouteNames.TICKETS + '/' + selectedTicket.id )
    setRo(false)
  }  
  const localeteArr = [{'label': t('english') , 'value': 'enUS', 'code': 'enUS'},{'label': t('hebrew'), 'value': 'heIL', 'code': 'heIL'}]
  const defaultOnNew = {active: true,
  description: "תאור",
  status: STATUS_CREATED,
  ticket_type: TICKET_REQUEST,
  priority: PRIORITY_LOW,
  urgency: URGENCY_LOW
  }
  
  const ticketLogColumns: ColumnsType<ITicketLog> = [
    {
      key: 'name',
      title: t('action'),
      dataIndex: 'name',
      sorter: (a:any, b:any) =>  a.name.localeCompare(b.name),
      width: '10%',
    },
    {
      key: 'old_value',
      title: t('old_value'),
      dataIndex: 'old_value',
      sorter: (a:any, b:any) =>  a.old_value.localeCompare(b.old_value),
      width: '35%',
    },
    {
      key: 'new_value',
      title: t('new_value'),
      dataIndex: 'new_value',
      sorter: (a:any, b:any) =>  a.new_value.localeCompare(b.new_value),
      width: '35%',
    },
    {
      key: 'last_mod_dt',
      title: t('last_mod_dt'),
      sorter: (a:any, b:any) =>  a.last_mod_dt - b.last_mod_dt,
      render: ( record) => {
        return (
            <>        
            {uTd(record.last_mod_dt)} 
            </>
        );}
    },
    {
      key: 'last_mod_by',
      title: t('last_mod_by'),
      sorter: (a:any, b:any) =>  a.last_mod_by_name.localeCompare(b.last_mod_by_name),
      width: '10%',
      render: ( record) => {
        return (
            <>        
            {record.last_mod_by_name && record.last_mod_by_name} 
            </>
        );}
    }
  ]
  const  buildCustomer_info_title = () => {
    return (
      <>
      <h3>  
      <Avatar size={44} icon={<UserOutlined />} 
           src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
      />
      &nbsp;&nbsp;{selectedTicket.customer_info.name + ' ' + selectedTicket.customer_info.contact_type.label}
      </h3>
      </>
    )
  } 
  const goTo = (route:string, id:string) =>
  {
    router.push(route + '/' + id,  )
    fetchTicket(id)
  }
  const toMe = () =>
  {
    let obj:any =  { assignee:user.id } 
    createTicket({...obj, id:ticketId}, {}, user.id, [])
    fetchTicket(ticketId)
  }

  const toClose = (type: string) =>
  {
    setActivityType(type)
    setModalVisible(true)

    let obj:any =  { status:STATUS_CLOSE.value } 
    createTicket({...obj, id:ticketId}, {}, user.id, [])
    fetchTicket(id)
  }
  
  const toComment = (type: string) =>
  {
    setActivityType(type)
    setModalVisible(true)
  }


  async function  SubmitActivity(values:any) {
    if(activityType === 'New Log Comment')
    {
      values = {...values, name: activityType, ticket: selectedTicket.id, old_value: '' }
       createTicketActivity(values, user.id)
       fetchTicketLog(selectedTicket)
    }
    if(activityType === 'Close Comment')
    {
      if(values.new_value) 
      {
        values = {...values, name: activityType, ticket: selectedTicket.id, old_value: '' }
        createTicketActivity(values, user.id)
        fetchTicketLog(selectedTicket)
      }
     
    }
    setModalVisible(false)

  }
  
 
  return (
  <Layout style={{height:"100vh"}}>
      {error && 
      <h1>{error}</h1>
      }
      {isLoading && 
       <Spin style={{padding:'20px'}} size="large" />
      }
  <Row> 
       <Card  className={customerInfo ? classes.customer_info_true : classes.customer_info_false}>
       <Form
       layout="vertical"
       form={form}
       name="basic"
       // labelCol={{ span: 8 }}
       // wrapperCol={{ span: 30 }}
       initialValues={defaultOnNew}
       onFinish={onFinish}
       onFinishFailed={onFinishFailed}
       autoComplete="off" 
       > 
        <Row >
        <Col  xs={24} xl={14}>
        {ro 
        ?     
        <div className="flex-container">
         {buildTitle()}
         <Button type="primary" htmlType="button" key="edit"
          onClick={(event) => edit(event)  }
         >
         { t('edit') }
         </Button>&nbsp;&nbsp;&nbsp;

         <Button type="primary" htmlType="button" key="toComment"
         onClick={() => toComment('New Log Comment') }
         >
         { t('toComment') }
         </Button>&nbsp;&nbsp;&nbsp;

         <Button type="primary" htmlType="button"  key="toMe"
         onClick={() => toMe() }
         >
         { t('toMe') }
         </Button>&nbsp;&nbsp;&nbsp;

         <Button type="primary" htmlType="button" key="toClose"
         onClick={() => toClose('Close Comment') }
         >
         { t('toClose') }
         </Button>&nbsp;&nbsp;&nbsp;

         <Button type="primary" htmlType="button" key="getTicket"
         onClick={() => getTicket() }
         >
         { t('refresh') }
         </Button>&nbsp;&nbsp;&nbsp;
        </div> 
         :
         <div style={{display:'flex', justifyContent:'start'}} className="flex-container">
         {buildTitle()}
         <Button type="primary" htmlType="submit" key="getTicket"
         disabled={isLoading}
         loading={isLoading}
         >
         { t('save') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="submit" key="submit"
         onClick={() => cancelUpdate() }  
         >
         { t('cancel') }
         </Button>&nbsp;&nbsp;&nbsp;
        </div>    
     }
        </Col>
        </Row>
        <Tabs onChange={tabChangeFunction} type="card" tabPosition={tabPosition }>
        <TabPane tab={t('detail')} key="detail" >
        <Row  >
        <Col xs={24} xl={6}>
        
           <Form.Item 
           key="customer"
           label={customerLabel()}
           name="customer"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.required()]}
           > 
           
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('customer') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'customer',  ' top 20 name as label, id as value , id as code ', 'V_contacts', NOT_GROUP_LIST , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'customer')}
           />
           </Form.Item>
           </Col>
        <Col xs={24} xl={15}>
        <Form.Item 
           key="category"
           label={ t('tcategory') }
           name="category"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.required()]}
           > 
           <AsyncSelect 
           menuPosition="fixed"
           className={classes.selectClass}
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('tcategory') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'category',  ' top 200 name as label, id as value , id as code ', 'ticket_category', " active = '1' order by name asc", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'category')}
           />
           </Form.Item>
        </Col>
        <Col xs={24} xl={3}>
           <Form.Item 
           key="ticket_type"
           label={ t('ticket_type') }
           name="ticket_type"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.required()]}
           > 
           <AsyncSelect 
           menuPosition="fixed"
           className={classes.selectClass}
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('ticket_type') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ticket_type',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'ticket_type'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'ticket_type')}
           />
           </Form.Item>
           </Col>
        </Row> 
        <Row  >
        {
          ticketPrp.map(p => (
            <Col xs={24} xl={p.width} key={p.id} >
              
               {
                   p.factory.label === 'Text' &&
                   <Form.Item 
                   key={p.id+'_Text'}
                   label={p.name}
                   name={PRPID+p.id}
                   style={{ padding:'5px', width: 'maxContent'}} 
                   rules={getValidatorsToProp(p.pattern)}
                   > 
                  <Input
                  disabled={ro}
                  placeholder={p.placeholder}
                  />
                  </Form.Item>
                }
                {    
                   p.factory.label === 'List' &&
                  <Form.Item 
                  key={p.id+'_List'}
                  label={p.name}
                  name={PRPID+p.id}
                  style={{ padding:'5px', width: 'maxContent'}} 
                  rules={getValidatorsToProp(p.pattern)}
                  > 
                 
                  <Select disabled={ro}>
                      {
                       p.code.split(',').map(o=>
                          (
                            <Option value={o} key={o}>{o}</Option>
                          )) 
                      }    
                  </Select>
                  </Form.Item>
               }
               {
                p.factory.label === 'Date' &&
                <Form.Item 
                key={p.id+'_Date'}
                label={p.name}
                name={PRPID+p.id}
                style={{ padding:'5px', width: 'maxContent'}} 
                rules={getValidatorsToProp(p.pattern)}
                > 
                 <DatePicker 
                 format={DATETIMEFORMAT}
                 disabled={ro}
                 placeholder={p.placeholder}
                 showTime={{ format: 'HH:mm' }} 
                >
                </DatePicker>
                </Form.Item>
               }
               {    
                   p.factory.label === 'Object' &&
                  <Form.Item 
                  key={p.id+'_Object'}
                  label={p.name}
                  name={PRPID+p.id}
                  style={{ padding:'5px', width: 'maxContent'}} 
                  rules={getValidatorsToProp(p.pattern)}
                  > 
                  <AsyncSelect 
                  menuPosition="fixed"
                  isDisabled={ro}
                  isMulti={false}
                  styles={SelectStyles}
                  isClearable={true}
                  placeholder={ p.placeholder }
                  cacheOptions 
                  defaultOptions
                  loadOptions={ (inputValue:string) => promiseOptions(inputValue, PRPID+p.id,  p.code.split(';')[0], 
                  p.code.split(';')[1], p.code.split(';')[2] , true )} 
                  onChange={(selectChange:any) => selectChanged(selectChange, PRPID+p.id)}
                  />
                  </Form.Item>
               }
           </Col>
          )
            )
        }  
        </Row> 
        <Row  >
        <Col xs={24} xl={6} onClick={
          () => loadAssTeam('team')
        }>
           <Form.Item 
           key="team"
           label={ t('team') }
           name="team"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.required()]}
           > 
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('team') }
           cacheOptions 
           defaultOptions={teamArr}
          //  loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'team',  ' top 20 name as label, id as value , id as code ', 'V_contacts', GROUP_LIST , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'team')}
           />
           </Form.Item>
           </Col>
        <Col xs={24} xl={6} onClick={
          () => loadAssTeam('assignee')
        }>
           <Form.Item 
           key="assignee"
           label={ t('assignee') }
           name="assignee"
           style={{ padding:'5px', width: 'maxContent'}} 
           
           > 
           <AsyncSelect
           name="select_assignee" 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('assignee') }
           cacheOptions 
           defaultOptions={assigneeArr}
          //  loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'assignee',  ' top 200 name as label, id as value , id as code ', 'V_contacts', ASSIGNEE_LIST , false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'assignee')}
           />
           </Form.Item>
           </Col>
        <Col xs={24} xl={6}>
           <Form.Item 
           key="ticket_status"
           label={ t('ticket_status') }
           name="status"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.required()]}
           > 
           <AsyncSelect 
           menuPosition="fixed"
           className={classes.selectClass}
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('ticket_status') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'status',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'ticket_status'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'status')}
           />
           </Form.Item>
           </Col>        
        <Col xs={24} xl={3}>
           <Form.Item 
           key="priority"
           label={ t('priority') }
           name="priority"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.required()]}
           > 
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('priority') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'priority', ' top 20 name as label, id as value , id as code ', 'utils', " type = 'priority_type'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'priority')}
           />
           </Form.Item>
           </Col>
        <Col xs={24} xl={3}>
           <Form.Item 
           key="urgency"
           label={ t('urgency') }
           name="urgency"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.required()]}
           > 
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('urgency') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'urgency', ' top 20 name as label, id as value , id as code ', 'utils', " type = 'urgency_type'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'urgency')}
           />
           </Form.Item>
           </Col> 
        </Row>   
        
        <Row  >
        <Col xs={24} xl={12}  >
         <Form.Item
           label={ t('description') }
           name="description" 
           style={{ padding:'5px'}} > 
           <TextArea 
           rows={5}
            disabled={ro}
            showCount maxLength={3999}
            //  style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('description') }
           />
           </Form.Item>
         </Col>
        <Col xs={24} xl={12}  >
           <UploadFiles
           ref={uploadRef}
           id={selectedTicket?.id ? selectedTicket?.id : ticketId}
           factory="ticket"
           />
           </Col>
        </Row>   
        {
          ticketId && ticketId!=='0' &&
          <Row  >
           <Col xs={24} xl={5} sm={5} lg={5}  >
           <Form.Item
           label={ t('log_agent') }
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('log_agent') }
             value={selectedTicket.log_agent && selectedTicket.log_agent.label}
           />
           </Form.Item>
           </Col>
           
           <Col xs={24} xl={5} sm={5} lg={5}  >
           <Form.Item
           label={ t('last_mod_by') }
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('last_mod_by') }
             value={selectedTicket.last_mod_by && selectedTicket.last_mod_by.label}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={5} sm={5} lg={5}  >
           <Form.Item
           label={ t('last_mod_dt') }
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('last_mod_dt') }
             value={ uTd(selectedTicket.last_mod_dt)}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={5} sm={5} lg={5}  >
           <Form.Item
           label={ t('create_date') }
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('create_date') }
             value={uTd(selectedTicket.create_date)}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={4} sm={4} lg={4}  
           hidden={!selectedTicket.close_date}>
           <Form.Item
           label={ t('close_date') }
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('close_date') }
             value={uTd(selectedTicket.close_date)}
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
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             defaultChecked={true}
           />
           </Form.Item>
           </Col>
           </Row> 
    
        }
    </TabPane>
    <TabPane tab={t('log')} key="log" forceRender={true} >
    <Table<ITicketLog>
      scroll={{ x: 1200, y: 700 }}
      columns={ticketLogColumns} 
      dataSource={selectedTicket.tickets_log} 
      rowKey={record => record.id}
      >
      </Table>    
    </TabPane>  
    </Tabs>  
   </Form>
      </Card>
       {
         selectedTicket?.customer_info && customerInfo &&
         <Card className={classes.customer_info}
         title={buildCustomer_info_title()} 
         style={{background:'#fafafa', border:'solid 1px lightgray', marginTop:'10px', width:'30%'}}>
         &nbsp;&nbsp;
         <Descriptions
          bordered
          title={t('customer_info')}
          size={'default'}
          extra={<Button type="primary" onClick={()=> router.push(RouteNames.USERS + '/' + selectedTicket.customer_info.id ) }>{t('edit')}</Button>}
          >
          {
            selectedTicket.customer_info.login &&
            <Descriptions.Item span={3} label={t('login_name')}>{selectedTicket.customer_info.login}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info.contact_number &&
            <Descriptions.Item span={3} label={t('contact_number')}>{selectedTicket.customer_info.contact_number}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info.job_title.label &&
            <Descriptions.Item span={3} label={t('job_title')}>{selectedTicket.customer_info.job_title.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info.manager.label &&
            <Descriptions.Item span={3} label={t('manager')}>{selectedTicket.customer_info.manager.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info.primary_group.label &&
            <Descriptions.Item span={3} label={t('primary_group')}>{selectedTicket.customer_info.primary_group.label}</Descriptions.Item>
          }

            <Descriptions.Item span={3} label={t('phone')}>
            {
            selectedTicket.customer_info.phone && 
            selectedTicket.customer_info.phone 
            }
            <br />
            {
            selectedTicket.customer_info.mobile_phone && 
            selectedTicket.customer_info.mobile_phone
            }
             <br />
            {
            selectedTicket.customer_info.additional_phone && 
            selectedTicket.customer_info.additional_phone
            }
             <br />
            {
            selectedTicket.customer_info.email && 
            selectedTicket.customer_info.email

            }</Descriptions.Item>
    

          {
            selectedTicket.customer_info.location.label &&
            <Descriptions.Item span={3} label={t('location')}>{selectedTicket.customer_info.location.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info.organization.label &&
            <Descriptions.Item span={3} label={t('organization')}>{selectedTicket.customer_info.organization.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info.department.label &&
            <Descriptions.Item span={3} label={t('department')}>{selectedTicket.customer_info.department.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info.site.label &&
            <Descriptions.Item span={3} label={t('site')}>{selectedTicket.customer_info.site.label}</Descriptions.Item>
          }

          <Descriptions.Item span={3} label={t('address')}>
            {
            selectedTicket.customer_info.location_address1 && 
            selectedTicket.customer_info.location_address1 
            }
            <br />
            {
            selectedTicket.customer_info.location_address2 && 
            selectedTicket.customer_info.location_address2
            }
             <br />
            {
            selectedTicket.customer_info.location_address3 && 
            selectedTicket.customer_info.location_address3
            }
            </Descriptions.Item>
        </Descriptions>
        <Collapse
          // defaultActiveKey={['1']}
          
        > 
          { selectedTicket?.customer_info?.tickets?.length>0 &&
            <Panel header={t('tickets')+' '+selectedTicket?.customer_info?.tickets?.length} key="1" 
            >
            <List
              itemLayout="horizontal"
              dataSource={selectedTicket.customer_info.tickets}
              renderItem={item => (
                <List.Item onClick={() => goTo(RouteNames.TICKETS , item.id)}>
                  <List.Item.Meta
                    key={item.id}
                    avatar={<Avatar >{item.name}</Avatar>}
                    title={item?.status?.label}
                    description={t('team') + ':' + item?.team?.label + ' ' + t('create_date')
                  +':' +  uTd(item?.create_date) 
                  }
                  />
                </List.Item> )}
                />
            </Panel>
          }
        
          {/* <Panel header="This is panel header 2" key="2" >
            <div>2</div>
          </Panel> */}
          </Collapse>
         </Card>
       }
       
  </Row>  
  <Modal
       title={t(activityType) + ' ' +  t('ticket') + ' ' + t('number') + ' '  + selectedTicket?.name }
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
export default TicketDtl;


// function setSelectSmall(arg0: { [x: string]: any; }) {
//   throw new Error('Function not implemented.');
// }