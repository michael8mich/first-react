import {Form, Input, Button, Select, DatePicker,TimePicker, Row, Col, Card, Checkbox, Tooltip, Badge}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { ITicket, ITicketCategory, ITicketLog, ITicketWfTpl, PRP_FACTORY_LIST, PRP_FACTORY_OBJECT, WF_LOG_COMPLETE, WF_LOG_PEND, WF_LOG_REJECT,
   WF_STATUS_CANCEL,
   WF_STATUS_COMPLETE, WF_STATUS_PEND, WF_STATUS_REJECT, WF_STATUS_WAIT, WF_TASK_APPROVE, WF_TASK_END_GROUP, WF_TASK_START_GROUP } from '../../models/ITicket';
import { axiosFn } from '../../axios/axios';
import { getDurationTime, getWaitingTime, nowToUnix, saveFormBuild, secondsToDhms, uTd } from '../../utils/formManipulation';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useAction } from '../../hooks/useAction';
import { validators } from '../../utils/validators';
import AsyncSelect from 'react-select/async';
import { SelectOption } from '../../models/ISearch';
import { ASSIGNEE_LIST, GROUP_LIST } from '../../models/IUser';
import { LikeOutlined, DislikeOutlined, UserAddOutlined, DeleteOutlined } from '@ant-design/icons';
import { stringify } from 'querystring';
import { logWfManipulation } from '../../utils/logCreateor';
import { notifyWf } from '../../utils/notificatinSend';
import { WF_PEND, WF_REJECT } from '../../models/INotification';

const { TextArea } = Input;

