import {Form, Input, Button, Select, DatePicker,TimePicker, Row, Col, Card, Checkbox}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { ITicket, ITicketCategory, ITicketLog, ITicketWfTpl, PRP_FACTORY_LIST, PRP_FACTORY_OBJECT } from '../../../models/ITicket';
import { axiosFn } from '../../../axios/axios';
import { saveFormBuild, uTd } from '../../../utils/formManipulation';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useAction } from '../../../hooks/useAction';
import { validators } from '../../../utils/validators';
import AsyncSelect from 'react-select/async';
import { SelectOption } from '../../../models/ISearch';
import { ASSIGNEE_LIST, GROUP_LIST } from '../../../models/IUser';


const { TextArea } = Input;

interface WfDtlProps {
  save: () => void,
  cancel: () => void
  ro: boolean,
  lastSequence: string
}

const WfDtl: FC<WfDtlProps> =  (props)  => {
  const { t } = useTranslation();
  const [formWf] = Form.useForm()
  const {error, isLoading, selectedCategory, selectedWf, wfs } = useTypedSelector(state => state.ticket)
  const {createWf, fetchWf, fetchWfs, setAlert} = useAction()
  const {user } = useTypedSelector(state => state.auth)
  const [ro, setRo] = useState(true)

  useEffect(() => {
    setFormValues()
    setRo(props.ro)

  }, [selectedWf, props.ro])

  useEffect( () => {
     if(Object.keys(selectedWf).find( k=> k === 'id'))
     {
       if(!Object.keys(selectedWf).find( k=> k === 'name'))
       {
        fetchWf(selectedWf.id)
       }
     }
  }, [selectedWf?.id])


  function setFormValues() {
      let curWf:any = selectedWf
      const currWfFields= Object.keys(curWf)
      const  formFields = Object.keys((formWf.getFieldsValue()))
      const form_set_values = {} as any
      formFields.map(ff => {
        form_set_values[ff] = curWf[ff]
      })
      if(!curWf?.sequence )
      form_set_values.sequence =  Number(props.lastSequence) ? props.lastSequence : 10
      formWf.setFieldsValue(form_set_values);
  }

const onFinish = (values: any) => {
    console.log('Success:', values)

      if(!selectedWf?.id)
      {
        values = {...values, id:'0'} 
        if(wfs.find(p=> p.sequence == values.sequence))
        {
          setAlert({
            type: 'warning' ,
            message:  t('קיים רצף') ,
            closable: true ,
            showIcon: true ,
            visible: true,
            autoClose: 10 
          })
          return
        }
      }
      else
      values = {...values, id:selectedWf.id} 
      values = {...values, tcategory:selectedCategory.id} 
      const values_ = {...values}
      saveFormBuild(values_)
      createWf({...values_}, {}, user.id)
      fetchWfs(selectedCategory.id)
      setRo(true)
      props.save()
  };
  const cancel = (event:any) => {
    event.preventDefault()
    props.cancel()
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
    return (
    <Card >
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
      {/* {error && 
        <div style={{color: 'red'}}>
        {error}
        </div>
      } */}
      <Row>
      <Col   xl={4}  lg={8} sm={12} xs={24}> 
        <Form.Item label={t('sequence')}
          name="sequence"
          rules={[validators.required(), validators.isNumber()]}
        >
          <Input 
          disabled={ro}
          value="sequence"
          />
        </Form.Item>      
      </Col>
      <Col   xl={4}  lg={8} sm={12} xs={24}> 
        <Form.Item  label={t('name')}
          name="name"
          rules={[validators.required()]}
        >
          <Input
          disabled={ro} 
          value="name"
          />
        </Form.Item>
      </Col>
      <Col   xl={4}  lg={8} sm={12} xs={24}> 
        <Form.Item label={t('task')}
          name="task"
          rules={[validators.required()]}
        >
          <AsyncSelect 
           menuPosition="absolute"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('task') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'task', ' top 20 name as label, id as value , code as code ', 'utils', " type = 'wf_task'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'task')}
           />
        </Form.Item>      
      </Col>
      <Col   xl={4}  lg={8} sm={12} xs={24} >
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
      <Col   xl={4}  lg={8} sm={12} xs={24} >
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
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             defaultChecked={true}
           />
           </Form.Item>
           </Col>
        </Row>   

      {
        // isNeedCode()  && 
        //  
         <Row  >
         
            {
        selectedWf?.id && 
        <Col  xs={24} xl={6}  sm={12}> 
      <Form.Item
           label={ t('active') }
           name="active" 
           style={{ padding:'5px'}} 
           valuePropName="checked"
           > 
           <Checkbox 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             defaultChecked={true}
           />
           </Form.Item>  
      </Col>
      }   
         </Row>
      }
    

      {
        !ro && 
        <Col  xs={24} xl={12}>
        <div style={{display:'flex', justifyContent:'start'}}>
        <Form.Item >
          <Button type="primary" htmlType="submit" loading={isLoading} 
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
        </Col>
      }
     
    </Form>
    </Card>
    )
  
  }


  
  export default WfDtl;

