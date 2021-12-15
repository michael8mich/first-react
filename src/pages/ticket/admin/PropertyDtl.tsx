import {Form, Input, Button, Select, DatePicker,TimePicker, Row, Col, Card, Checkbox}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { ITicket, ITicketCategory, ITicketLog, ITicketPrpTpl, PRP_FACTORY_LIST, PRP_FACTORY_OBJECT } from '../../../models/ITicket';
import { axiosFn } from '../../../axios/axios';
import { saveFormBuild, uTd } from '../../../utils/formManipulation';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useAction } from '../../../hooks/useAction';
import { validators } from '../../../utils/validators';
import AsyncSelect from 'react-select/async';
import { SelectOption } from '../../../models/ISearch';


const { TextArea } = Input;

interface PropertyDtlProps {
  save: () => void,
  cancel: () => void
  ro: boolean,
  lastSequence: string
}

const PropertyDtl: FC<PropertyDtlProps> =  (props)  => {
  const { t } = useTranslation();
  const [formPrp] = Form.useForm()
  const {error, isLoading, selectedCategory, selectedProperty, properties } = useTypedSelector(state => state.ticket)
  const {createProperty, fetchProperty, fetchProperties, setAlert} = useAction()
  const {user } = useTypedSelector(state => state.auth)
  const [ro, setRo] = useState(true)

  useEffect(() => {
    setFormValues()
    setRo(props.ro)

  }, [selectedProperty, props.ro])

  useEffect( () => {
     if(Object.keys(selectedProperty).find( k=> k === 'id'))
     {
       if(!Object.keys(selectedProperty).find( k=> k === 'name'))
       {
        fetchProperty(selectedProperty.id)
       }
     }
  }, [selectedProperty?.id])


  function setFormValues() {

      let curProperty:any = selectedProperty
      const currPropertyFields= Object.keys(curProperty)
      const  formFields = Object.keys((formPrp.getFieldsValue()))
      const form_set_values = {} as any
      formFields.map(ff => {
        form_set_values[ff] = curProperty[ff]
      })
      if(!curProperty?.sequence )
      form_set_values.sequence =  Number(props.lastSequence) ? props.lastSequence : 10
      formPrp.setFieldsValue(form_set_values);
  }

const onFinish = (values: any) => {
    console.log('Success:', values)

      if(!selectedProperty?.id)
      {
        values = {...values, id:'0'} 
        if(properties.find(p=> p.sequence == values.sequence))
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
      values = {...values, id:selectedProperty.id} 
      values = {...values, category:selectedCategory.id} 
      const values_ = {...values}
      saveFormBuild(values_)
      createProperty({...values_}, {}, user.id)
      fetchProperties(selectedCategory.id)
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
            formPrp.setFieldsValue({ code: selectChange?.code }) 
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
      let v = formPrp.getFieldsValue()
      if(v?.factory?.value)
      return v.factory.value === PRP_FACTORY_OBJECT || v.factory.value === PRP_FACTORY_LIST 
      else
      return false
    }  
    return (
    <Card >
      <Form
       layout="vertical"
      form={formPrp}
      name="formPrp"
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
      <Col  xs={24} xl={6} sm={12}> 
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
      <Col  xs={24} xl={6}  sm={12}> 
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
      <Col  xs={24} xl={6}  sm={12}> 
        <Form.Item label={t('factory')}
          name="factory"
          rules={[validators.required()]}
        >
          <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('factory') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'factory', ' top 20 name as label, id as value , id as code ', 'utils', " type = 'tproperty_type'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'factory')}
           />
        </Form.Item>      
      </Col>
      <Col  xs={24} xl={6}  sm={12}> 
        <Form.Item label={t('default')}
          name="defaultValue"
        >
          <Input 
          disabled={ro}
          value="defaultValue"
          />
        </Form.Item>      
      </Col>
      </Row>
      <Row>
      <Col  xs={24} xl={2}  sm={12}> 
        <Form.Item label={t('width')}
          name="width"
          rules={[validators.isNumber(), validators.required()]}
        >
          <Input
          disabled={ro} 
          value="width"
          />
        </Form.Item>      
      </Col>
      <Col  xs={24} xl={4}  sm={12}> 
        <Form.Item  label={t('placeholder')}
          name="placeholder"
        >
          <Input 
           disabled={ro}
          value="placeholder"
          />
        </Form.Item>
      </Col>
      <Col  xs={24} xl={8}  sm={12}> 
        <Form.Item label={t('pattern')}
          name="pattern"
        >
          <Input 
          disabled={ro}
          value="pattern"
          />
        </Form.Item>      
      </Col>
      <Col  xs={24} xl={8}  sm={12}> 
        <Form.Item label={t('dependence')}
          name="dependence"
        >
          <Input 
          disabled={ro}
          value="dependence"
          style={{height:'38px'}}
          />
        </Form.Item>      
      </Col>
      
      </Row>
      {
        // isNeedCode()  && 
        //  
         <Row  >
         <Col  xs={24} xl={6}  sm={12}> 
           <Form.Item 
             label={t('select') + ' ' + t('tcode')}
             name="tcode_select"
           >
             <AsyncSelect 
              menuPosition="fixed"
              isDisabled={ro}
              isMulti={false}
              styles={SelectStyles}
              isClearable={true}
              placeholder={t('select') + ' ' + t('tcode')}
              cacheOptions 
              defaultOptions
              loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'tcode_select', ' top 20 name as label, id as value , code ', 'utils', " type = 'property_object_type'", false )} 
              onChange={(selectChange:any) => selectChanged(selectChange, 'tcode_select')}
              />
           </Form.Item>      
         </Col>
           <Col xs={24} xl={12} sm={12} >
            <Form.Item
              label={ t('tcode') }
              name="code" 
              style={{ padding:'5px'}} 
              rules={setValidators('tcode')}
              > 
              <TextArea 
              rows={3}
               disabled={ro}
                placeholder={ t('code') }
              />
              </Form.Item>
            </Col>
            {
        selectedProperty?.id && 
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


  
  export default PropertyDtl;