interface TicketWfDtlProps {
  save: () => void,
  cancel: () => void,
  setRoWf: (value:boolean) => void,
  resetSelectedWf: (value:string) => void,
  ro: boolean,
  lastSequence: string,
  selectedWf: ITicketWfTpl
  wfs: ITicketWfTpl[]
}
interface Ticket {
  ticketId: string,
  tCategory: string,
  tStatus: string
}
const TicketWfDtl: FC<TicketWfDtlProps> =  (props)  => {
  const { t } = useTranslation();
  const [formWf] = Form.useForm()
  const {createWf, fetchWf, fetchTicketWfs, setAlert} = useAction()
  const {user } = useTypedSelector(state => state.auth)
  const {selectedTicket } = useTypedSelector(state => state.ticket)
  const [ro, setRo] = useState(true)
  const [ticket, setTicket] = useState({} as Ticket)

  const {notificationsAll } = useTypedSelector(state => state.admin)
  useEffect(() => {
    setFormValues()
    setRo(props.ro)
  }, [props.selectedWf, props.ro, props.wfs])

  useEffect( () => {
     if(Object.keys(props.selectedWf).find( k=> k === 'id'))
     {
       if(!Object.keys(props.selectedWf).find( k=> k === 'name'))
       {
        fetchWf(props.selectedWf.id)
       }
     }
  }, [props.selectedWf?.id])


  function setFormValues() {
      let curWf:any = props.selectedWf
      const currWfFields= Object.keys(curWf)
      const  formFields = Object.keys((formWf.getFieldsValue()))
      const form_set_values = {} as any
      
      if(curWf?.id === '0')
      {
        let ticket_:Ticket = {
          ticketId: curWf?.ticket.value,
          tCategory: curWf?.tcategory.value,
          tStatus: curWf?.status.value
        } 
        formFields.map(ff => {
          form_set_values[ff] = null
        })
        setTimeout(() => {
          setRo(false)
        }, 1000);
        
        let curSequence = curWf?.sequence
        let curIndex = props.wfs.findIndex(e=>e.sequence === curSequence)
        let newSequence = curIndex === props.wfs.length-1 ? +curSequence + 10 : 0
        if(newSequence === 0)
        {
          let nextSequence =  props.wfs[curIndex+1].sequence
          let availableNumbers = +nextSequence - +curSequence
          if(availableNumbers===1)
          {
            setAlert({
              type: 'warning' ,
              message: t('sequence_exist') ,
              closable: true ,
              showIcon: true ,
              visible: true,
              autoClose: 10 
            })
            props.cancel()
          }
          newSequence = +curSequence + Math.floor(availableNumbers/2) 
        } 
        let ifInGroup = false
        props.wfs.map(w=> {
              if(w.task.value === WF_TASK_START_GROUP.value && +w.sequence < +curSequence)
              ifInGroup = true 
              if(w.task.value === WF_TASK_END_GROUP.value && +w.sequence < +curSequence)
              ifInGroup = false 
        })
        if(!ifInGroup || ticket_.tStatus !== WF_STATUS_PEND.value)
        ticket_.tStatus = WF_STATUS_WAIT.value
        form_set_values.sequence =  newSequence
        setTicket(ticket_)
      }
      else {
        formFields.map(ff => {
          form_set_values[ff] = curWf[ff]
        })
      }
      
      formWf.setFieldsValue(form_set_values);
  }

const onFinish =async (values: any) => {
    console.log('Success:', values)
      
      let values_ = {} as any
      values_.team = values.team?.value ? values.team?.value  : ""
      values_.assignee = values.assignee?.value ? values.assignee?.value : ""
      values_.description = values?.description

      if(props.selectedWf?.id === '0'){
      values_.task = values.task?.value ? values.task?.value : ""
      values_.name = values?.name
      values_.description = values?.description
      values_.ticket = ticket.ticketId
      values_.sequence = values?.sequence
      values_.status = ticket.tStatus 
      values_.created_dt =  nowToUnix().toString()
      values_.tcategory =  ticket.tCategory  
      values_.deleteable =  values?.deleteable  ? 1 : 0 
  
      if( values_.status === WF_STATUS_PEND.value)
       values_.start_dt = nowToUnix()
        const responseNewWf = await  axiosFn("post",values_, '*', 'wf', "id" , ''  )
        fetchTicketWfs({...selectedTicket, id:ticket.ticketId} ) 
        if( values_.status === WF_STATUS_PEND.value) 
        {
          if(responseNewWf?.data[0]?.id) {
            let changedWf = {...values_, team: values.team, 
              description: values_?.description,  assignee: values.assignee,
              id: responseNewWf?.data[0]?.id
            }
            notifyWf(WF_PEND, selectedTicket, changedWf , notificationsAll )
          }
            
        }
        
        props.cancel()
      } else {
       
        const responseNewWf = await  axiosFn("put",values_, '*', 'wf', "id" , props.selectedWf.id  )  
        if(props?.selectedWf?.status?.value === WF_STATUS_PEND.value)
        {
        
          let changedWf = {...props.selectedWf, team: values.team, 
          description: values_?.description,  assignee: values.assignee }
          if(values?.team?.value )
          if(props?.selectedWf?.team?.value !== values?.team?.value){
            notifyWf(WF_PEND, selectedTicket, changedWf , notificationsAll, 'team' )
          }
          if(values?.assignee?.value)
          if(props?.selectedWf?.assignee?.value !== values?.assignee?.value){
            notifyWf(WF_PEND, selectedTicket, changedWf , notificationsAll, 'assignee' )
          }
            
        }
        fetchTicketWfs(selectedTicket) 
        //props.setRoWf(true)
        props.cancel()
      }
       
  };
  const cancel = (event:any) => {
    event.preventDefault()
    props.cancel()
  } 

  const reject_wf = async () => {
    let reject = {
      status: WF_STATUS_REJECT.value,
      done_by:  user.id,
      done_dt:  nowToUnix(),
      start_dt:  nowToUnix()
    } 
    const responseReject = await  axiosFn("put", reject, '*', 'wf', "id" , props.selectedWf.id  )
    let w = props.selectedWf
            if(w) {
              logWfManipulation(w, WF_LOG_REJECT, selectedTicket.id, user.id)
              notifyWf(WF_REJECT, selectedTicket, w, notificationsAll ) 
            }
    fetchTicketWfs(selectedTicket) 
    props.setRoWf(true)
    props.cancel()
  }
  const approve_wf = async () => {
    let approve = {
      status: WF_STATUS_COMPLETE.value,
      done_by:  user.id,
      done_dt:  nowToUnix()
    } 
    let pend = {
      status: WF_STATUS_PEND.value,
      start_dt:  nowToUnix()
    } 
    let complete_start_group = {
      status: WF_STATUS_COMPLETE.value,
      done_by:  user.id,
      done_dt:  nowToUnix(),
      start_dt:  nowToUnix()
    } 
    let prev_wf = {} as any
    let start_group_complete = false
    interface pendComplete  {
      id: string
      complete: boolean,
      start_group?: boolean 
    }
    let pendArray: pendComplete[] = []
    //--- current wf 
    pendArray.push({ id: props.selectedWf.id, complete: true })
    prev_wf = props.selectedWf
    
    let rest_wfs = props.wfs.filter(wf=>+wf.sequence > +props.selectedWf.sequence && wf.status?.value === WF_STATUS_WAIT.value)

    rest_wfs.map( async w => {
      let if_before_complete = !!pendArray.find( p => p.id === prev_wf.id && p.complete )
      let if_before_pend = !!pendArray.find( p => p.id === prev_wf.id && !p.complete )
      if(if_before_complete)
      {
          if(w.task.value===WF_TASK_START_GROUP.value )
          {
            start_group_complete = true
            pendArray.push({ id: w.id, complete: true, start_group: true })
          } else 
          if(w.task.value===WF_TASK_END_GROUP.value)
          {
            start_group_complete = false
            
            let pend_before = false
            let prev_wfs = props.wfs.filter(wf=>+wf.sequence < +w.sequence)
            prev_wfs.map(pw=> {
            if(pw.status?.value!==WF_STATUS_COMPLETE.value && pw.id !== props.selectedWf.id)
            pend_before = true
            })
            if(!pend_before)
             pendArray.push({ id: w.id, complete: true })
          }
          else
          pendArray.push({ id: w.id, complete: false })
      }
      if(if_before_pend && start_group_complete && w.task.value!==WF_TASK_END_GROUP.value)
      {
           pendArray.push({ id: w.id, complete: false })

      }
      prev_wf = w
    }  
    )
    if(pendArray.length>0) {
      pendArray.map( async (value,index)  => {
        if(value.start_group)
        {
          const responseCompleteStartWf = await  axiosFn("put", complete_start_group, '*', 'wf', "id" , value.id  )
        } 
        else
        {
          const responseCompleteWf = await  axiosFn("put",value.complete ?  approve : pend, '*', 'wf', "id" , value.id  ) 
          if(!value.complete) {
            let w = props.wfs.find(wf=>wf.id===value.id)
            if(w) {
              logWfManipulation(w, WF_LOG_PEND, selectedTicket.id, user.id)
              notifyWf(WF_PEND, selectedTicket, w, notificationsAll )  
            } 
          }
          else {
            let w = props.wfs.find(wf=>wf.id===value.id)
            if(w && w.task?.value !== WF_TASK_START_GROUP.value && w.task?.value !== WF_TASK_END_GROUP.value) {
              logWfManipulation(w, WF_LOG_COMPLETE, selectedTicket.id, user.id)
            }
          }
        }
        

        if(pendArray.length === index+1)   {
          fetchTicketWfs(selectedTicket) 
          props.setRoWf(true)
          props.cancel() 
        }
      } )
    
    } 
    else
    {
      fetchTicketWfs(selectedTicket) 
      props.setRoWf(true)
     //props.cancel()
    }  
  }
  const toMe = async () =>
  {
    let values_:any =  { assignee:user.id } 
    const responseNewWf = await  axiosFn("put",values_, '*', 'wf', "id" , props.selectedWf.id  )  
    notifyWf(WF_PEND, selectedTicket, {...props.selectedWf, assignee:{label:user.name, value:user.id,code:user.id}}  , notificationsAll, 'assignee' )
      fetchTicketWfs(selectedTicket) 
      props.setRoWf(true)
      //props.cancel()  
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const SelectStyles = {
    container: (provided: any) => ({
      ...provided,
      width: '100%',
      opacity: '1 !important'
    })
  }
  const [selectOptions , setSelectOptions] = useState({} as any)
  const [selectValues , setSelectValues] = useState({} as any ) 
  const {selectSmall } = useTypedSelector(state => state.cache)
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
          //setSelectSmall( { [name]: response.data } )
          return response.data
        } 
      }
      else // not big table
        {
          return selectOptions[name].filter((i:SelectOption) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
        }
    }  
    const [validationRules, setValidationRules] = useState([{name: 'tcode', value: [] as any}])
    const setValidators = (name:string) => {
      let rule = validationRules.find(v=>v.name === name )
      if(rule)
      return rule.value
      else
      return []

    }
    const selectChanged = async (selectChange:any, name:string) =>
      {
        if(name==='tcode_select') {
          if(selectChange?.value) {
            formWf.setFieldsValue({ code: selectChange?.code }) 
          }   
        }
        if(name==='factory') {
          if(selectChange?.label === 'Object' || selectChange?.label === 'List') {  
            validationRules.map(v=> 
              {
                   if(v.name==='tcode')
                   v.value = [validators.required()]
              }
              )
            setValidationRules([...validationRules] )
          }  
          else {
            validationRules.map(v=> 
              {
                   if(v.name==='tcode')
                   v.value = []
              }
              )
              setValidationRules([...validationRules] )
          }
          
        }
        setSelectValues({...selectOptions, [name]: selectChange })
      }
    function  isNeedCode() {
      let v = formWf.getFieldsValue()
      if(v?.factory?.value)
      return v.factory.value === PRP_FACTORY_OBJECT || v.factory.value === PRP_FACTORY_LIST 
      else
      return false
    }  
    const ifMyWf = (w:ITicketWfTpl) => {
      let ret = false
      if( w.assignee?.value === user.id || JSON.stringify(user.teams).includes(w.team?.value)  ) 
      ret = true
      return ret
   }
   const borderStyle = (obj:string) => {
     if(props.selectedWf?.status?.value)
     {
      if(obj==='card') {
        if(props.selectedWf?.status?.value=== WF_STATUS_REJECT.value)
        return {border:'2px solid red'}
        if(props.selectedWf?.status?.value=== WF_STATUS_PEND.value)
        return {border:'2px solid #28a4ae'}
        if(props.selectedWf?.status?.value=== WF_STATUS_COMPLETE.value)
        return {border:'2px solid green'}
      }
      if(obj==='row') {
        if(props.selectedWf?.status?.value=== WF_STATUS_REJECT.value)
        return {border:'1px solid red',background:'#f5f5f5', padding:10}
        if(props.selectedWf?.status?.value=== WF_STATUS_PEND.value)
        return {border:'1px solid #28a4ae',background:'#f5f5f5', padding:10}
        if(props.selectedWf?.status?.value=== WF_STATUS_COMPLETE.value)
        return {border:'1px solid green',background:'#f5f5f5', padding:10}
      }
      
     }
     return {}
   }
    const WaitingTime = (className:boolean = false) => {
    let classCss = 'fa fa-circle'
    let color = "#88d969"
    let start_dt = +props.selectedWf?.start_dt || 0

    if(getWaitingTime(start_dt) > 64 * 60 * 60)
    {
      classCss += ' Waiting5'
      color = "#ff2400"
    }
    else
    if(getWaitingTime(start_dt) > 32 * 60 * 60)
    {
      classCss += ' Waiting4'
      color = "##ef7215"
    }
    else
    if(getWaitingTime(start_dt) > 16 * 60 * 60)
    {
      classCss += ' Waiting3'
      color = "#e8a317"
    }
    else
    if(getWaitingTime(start_dt) > 8 * 60 * 60)
    {
      classCss += ' Waiting2'
      color = "#ffd858"
    }
    else
    if(getWaitingTime(start_dt) > 2 * 60 * 60)
    {
      classCss += ' Waiting1'
      color = "#46cb18"
    }
    else
    {
      classCss += ' Waiting0'
      color = "#88d969"

    }
  
    if(className) 
    return classCss
    else
    return color
    
    }
    return (
    <Card 
    style={borderStyle('card')}
    title={t('wf_dtl') + ': ' + (props.selectedWf?.id === '0' ? t('new') : props.selectedWf.name) }
    >
      <Form
       layout="vertical"
      form={formWf}
      name="formWf"
      initialValues={{active: 1}}
      // labelCol={{ span: 6 }}
      wrapperCol={{ span: 22 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {
        ro &&  props.selectedWf.task.value !== WF_TASK_START_GROUP.value && props.selectedWf.task.value !== WF_TASK_END_GROUP.value &&  props.selectedWf?.status?.value !== WF_STATUS_CANCEL.value &&
         <Row  
         style={borderStyle('row')}
         >
          <Col  xl={24}  lg={24} sm={24} xs={24}
         
          > 
          <div style={{display:'flex', justifyContent:'space-between'}}>
            {
               props.selectedWf && props.selectedWf?.status && props.selectedWf?.status?.value === WF_STATUS_PEND.value &&
               <>
                 <i
                 style={{fontSize: 24}}
                  className={WaitingTime(true)}
                  aria-hidden="true"
                  
                ></i>&nbsp; 
                 <Badge.Ribbon 
                 color={WaitingTime()}
                 text={secondsToDhms(getWaitingTime(+props.selectedWf.start_dt))}> 
                 </Badge.Ribbon>
              </>

            }
          {
            
             
             ( props.selectedWf.status?.value === WF_STATUS_PEND.value || props.selectedWf.status?.value === WF_STATUS_REJECT.value) && ifMyWf(props.selectedWf) &&
              <>
            <Tooltip title={props.selectedWf.task.value === WF_TASK_APPROVE.value ? t('approve_wf') : t('action_wf')} >
            <LikeOutlined style={{fontSize:28,color:'#49b6ba',cursor:'pointer'}}
            onClick={approve_wf}
            />
            </Tooltip>
            {
              props.selectedWf.status?.value !== WF_STATUS_REJECT.value &&
              <Tooltip title={t('reject_wf')} >
              <DislikeOutlined style={{fontSize:28,color:'#cc3333',cursor:'pointer'}} 
              onClick={reject_wf}
              /> 
            </Tooltip>
            }
          
         </>
          }
          {
            props.selectedWf.status?.value !== WF_STATUS_COMPLETE.value &&
            <>
            {
              (!props.selectedWf.assignee?.value || props.selectedWf.assignee?.value  !== user.id) &&
              <Tooltip title={t('toMe')} >
              <UserAddOutlined style={{fontSize:28,color:'#49b6ba',cursor:'pointer'}} 
              onClick={toMe}
              />
             </Tooltip>
            }
          
            {
              props.selectedWf.deleteable === '1' && 
              <Tooltip title={t('delete')} >
              <DeleteOutlined style={{fontSize:28,color:'gray',cursor:'pointer'}} /> 
            </Tooltip>
            }
            </>
          }
         
         
         </div>
         </Col>
         </Row>
      }
      <Row>
      <Col   xl={8}  lg={12} sm={12} xs={24}> 
        <Form.Item label={t('sequence')}
          name="sequence"
          rules={[validators.required(), validators.isNumber()]}
        >
          <Input 
          disabled={true}
          value="sequence"
          />
        </Form.Item>      
      </Col>
      <Col   xl={8}  lg={12} sm={12} xs={24}> 
        <Form.Item  label={t('name')}
          name="name"
          rules={[validators.required()]}
        >
          <Input
          disabled={props.selectedWf?.id === '0' ? false: true} 
          value="name"
          />
        </Form.Item>
      </Col>
      <Col   xl={8}  lg={12} sm={12} xs={24}> 
        <Form.Item label={t('task')}
          name="task"
          rules={[validators.required()]}
        >
          <AsyncSelect 
           menuPosition="absolute"
           isDisabled={props.selectedWf?.id === '0' ? false: true}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('task') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'task', ' top 20 name as label, id as value , code as code ', 'utils', " type = 'wf_task' and id not in ('" + WF_TASK_START_GROUP.value +  "', '" + WF_TASK_END_GROUP.value + "')", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'task')}
           />
        </Form.Item>      
      </Col>
      </Row>
      {props.selectedWf?.id !== '0' && 
      <Row>
      <Col   xl={8}  lg={12} sm={12} xs={24}> 
        
        
        <Form.Item label={t('start_dt')}
        >
           
          <Input 
          disabled={true}
          value={uTd(props.selectedWf.start_dt)}
          />
        </Form.Item>      
      </Col>
      <Col   xl={8}  lg={12} sm={12} xs={24}> 
        <Form.Item label={t('done_dt')}
        >
          <Input 
          disabled={true}
          value={uTd(props.selectedWf.done_dt)}
          />
        </Form.Item>      
      </Col>
      <Col   xl={8}  lg={12} sm={12} xs={24}> 
        <Form.Item label={t('done_by')}
        >
          <Input 
          disabled={true}
          value={props.selectedWf.done_by?.label}
          />
        </Form.Item>      
      </Col>
      </Row>
      }
      <Row>
      {props.selectedWf?.id !== '0' &&
      <Col   xl={8}  lg={12} sm={12} xs={24} >
           <Form.Item 
           key="status"
           label={ t('status') }
           name="status"
           style={{ padding:'5px', width: 'maxContent'}} 
           > 
           <AsyncSelect 
           menuPosition="absolute"
           isDisabled={true}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('status') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'status',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'wf_status'" , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'status')}
           />
           </Form.Item>
      </Col>
      }
      <Col   xl={8}  lg={12} sm={12} xs={24} >
           <Form.Item 
           key="team"
           label={ t('team') }
           name="team"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.requiredTeamOrAssignee(formWf.getFieldValue('team')?.value,formWf.getFieldValue('assignee')?.value,formWf.getFieldValue('task')?.code)]}
           > 
           <AsyncSelect 
           menuPosition="absolute"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('team') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'team',  ' top 20 name as label, id as value , id as code ', 'V_contacts', GROUP_LIST , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'team')}
           />
           </Form.Item>
      </Col>
      <Col   xl={8}  lg={8} sm={12} xs={24} >
           <Form.Item 
           key="assignee"
           label={ t('assignee') }
           name="assignee"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.requiredTeamOrAssignee(formWf.getFieldValue('team')?.value,formWf.getFieldValue('assignee')?.value,formWf.getFieldValue('task')?.code)]}
           > 
           <AsyncSelect
           name="select_assignee" 
           menuPosition="absolute"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('assignee') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'assignee',  ' top 200 name as label, id as value , id as code ', 'V_contacts', ASSIGNEE_LIST , false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'assignee')}
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
        <Col xs={24} xl={4}  >
           <Form.Item
           label={ t('deleteable') }
           name="deleteable" 
           style={{ padding:'5px'}} 
           valuePropName="checked"
           > 
           <Checkbox 
             disabled={props.selectedWf?.id === '0' ? false : true}
             style={{ height:'38px', width: 'maxContent'}}
             defaultChecked={true}
           />
           </Form.Item>
           </Col>
      </Row>   

      
    

      {
        !ro ?
        <Col  xs={24} xl={12}>
        <div style={{display:'flex', justifyContent:'start'}}>
        <Form.Item >
          <Button type="primary" htmlType="submit" 
          >
            {t('save')}
          </Button>
        </Form.Item>&nbsp;&nbsp;&nbsp;
        <Form.Item >
          <Button type="primary" 
          onClick={(event) => cancel(event)}
          >
            {t('cancel')}
          </Button>
        </Form.Item>
        </div>
        </Col> :
        <Col  xs={24} xl={12}>
        <div style={{display:'flex', justifyContent:'start'}}>
        <Form.Item >
          <Button type="primary" 
          onClick={(event) => cancel(event)}
          >
            {t('close')}
          </Button>&nbsp;&nbsp;&nbsp;
        </Form.Item>
          {
            props.selectedWf.task.value !== WF_TASK_START_GROUP.value && props.selectedWf.task.value !== WF_TASK_END_GROUP.value && props.selectedWf.status?.value !== WF_STATUS_COMPLETE.value &&
            <Form.Item >
            <Button type="primary" 
            onClick={(event) => setRo(false)}
            >
            {t('edit')}
            </Button>
            </Form.Item>
          }
          
        </div>
        </Col>
      }
     
    </Form>
    </Card>
    )
  
  }


  
  export default TicketWfDtl;

