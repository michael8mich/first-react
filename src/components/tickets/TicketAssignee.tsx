import { Button, Card, Checkbox, Col, Collapse, Descriptions, List, Form, Input, Layout, Modal, Radio, Row, Select, Space, Spin,  Tabs, DatePicker, Popover, Badge, Tooltip, Drawer, DrawerProps, Popconfirm} from 'antd';
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined, UserOutlined, MailOutlined, SelectOutlined,
  UnorderedListOutlined, LayoutOutlined, FilePdfOutlined, QuestionCircleOutlined, CloseCircleOutlined,
  ApiOutlined,CopyOutlined,BranchesOutlined } from '@ant-design/icons';
import  {FC, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../axios/axios';
import {  SelectOption } from '../../models/ISearch';
import { DATETIMEFORMAT, nowToUnix, PRPID, saveFormBuild, saveFormBuildMulti, uTd } from '../../utils/formManipulation';
import {  ASSIGNEE_LIST, GROUP_LIST, NOT_GROUP_LIST } from '../../models/IUser';
import {  useHistory, useParams } from 'react-router-dom';
import { Params } from '../../models/IParams';
import { getValidatorsToProp, validators } from '../../utils/validators';
import classes from './TicketDtl.module.css'
import { INameBoolValue, ITicket, ITicketCategory, ITicketCategoryObjects, ITicketObjects,  ITicketPrpTpl, ITicketRoFields, ITicketTemplateFields, ITicketWfObjects, PRIORITY_LOW, STATUS_CANCELED, STATUS_CLOSE, STATUS_CREATED, TICKET_REQUEST, URGENCY_LOW, WF_STATUS_CANCEL, WF_STATUS_COMPLETE, WF_STATUS_REJECT, WF_TASK_ACTION } from '../../models/ITicket';
import { TabsPosition } from 'antd/lib/tabs';
import { RouteNames } from '../../router';
import UserAddOutlined from '@ant-design/icons/lib/icons/UserAddOutlined';
import Avatar from 'antd/lib/avatar/avatar';
import { translateObj } from '../../utils/translateObj';
import ActivityForm from '../../pages/ticket/ActivityForm';
import UploadFiles from '../admin/UploadFiles';
import moment from 'moment';
import PopoverDtl from '../../pages/ticket/PopoverDtl';
import {  blue, } from '@ant-design/colors';
import { generate,  } from '@ant-design/colors';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from "jspdf";
import { ICi } from '../../models/ICi';
import { useDebounce } from '../../hooks/useDebounce';
import TicketWfs from './TicketWfs';
import TicketLog from './TicketLog';
import TicketNotifications from './TicketNotifications';
import useWindowDimensions from '../../hooks/useWindowDimensions';

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

const TicketAssignee:FC = () => {
  const { height, width } = useWindowDimensions();
  const { t } = useTranslation();
  const {fetchTicket, createTicket, fetchTicketLog, getCustomerInfo, CleanSelectedTicket, createTicketActivity, setAlert, 
    fetchProperties, setProperties, fetchTicketNotifications, setQueriesCache, setCopiedTicket,setSelectedProperty,
    setSelectedTicket,setPathForEmpty, fetchTicketWfs} = useAction()
  const {error, isLoading, tickets, selectedTicket, properties, copiedTicket, selectedWfsId } = useTypedSelector(state => state.ticket)
  const {notificationsAll } = useTypedSelector(state => state.admin)
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
     setTicketId(id)
      if(id==='0')  {
        setRo(false)
        if(!copiedTicket?.id) {
          CleanSelectedTicket()
          setInit(true)
        } else {
          let curTicket:any = copiedTicket
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
          form.setFieldsValue(form_set_values)
          fromCopy(curTicket)    
          setCopiedTicket({} as ITicket)
        }
        
      } else {
        fetchTicket(id) 
        get_files()
      }
   }, [])

  const fromCopy = async (curTicket:ITicket, category:boolean = true) => {
    if(category)
    if(curTicket.category?.value) {
      setTicketPrp([])
      const response = await  axiosFn("get", '', '*', 'V_ticket_category', " id = '" + curTicket.category.value + "'" , ''  )  
      let category_info =  translateObj(response?.data, ITicketCategoryObjects)
      setCategoryCrs(category_info[0]?.crs)
      if(category_info[0]?.team?.value) {
        form.setFieldsValue({ team: category_info[0]?.team }) 
        fetchProperties(category_info[0].id)
      }
    }
    if(curTicket.customer?.value) {
    getCustomerInfo({...selectedTicket, customer:curTicket.customer }, curTicket.customer?.value)
    }
    if(curTicket.ci?.value) {
    const response = await  axiosFn("get", '', ' count(*) as cnt', 'ticket', " ci = '" + curTicket.ci?.value + "' and active = 1 " , ''  )  
          setCiCrs(response.data[0].cnt)
    }

  } 

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
   const [activeTabKey, setActiveTabKey] = useState('detail');
   useEffect(() => {
    if(selectedWfsId!=='')
    setActiveTabKey('wfs')

   }, [selectedWfsId])

   
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
    if(!selectedTicket?.customer?.value) return
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
  const promiseOptions =  async (inputValue: string, name: string, what:string, tname:string, where:string, big: boolean = false) => {
    
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
     const [categoryCrs, setCategoryCrs]  = useState(0)
     const [ciCrs, setCiCrs]  = useState(0) 
     const [categoryChanged, setCategoryChanged]  = useState(false) 

     const selectChanged = async (selectChange:any, name:string) =>
      {
       if(name==='customer') {
           if(selectChange?.value) {
            getCustomerInfo({...selectedTicket, customer:selectChange }, selectChange?.value)
            form.setFieldsValue({ customer_phone: selectChange?.code } )
           }   
       }
       if(name==='ci') {
        if(selectChange?.value) {
          const response = await  axiosFn("get", '', ' count(*) as cnt', 'ticket', " ci = '" + selectChange?.value + "' and active = 1 " , ''  )  
          setCiCrs(response.data[0].cnt)
        }
      }
       if(name==='category') {
        if(selectChange?.value) {
          if(id) setCategoryChanged(true)
          setTicketPrp([])
          const response = await  axiosFn("get", '', '*', 'V_ticket_category', " id = '" + selectChange?.value + "'" , ''  )  
          
          let category_info =  translateObj(response?.data, ITicketCategoryObjects)

          setCategoryCrs(category_info[0]?.crs)
          if(category_info[0]?.team?.value) {
            form.setFieldsValue({ team: category_info[0]?.team }) 
            fetchProperties(category_info[0].id)
          }
          if(category_info[0].ticket?.value) {
 
            const _template_ticket = await  axiosFn("get", '', '*', 'V_tickets', " id = '" +category_info[0].ticket?.value + "'" , ''  )  
            let template_ticket =  translateObj(_template_ticket?.data, ITicketObjects)[0]
            const form_set_values = {} as any
            ITicketTemplateFields.map(t=>{
              if(template_ticket[t])
              form_set_values[t] = template_ticket[t]
            })
            form.setFieldsValue(form_set_values)
            fromCopy(template_ticket, false)  
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

  const close_validation_fail = async () => {
    if(selectedTicket?.ticketWfs)
    if(selectedTicket?.ticketWfs?.length>0) {
    let ret = false
    const response = await  axiosFn("get", '', '*', 'V_wfs', " ticket = '" + selectedTicket.id + "'" , ''  ) 
    let wfs =  translateObj(response.data, ITicketWfObjects)
    let errorMsg = t('not_completed_workflows') 
    if(wfs)
    if(wfs?.length>0) {
      wfs.map(w=> {
        if(w)
        if(w.status !== WF_STATUS_COMPLETE.value && w.status !== WF_STATUS_CANCEL.value) 
        {
          ret = true
        }
        
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
    const onFinish = async (values: any) => {
      values = form.getFieldsValue()
      const values_ = {...values}
      ITicketRoFields.map(r => {
        delete values_[r]
      })

      if(values_?.status?.value === STATUS_CLOSE.value)
      {
        if(await close_validation_fail()) return  
      }
      


      let prp = propertyBuild({...values_}, ticketPrp)
      Object.keys(values_).map(v=> {
        if(v.indexOf(PRPID)!= -1)
        delete values_[v]
      })
      let valuesMulti =  saveFormBuildMulti({...values_},{...selectedTicket});
      saveFormBuild(values_)
      createTicket({...values_, id:ticketId, name:selectedTicket.name, categoryChanged: categoryChanged}, valuesMulti, user.id, [...prp], values, selectedTicket, notificationsAll, router, setPathForEmpty)
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

  
      const buildSpinner = () =>
      {
          return (
            isLoading && 
            <Spin style={{position:'fixed'}} />
          )
      }
    const buildTitle = () =>
    {
        return (
          ticketId === '0'? 
          <h1 style={{padding:'10px'}}>{ !ro && t('create_new') } { t('ticket')} { selectedTicket?.name &&  t('number') + selectedTicket?.name} &nbsp;&nbsp;&nbsp; {buildSpinner()}</h1>:
          <h1 style={{padding:'10px'}}>{ ! ro && t('update') } { t('ticket')}   { t('number')} { selectedTicket?.name } &nbsp;&nbsp;&nbsp; {buildSpinner()}</h1>
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
      if(key==='detail')
      {
        setActiveTabKey('detail')
      }
      if(key==='log')
      {
        fetchTicketLog(selectedTicket)
        setActiveTabKey('log')
      }
      if(key==='notifications')
      {
        fetchTicketNotifications(selectedTicket)
        setActiveTabKey('notifications')
      }
      if(key==='wfs')
      {
       fetchTicketWfs(selectedTicket)
       setActiveTabKey('wfs')
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
  description: "",
  status: STATUS_CREATED,
  ticket_type: TICKET_REQUEST,
  priority: PRIORITY_LOW,
  urgency: URGENCY_LOW
  }
  



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
  const toMe = () =>
  {
    let obj:any =  { assignee:user.id } 
    createTicket({...obj, id:ticketId}, {}, user.id, [])
    fetchTicket(ticketId)
  }
  
  const cancel_wfs = () => {
    let cancelObj = {
      status: WF_STATUS_CANCEL.value,
      done_by:  user.id,
      done_dt:  nowToUnix(),
      start_dt:  nowToUnix()
    } 
    if(selectedTicket?.ticketWfs)
    if(selectedTicket?.ticketWfs?.length>0) {
      selectedTicket?.ticketWfs.filter(fw=>fw.status?.value!==WF_STATUS_COMPLETE.value).map( async w=> {
        
        const responseCompleteStartWf = await  axiosFn("put", cancelObj, '*', 'wf', "id" , w.id  )
      })
    }  
  }
  const toClose = async (type: string) =>
  {
    if(await close_validation_fail()) return  
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

  const toCancel = (type: string) =>
  {
    cancel_wfs()
    setActivityType(type)
    setModalVisible(true)
    let obj:any =  { status:STATUS_CANCELED.value } 
    createTicket({...obj, id:ticketId}, {}, user.id, [])
    fetchTicket(id)
  }

  async function  SubmitActivity(values:any) {
      values = {...values, name: activityType, ticket: selectedTicket.id, old_value: '' }
       createTicketActivity(values, user.id)
       fetchTicketLog(selectedTicket)
       setModalVisible(false)
  }
  function  popover(event:any, record:ITicket ) 
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
  const toPdf = () => {
    let screen = document.getElementById('screen')
    if(screen)
    htmlToImage.toPng(screen , { quality: 0.95 })
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = 'my-image-name.jpeg';
          const pdf = new jsPDF();
          const imgProps= pdf.getImageProperties(dataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(dataUrl, 'PNG', 0, 0,pdfWidth, pdfHeight);
          pdf.save( t('ticket') + "_" +  selectedTicket.name +   ".pdf"); 

          setAlert({
            type: 'success' ,
            message: t('list_to_pdf_success') ,
            closable: true ,
            showIcon: true ,
            visible: true,
            autoClose: 10 
          })
        });
  }
  const pathTrowEmpty = (path:string) => {
    setPathForEmpty(path)
    router.push(RouteNames.EMPTY)
  }
  const toCopy = () =>
  {
      setSelectedProperty({} as ITicketPrpTpl)
      setProperties([] as ITicketPrpTpl[])
      setCopiedTicket(selectedTicket)
      setSelectedTicket({} as ITicket)
      pathTrowEmpty(RouteNames.TICKETS + '/0')
  }

  return (
  <Layout style={{height:"100vh"}} id='screen'>
      {error &&  <h1>{error}</h1> }
     

     
       <Card  >
       <div className="flex-container">
         {buildTitle()}
       </div>
   <Tabs 
   onChange={tabChangeFunction} 
   type="card" 
   tabPosition={tabPosition }
   defaultActiveKey="detail"
   activeKey={activeTabKey}
   >
      <TabPane tab={
          <span> 
          <LayoutOutlined />
          {t('detail')} 
          </span>
        } key="detail" >
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
          form.getFieldValue('assignee')?.value !== user.id &&
          <>
          <Button type="primary" htmlType="button"  key="toMe"
          onClick={() => toMe() }
          >
          { t('toMe') }
          </Button>&nbsp;&nbsp;&nbsp;
          </>
        }
         
        {
             form.getFieldValue('status')?.value !== STATUS_CLOSE.value &&
             <>
              <Button type="primary" htmlType="button" key="toClose"
              onClick={() => toClose('Close Comment') }
              >
              { t('toClose') }
              </Button>&nbsp;&nbsp;&nbsp;
              </>

        }

{
             form.getFieldValue('status')?.value !== STATUS_CANCELED.value && form.getFieldValue('status')?.value !== STATUS_CLOSE.value &&
             <>
             <Popconfirm title={t('are_you_sure_cancel')} okText={t('yes')} cancelText={t('no')}  onConfirm={() =>  toCancel('Cancel Comment')}>
              <Button type="primary" htmlType="button" key="toCancel"
              >
              { t('toCancel') }
              </Button>&nbsp;&nbsp;&nbsp;
              </Popconfirm>
              </>

        }

         

         <Button type="primary" htmlType="button" key="getTicket"
         onClick={() => getTicket() }
         >
         { t('refresh') }
         </Button>&nbsp;&nbsp;&nbsp;

         <Button type="primary" htmlType="button" key="copyTicket"
         onClick={() => toCopy() }
         > <CopyOutlined />
         { t('toCopy') }
         </Button>&nbsp;&nbsp;&nbsp;
        

         <Tooltip title={t('export_to_pdf')} >
         <FilePdfOutlined 
          style={{color:'gray',fontSize:'24px'}}
          onClick={() => toPdf() }
         />
          </Tooltip>
        </div> 
         :
         <div style={{display:'flex', justifyContent:'start'}} className="flex-container">

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
          <Row  >
          <Col xl={4}  lg={6} sm={12} xs={24}>
          
            <Form.Item 
            key="customer"
            label={customerLabel()}
            name="customer"
            style={{ padding:'5px', width: 'maxContent'}} 
            rules={[validators.required()]}
            > 
            
            <AsyncSelect 
            autoFocus={true}
            menuPosition="fixed"
            isDisabled={ro}
            isMulti={false}
            styles={SelectStyles}
            isClearable={true}
            placeholder={ t('customer') }
            cacheOptions 
            defaultOptions
            loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'customer',  ' top 20 name as label, id as value , isnull(phone, mobile_phone) as code ', 'V_contacts', NOT_GROUP_LIST , true )} 
            onChange={(selectChange:any) => selectChanged(selectChange, 'customer')}
            />
            </Form.Item>
            </Col>
            <Col xl={4}  lg={6} sm={12} xs={24}  >
           <Form.Item
           label={ t('phone') }
           name="customer_phone" 
           style={{ padding:'5px'}} 
           rules={[validators.isPhone()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('phone') }
           />
           </Form.Item>
           </Col>
          <Col xl={8}  lg={12} sm={12} xs={24}>
          <Form.Item 
            key="category"
            label={
             
              <>
              <span
              style={{cursor:'pointer'}}
               onClick={() => {
                if(!form.getFieldValue('category')) return
                setQueriesCache({ ticket: " category = '" + form.getFieldValue('category').value + "' and active = 1 " })
                  router.push(RouteNames.TICKETS)
              }}
              >
              &nbsp;&nbsp;{t('tcategory')}
               </span>
                &nbsp;&nbsp;
                <Tooltip title={t('go_to_same_tickets')}> 
               <Badge 
               size="small"
               count={categoryCrs}>
               </Badge>
               </Tooltip>
               </>
              
               }
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
          <Col xl={4}  lg={6} sm={12} xs={24}>
          <Form.Item 
            key="ci"
            label={
             
              <>
              <span
              style={{cursor:'pointer'}}
               onClick={() => {
                if(!form.getFieldValue('ci')) return
                setQueriesCache({ ticket: " ci = '" + form.getFieldValue('ci').value + "' and active = 1 " })
                  router.push(RouteNames.TICKETS)
              }}
              >
              &nbsp;&nbsp;{t('ci')}
               </span>
                &nbsp;&nbsp;
                <Tooltip title={t('go_to_same_tickets')}> 
               <Badge 
               size="small"
               count={ciCrs}>
               </Badge>
               </Tooltip>
               </>
              
               }
            name="ci"
            style={{ padding:'5px', width: 'maxContent'}} 
            // rules={[validators.required()]}
            > 
            <AsyncSelect 
            menuPosition="fixed"
            className={classes.selectClass}
            isDisabled={ro}
            isMulti={false}
            styles={SelectStyles}
            isClearable={true}
            placeholder={ t('ci') }
            cacheOptions 
            defaultOptions
            loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ci',  ' top 20 name as label, id as value , id as code ', 'ci', " active = '1' order by name asc", false )} 
            onChange={(selectChange:any) => selectChanged(selectChange, 'ci')}
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
            loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ticket_type',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'ticket_type'", false )} 
            onChange={(selectChange:any) => selectChanged(selectChange, 'ticket_type')}
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
          <Col xl={4}  lg={6} sm={12} xs={24} onClick={
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
          <Col xl={4}  lg={6} sm={12} xs={24} onClick={
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
          <Col xl={4}  lg={6} sm={12} xs={24}>
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
          <Col xl={4}  lg={6} sm={12} xs={24}>
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
            <Col xl={4}  lg={6} sm={12} xs={24}  >
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
            
            <Col xl={4}  lg={6} sm={12} xs={24}  >
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
            <Col xl={4}  lg={6} sm={12} xs={24}  >
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
            <Col xl={4}  lg={6} sm={12} xs={24}  >
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
            <Col xl={4}  lg={6} sm={12} xs={24}
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
            <Col xl={4}  lg={6} sm={12} xs={24}  >
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
          </Form>
      </TabPane>
      <TabPane tab={
          <span> 
          <UnorderedListOutlined /> 
          {t('log')} 
          </span>
        } key="log" forceRender={true} >
        <TicketLog/>   
      </TabPane>
      {
        (selectedTicket.ticketWfsCount !== 0 || selectedTicket?.ticketWfs?.length !== 0 ) && 
        <TabPane tab={
          <Badge key="rejected_wfs"
          size="small"
          count={selectedTicket?.ticketWfs?.filter(w=>w.status?.value===WF_STATUS_REJECT.value).length !== 0  ? selectedTicket?.ticketWfs?.filter(w=>w.status?.value===WF_STATUS_REJECT.value).length : 0 }
          offset={[30,-2]}
          color={'red'}
          title={t('rejected')}
          > 
          <Badge key="completed_wfs"
          size="small"
          count={selectedTicket?.ticketWfs?.filter(w=>w.status?.value===WF_STATUS_COMPLETE.value).length !== 0  ? selectedTicket?.ticketWfs?.filter(w=>w.status?.value===WF_STATUS_COMPLETE.value).length : 0 }
          offset={[10,-2]}
          color={'green'}
          title={t('completed')}
          > 
          <Badge key="all_wfs"
          size="small"
          count={selectedTicket.ticketWfsCount !== 0  ? selectedTicket.ticketWfsCount : selectedTicket?.ticketWfs?.length }
          offset={[-10,-5]}
          > 
          <span> 
          <BranchesOutlined />
          {t('wfs')} 
          </span>
          </Badge>
          </Badge>
          </Badge>
        } key="wfs" forceRender={true} >
        <TicketWfs />  
        </TabPane>  
      }
    
      <TabPane 
      tab={
        <span> 
        <MailOutlined /> 
        {t('notifications')} 
        </span>
      }
       key="notifications" forceRender={true} >
      <TicketNotifications />
      </TabPane>  
  </Tabs>  
       </Card>
   
       
       

     <Drawer
          title=""
          placement={ user.locale === 'heIL' ? 'left' : 'right'}
          closable={false}
          onClose={() => setCustomerInfo(false)}
          visible={customerInfo}
          key={'customerInfo'}
          width={ width>1000 ? 640 : 340 }
        >
          <CloseCircleOutlined  style={{fontSize:28,color:'gray'}} onClick={() => setCustomerInfo(false)} />
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
            selectedTicket.customer_info?.job_title?.label &&
            <Descriptions.Item span={3} label={t('job_title')}>{selectedTicket.customer_info.job_title.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info?.manager?.label &&
            <Descriptions.Item span={3} label={t('manager')}>{selectedTicket.customer_info.manager.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info?.primary_group?.label &&
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
            selectedTicket.customer_info?.location?.label &&
            <Descriptions.Item span={3} label={t('location')}>{selectedTicket.customer_info.location.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info?.organization?.label &&
            <Descriptions.Item span={3} label={t('organization')}>{selectedTicket.customer_info.organization.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info?.department?.label &&
            <Descriptions.Item span={3} label={t('department')}>{selectedTicket.customer_info.department.label}</Descriptions.Item>
          }
          {
            selectedTicket.customer_info?.site?.label &&
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
            <Panel header={
              <>
              <QuestionCircleOutlined /> &nbsp;&nbsp;
              {t('tickets')+' '+selectedTicket?.customer_info?.tickets?.length}
              </>
            } 
            key="1" 
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
                       <Avatar style={{backgroundColor:'#49b6ba'}}>{item.name}</Avatar>&nbsp;
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
        { selectedTicket?.customer_info?.cis?.length>0 &&
              
              <Panel header={
                <>
              <ApiOutlined /> &nbsp;&nbsp;
              {t('cis')+' '+selectedTicket?.customer_info?.cis?.length}
              </>
            } 
            
            key="2" 
            >
            <List
              itemLayout="horizontal"
              dataSource={selectedTicket.customer_info.cis}
              renderItem={item => (
                <List.Item onClick={() => ro ? goTo(RouteNames.CIS , item.id) : form.setFieldsValue({ci: {value: item.id, label:item.name, code:item.id} })}>
                  <List.Item.Meta
                    key={item.id}
                    avatar={
                    <>
                    <Badge.Ribbon text={item.name} color="cyan">
                      <Card title={ <SelectOutlined title={ !ro ?  t('select_ci') : t('go_to_ci') } />} size="small">
                      {item?.ci_class.label + ' ' + item?.ci_family } &nbsp;&nbsp;
                      {t('create_date') +':' +  uTd(item?.create_date)  }
                      </Card>
                    </Badge.Ribbon>
                       {/* <Avatar size={{ xs: 24, sm: 22, md: 30, lg: 54, xl: 70, xxl: 90 }} >{item.name}</Avatar>&nbsp; */}
                    </>
                    }
                    style={{cursor:'pointer',color:'gray'}}
                    // title={item?.ci_class?.label}
                  //   description={t('ci_family') + ':' + item?.ci_family + ' ' + t('create_date')
                  // +':' +  uTd(item?.create_date) 
                  //}
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
      </Drawer>

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
export default TicketAssignee;


// function setSelectSmall(arg0: { [x: string]: any; }) {
//   throw new Error('Function not implemented.');
// }