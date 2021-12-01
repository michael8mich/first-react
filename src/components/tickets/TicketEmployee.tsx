import { Button, Card, Checkbox, Col, Collapse, Descriptions, List, Form, Input, Layout, Modal, Radio, Row, Select, Space, Spin, Table, TablePaginationConfig, Tabs, DatePicker, Popover, Badge} from 'antd';
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined, UserOutlined,
  TeamOutlined, ToolOutlined, UnorderedListOutlined, LayoutOutlined  } from '@ant-design/icons';
import  {FC, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../axios/axios';
import {  SelectOption } from '../../models/ISearch';
import { DATETIMEFORMAT, PRPID, removeNewRow, saveFormBuild, saveFormBuildMulti, uTd } from '../../utils/formManipulation';
import {  ASSIGNEE_LIST, GROUP_LIST, NOT_GROUP_LIST } from '../../models/IUser';
import { Link, NavLink, useHistory, useParams } from 'react-router-dom';
import { Params } from '../../models/IParams';
import { getValidatorsToProp, validators } from '../../utils/validators';
import classes from './TicketDtl.module.css'
import { INameBoolValue, ITicket, ITicketCategory, ITicketCategoryObjects, ITicketLog, ITicketObjects, ITicketObjectsMulti, ITicketPrpTpl, ITicketRoFields, PRIORITY_LOW, STATUS_CLOSE, STATUS_CREATED, TICKET_PROBLEM, TICKET_REQUEST, URGENCY_LOW } from '../../models/ITicket';
import { ColumnsType } from 'antd/lib/table';
import { TabsPosition } from 'antd/lib/tabs';
import { RouteNames } from '../../router';
import UserAddOutlined from '@ant-design/icons/lib/icons/UserAddOutlined';
import Avatar from 'antd/lib/avatar/avatar';
import { getScrollTop } from 'react-select/dist/declarations/src/utils';
import { translateObj } from '../../utils/translateObj';
import ActivityForm from '../../pages/ticket/ActivityForm';
import UploadFiles from '../admin/UploadFiles';
import moment from 'moment';
import PopoverDtl from '../../pages/ticket/PopoverDtl';
import { P } from '@antv/g2plot';
import { red, volcano, gold, yellow, lime, green, cyan, blue, geekblue, purple, magenta, grey } from '@ant-design/colors';
import { generate, presetDarkPalettes } from '@ant-design/colors';

// Generate dark color palettes by a given color
const colors = generate('#1890ff', {
  theme: 'dark',
  backgroundColor: '#141414'
});
console.log(blue); // ['#E6F7FF', '#BAE7FF', '#91D5FF', ''#69C0FF', '#40A9FF', '#1890FF', '#096DD9', '#0050B3', '#003A8C', '#002766']
console.log(blue.primary); // '#1890FF'
interface RefObject {
  upload_files: (id:string) => void
  get_files: () => void
}
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const TicketEmployee:FC = () => {
  const { t } = useTranslation();
  const {fetchTicket, createTicket, fetchTicketLog, getCustomerInfo, CleanSelectedTicket, createTicketActivity, setAlert, fetchProperties, setProperties, setSelectSmall} = useAction()
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
  
  const [sendedFromQuery, setSendedFromQuery] = useState(false)
  const router = useHistory()
  const categorySended = async () => {
    let router_location = router?.location?.search || ''
    if(router_location.toString().split('?search=').length>1)
    {
      let cat_label = router_location.toString().split('?search=')[1]
      cat_label = removeNewRow(cat_label)
      let catObj = Object.keys(selectSmall).find( k=> k === 'category') 
      let arr:any = {...selectSmall}
      let arr_category = arr.category
      if(arr_category) {
        let cat = arr_category.find((c: { label: string, value:string }) => c.label == cat_label)
        if(cat) {
          form.setFieldsValue({ category: {label:cat_label, value:cat.value }})
          changeCategory({label:cat_label, value:cat.value })
        }
      }
      else
      {
        const response = await  axiosFn("get", '', " name as label, id as value , id as code ", 'ticket_category', " active = '1' order by name asc " , ''  )  
        let hasError = false;
        if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
            let cat = response.data.find((c: { label: string, value:string }) => c.label == cat_label)
            if(cat) {
              form.setFieldsValue({ category: {label:cat_label, value:cat.value }})
              setSelectSmall( { category: response.data } )
              changeCategory({label:cat_label, value:cat.value })
            }
          }
      }
    }
  } 
  useEffect( () => {
    categorySended()
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
      if(curTicket?.customer?.value!==user.id)
      router.push(RouteNames.TICKETS)

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
   const hideProp = (ticketPrp_:ITicketPrpTpl[]) => {
    let a:ITicketPrpTpl[] = JSON.parse(JSON.stringify(ticketPrp_))
    a.map(pr => {
     pr.visible = 1 
     let dependence = pr.dependence || ''
     if(dependence.split(':').length > 1 )
     {
      a.map(p => {
         let dependenceArr: string[] = dependence.split(':')
         if(dependenceArr.length > 1 ){
           if(+p.sequence === +dependenceArr[0] )
           {
             let value = p.value || ''
             let fValue = form.getFieldValue(PRPID+p.id) 
             fValue = fValue || ''
             if(fValue instanceof Object )
             {
              fValue = fValue.label
             }
             if(fValue ) value = fValue
             
             if(value !== dependenceArr[1]) {
               pr.visible = 0
             }
           }
         }
       })
     }
   })
   return a
   }
   useEffect(() => {
     if(selectedTicket.ticketProperties){
      setTicketPrp(hideProp(selectedTicket.ticketProperties))
     } 
  }, [selectedTicket.ticketProperties])

  useEffect(() => {
    if(properties) {
    setTicketPrp(hideProp(properties))
    }
    
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
          setSelectSmall( { [name]: response.data } )
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
        changeCategory(selectChange)
    }
    
    setSelectValues({...selectOptions, [name]: selectChange })
      }

    const changeCategory = async (selectChange:any) => {
      if(selectChange?.value) {
        setTicketPrp([])
        const response = await  axiosFn("get", '', '*', 'V_ticket_category', " id = '" + selectChange?.value + "'" , ''  )  
        let category_info =  translateObj(response?.data, ITicketCategoryObjects)
        if(category_info[0]?.team?.value) {
          //form.setFieldsValue({ team: category_info[0]?.team }) 
          setDefaultOnNew({... defaultOnNew, team:category_info[0]?.team}) 
          fetchProperties(category_info[0].id)
        }
      }   
    }  
    const SelectStyles = {
      container: (provided: any) => ({
        ...provided,
        width: '100%',
        opacity: '1 !important'
      })
    };
    
    const afterUpdateCreate = () => {
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
     val = val || {id:"", value:""}
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
      if(ticketId==='0') {
        values_.customer = defaultOnNew.customer.value
        values_.priority = defaultOnNew.priority.value
        values_.status = defaultOnNew.status.value
        values_.team = defaultOnNew.team.value
      }
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
          <span
          onClick={() => getCustomerInfoFn()}
          >
          
          <UserAddOutlined 
          className={classes.customerLabel}
          
          /> 
          
          &nbsp;&nbsp;{ t('customer')} 
           </span>
            &nbsp;&nbsp;
           <Badge 
           size="small"
           count={selectedTicket?.customer_info?.tickets?.length}>
           </Badge>
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
  const [defaultOnNew, setDefaultOnNew]  = useState(
    {active: true,
      description: "",
      status: STATUS_CREATED,
      ticket_type: TICKET_REQUEST,
      priority: PRIORITY_LOW,
      urgency: URGENCY_LOW,
      customer: {label: user.name, value: user.id},
      team: {label: '', value: ''},
      category: {label: '', value: ''}, 
      customer_phone: user.phone ? user.phone : user.mobile_phone
      }
  )
  
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
      <h3
      style={{color:'gray'}}
      >  
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
  function  popover(event:any, record:ITicket) 
  {
    //event.preventDefault()
    return (
         <PopoverDtl 
         record={record} 
         />         
    )
  }
  const [prpHideArr, setPrpHideArr] = useState([] as INameBoolValue[])  
 
  const changeCol = () =>  {
    setTicketPrp(hideProp(ticketPrp)) 
  }
  const setDefaultPrpValue = (value:string) => {
    if(ticketId === '0' && value )
    {
      console.log(value);
      try {
      let new_value = JSON.parse(value)
      console.log(new_value);
      return new_value
      } catch (e:any) {
        console.log(e);
      }
      
      
    }
    return ''
  }
  return (
  <Layout style={{height:"100vh"}}>
      {error &&  <h1>{error}</h1> }
      {isLoading && <Spin style={{padding:'20px'}} size="large" />}
      <Row> 
      <Col xs={24} xl={selectedTicket?.customer_info && customerInfo ? 18 : 24 } sm={selectedTicket?.customer_info && customerInfo ? 18 : 24} >
       <Card  >
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
         <Col xl={16}  lg={16} sm={16} xs={24}>
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

         {
            selectedTicket.status?.value !== STATUS_CLOSE.value &&
             <>
              <Button type="primary" htmlType="button" key="toClose"
              onClick={() => toClose('Close Comment') }
              >
              { t('toClose') }
              </Button>&nbsp;&nbsp;&nbsp;
              </>

        }

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
        <Col  xl={8}  lg={8} sm={8} xs={24}>
        {
              ticketId !== '0' &&
              <div style={{display:'flex', justifyContent:'start'}} className="flex-container">
              <TeamOutlined style={{fontSize:'50px',color:'#c15939'}}/>&nbsp;
              <label>{t('team')}:<br />
              <span style={{fontSize:'20px',color:'#c15939'}}>{selectedTicket.team?.label}</span></label>
              <ToolOutlined style={{fontSize:'50px',color:'#c15939'}}/>&nbsp;
              <label>{t('ticket_status')}:<br />
              <span style={{fontSize:'20px',color:'#c15939'}}>{selectedTicket.status?.label}</span></label>
              </div>
            }
        </Col>
        </Row>
        <Tabs onChange={tabChangeFunction} type="card" tabPosition={tabPosition }>
        <TabPane 
        tab={
          <span> 
          <LayoutOutlined />
          {t('detail')} 
          </span>
        }
        key="detail" >
        <Row  >
        <Col xl={4}  lg={6} sm={12} xs={24}  >
           <Form.Item
           label={ t('phone') }
           name="customer_phone" 
           style={{ padding:'5px'}} 
           rules={[validators.isPhone(),validators.required()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('phone') }
           />
           </Form.Item>
        </Col>
        <Col xl={12}  lg={12} sm={12} xs={24}>
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
           defaultMenuIsOpen={sendedFromQuery}
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'category',  ' top 200 name as label, id as value , id as code ', 'ticket_category', " active = '1' order by name asc", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'category')}
           />
           </Form.Item>
        </Col>
        <Col xl={4}  lg={6} sm={12} xs={24}>
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
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ticket_type',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'ticket_type' and id <> '" +TICKET_PROBLEM.value+ "'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'ticket_type')}
           />
           </Form.Item>
        </Col>
        <Col xl={4}  lg={6} sm={12} xs={24}>
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
        {
          ticketPrp.map(p => (
            <>
            {
              p.visible === 1 &&
              <Col xl={p.width}  lg={p.width+2} sm={12} xs={24}  key={p.id} 
              >
        
       
               {
                   p.factory.label === 'Text' &&
                   <Form.Item 
                   key={p.id+'_Text'}
                   label={p.name}
                   name={PRPID+p.id}
                   style={{ padding:'5px', width: 'maxContent'}} 
                   rules={getValidatorsToProp(p.pattern)}
                   initialValue={ticketId === '0' && p.defaultValue && p.defaultValue}
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
                  initialValue={ticketId === '0' && p.defaultValue && p.defaultValue}
                  > 
                 
                  <Select disabled={ro} 
                  size="large"
                  style={{height:'35px!important'}}
                    onChange={() => changeCol()}
                  >
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
                initialValue={ticketId === '0' && p.defaultValue && p.defaultValue.split(':').length > 1 ? moment().clone().add({[p.defaultValue.split(':')[0]]:p.defaultValue.split(':')[1]}) : ''}
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
                  initialValue={  {label: ticketId === '0' && p.defaultValue && p.defaultValue.split(':').length > 1 ? p.defaultValue.split(':')[0] : '', value: ticketId === '0' && p.defaultValue && p.defaultValue.split(':').length > 1 ? p.defaultValue.split(':')[1] : ''} }
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
                  onChange={(selectChange:any) => {selectChanged(selectChange, PRPID+p.id);changeCol()}}
                  />
                  </Form.Item>
               }
           </Col>
              }
              </>
          )
            )
        }  
        </Row>   
        
        <Row  >
        <Col xs={24} xl={12}  >
         <Form.Item
           label={ t('description') }
           name="description" 
           style={{ padding:'5px'}} 
           rules={[validators.required()]}
           > 
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
        <TabPane 
         tab={
          <span> 
          <UnorderedListOutlined /> 
          {t('log')} 
          </span>
        }
        key="log" forceRender={true} >
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
      </Col>
       <Col xs={24} xl={selectedTicket?.customer_info && customerInfo ? 6 : 0 } sm={selectedTicket?.customer_info && customerInfo ? 6 : 0}>
       {
         selectedTicket?.customer_info && customerInfo &&
         <Card
         title={buildCustomer_info_title()} 
         style={{background:'#fafafa', border:'solid 1px lightgray', borderRadius:'10px', marginLeft:'3px',marginRight:'3px', width:'100%', color:'gray'}}>
         &nbsp;&nbsp;
         <Descriptions
          bordered
          contentStyle={{color:'gray'}}
          labelStyle={{color:'gray'}}
          title={ (<h4 style={{color:'gray'}}>{t('customer_info')}</h4>) }
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

            <Descriptions.Item span={3} label={t('phones-emails')}>
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
                    avatar={
                      <Popover 
                      content={(event:any)=>popover(event, item)} 
                      title={ t('ticket') + ' ' +  t('number') + ' ' + item.name }  trigger="hover">  
                       <Avatar >{item.name}</Avatar>&nbsp;
                      </Popover>
                    }
                    style={{cursor:'pointer',color:'gray'}}
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
      </Col>
       
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
export default TicketEmployee;

