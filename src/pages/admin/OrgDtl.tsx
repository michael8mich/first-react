import { Button, Card, Checkbox, Col, Divider, Form, Input, Layout, Modal, Row, Select, Spin, Table, TablePaginationConfig} from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../axios/axios';
import {  SelectOption } from '../../models/ISearch';
import { saveFormBuild, saveFormBuildMulti } from '../../utils/formManipulation';
import {  NOT_GROUP_LIST } from '../../models/IUser';
import { useParams } from 'react-router-dom';
import { Params } from '../../models/IParams';
import { validators } from '../../utils/validators';
import classes from './UserDtl.module.css'
import { IOrgObjects, IOrgObjectsMulti, IOrgRoFields, ORG_INFO_TYPE_LOCATION } from '../../models/IOrg';

const OrgDtl:FC = () => {
  const { t } = useTranslation();
  const {fetchOrg, createOrg} = useAction()
  const {error, isLoading, orgs, selectedOrg } = useTypedSelector(state => state.admin)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const { Option } = Select;
  const { TextArea } = Input;

  const [userCurrentLoaded] = useState(selectedOrg)
  const [form] = Form.useForm()
  const [ro, setRo] = useState(true)

  const {id} = useParams<Params>()

  function getUser() {
    if(id!=='0') 
      fetchOrg(id)
      else
      setRo(false)
  }
  function setFormValues() {
    if(id!=='0') {
      let curOrg:any = selectedOrg
      //console.log('user', selectedOrg);
      const currUserFields= Object.keys(curOrg)
      const  formFields = Object.keys((form.getFieldsValue()))
      const form_set_values = {} as any
      formFields.map(ff => {
        form_set_values[ff] = curOrg[ff]
      })
      form.setFieldsValue(form_set_values);
    }
  }

  useEffect(() => {
    getUser()
   }, [])

   useEffect(() => {
    setFormValues()
   }, [selectedOrg])

  useEffect(() => {
   console.log('error', error);
  }, [error])

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
   
    const onFinish = async (values: any) => { 
      values = form.getFieldsValue()
      const values_ = {...values}
      IOrgRoFields.map(r => {
        delete values_[r]
      })
      let valuesMulti =  saveFormBuildMulti({...values_},{...selectedOrg});
      saveFormBuild(values_)
      createOrg({...values_, id}, valuesMulti)
      getUser()
      setRo(true)
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }

    const cancelUpdate = () => {
      setRo(true) 
      getUser()
    }

    const buildTitle = () =>
    {
        return (
          id === '0'? 
          <h1 style={{padding:'10px'}}>{ !ro && t('create_new') } { t('orgs')}  </h1>:
          <h1 style={{padding:'10px'}}>{ ! ro && t('update') } { t('orgs')}  { selectedOrg.name }</h1>
        )
    }
  const edit = (event:any) => {
    event.preventDefault()
    setRo(false)
  }  
  const localeteArr = [{'label': t('english') , 'value': 'enUS', 'code': 'enUS'},{'label': t('hebrew'), 'value': 'heIL', 'code': 'heIL'}]
  return (
    <Layout style={{height:"100vh"}}>
      {error && 
     <h1 className='ErrorH1'>{error}</h1>
      }
      {isLoading && 
       <Spin style={{padding:'20px'}} size="large" />
      }
       <Card style={{background:'#fafafa', border:'solid 1px lightgray', marginTop:'10px'}}>
       <Form
       layout="vertical"
       form={form}
       name="basic"
       // labelCol={{ span: 8 }}
       // wrapperCol={{ span: 30 }}
       initialValues={{active: true}}
       onFinish={onFinish}
       onFinishFailed={onFinishFailed}
       autoComplete="off" 
       > 
        <Row >
        <Col  xs={24} xl={8}>
        
        {ro 
        ?     
        <div style={{display:'flex', justifyContent:'start'}}>
         {buildTitle()}
         <Button type="primary" htmlType="button" 
          onClick={(event) => edit(event)  }
         >
         { t('edit') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="button" 
         onClick={() => getUser() }
         >
         { t('refresh') }
         </Button>&nbsp;&nbsp;&nbsp;
         </div> 
         :
         <div style={{display:'flex', justifyContent:'start'}}>
         {buildTitle()}
         <Button type="primary" htmlType="submit" 
        //  onClick={onFinish}
         loading={isLoading}
         >
         { t('save') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="submit" 
         onClick={() => cancelUpdate() }  
         >
         { t('cancel') }
         </Button>&nbsp;&nbsp;&nbsp;
        </div>    
     }
         </Col>
        </Row>
        <Row  >
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('name') }
           name="name" 
           style={{ padding:'5px'}} 
           rules={[validators.required()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('name') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('country') }
           name="country" 
           style={{ padding:'5px'}} > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('country') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('city') }
           name="city" 
           style={{ padding:'5px'}} 
           rules={[validators.isUsername()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('city') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('zip') }
           name="zip" 
           style={{ padding:'5px'}} > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('zip') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('organizational_type') }
           name="organizational_type"
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
           placeholder={ t('organizational_type') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'organizational_type',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'organizational_type'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'organizational_type')}
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('manager') }
           name="manager"
           style={{ padding:'5px', width: 'maxContent'}} 
           > 
           <AsyncSelect 
      menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('manager') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'manager',  ' top 20 name as label, id as value , id as code ', 'V_contacts', NOT_GROUP_LIST , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'manager')}
           />
           </Form.Item>
           </Col>
        </Row>   
        {/* {
        form.getFieldsValue().organizational_type && form.getFieldsValue().organizational_type.value === ORG_INFO_TYPE_LOCATION &&       */}
        <Row  hidden={form.getFieldsValue().organizational_type && form.getFieldsValue().organizational_type.value !== ORG_INFO_TYPE_LOCATION}>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('address1') }
           name="address1" 
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('address1') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('address2') }
           name="address2" 
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('address2') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('address3') }
           name="address3" 
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('address3') }
           />
           </Form.Item>
           </Col>   
        </Row>
        {/* } */}
        <Row  >
         <Col xs={12} xl={12}  >
         <Form.Item
           label={ t('description') }
           name="description" 
           style={{ padding:'5px'}} > 
           <TextArea 
            disabled={ro}
            showCount maxLength={3999}
            //  style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('description') }
           />
           </Form.Item>
         </Col>
         <Col xs={12} xl={4}  >
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
        </Row>    
   </Form>
      </Card>
    </Layout>
  )
}
export default OrgDtl;

function setSelectSmall(arg0: { [x: string]: any; }) {
  throw new Error('Function not implemented.');
}

