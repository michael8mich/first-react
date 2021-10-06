import { Button, Card, Checkbox, Col, Divider, Form, Input, Layout, Modal, Radio, Row, Select, Space, Spin, Table, TablePaginationConfig, Tabs} from 'antd';
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../axios/axios';
import {  SelectOption } from '../../models/ISearch';
import { saveFormBuild, saveFormBuildMulti } from '../../utils/formManipulation';
import { GROUP_LIST, IObjects, IObjectsMulti, IRoFields, IUser, NOT_GROUP_LIST, TEAM_TYPE_ID } from '../../models/IUser';
import { useParams } from 'react-router-dom';
import { Params } from '../../models/IParams';
import { validators } from '../../utils/validators';
import classes from './UserDtl.module.css'
import { TabsPosition } from 'antd/lib/tabs';
import { DEPARTMENT_LIST, LOCATION_LIST, ORGANIZATION_LIST, SITE_LIST } from '../../models/IOrg';
import { stubTrue } from 'lodash';

const { TabPane } = Tabs;
const UserDtl:FC = () => {
  const { t } = useTranslation();
  const {fetchUser, setSelectSmall, createUser} = useAction()
  const {error, isLoading, users, selectedUser } = useTypedSelector(state => state.admin)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const { Option } = Select;
  const { TextArea } = Input;

  const [userCurrentLoaded] = useState(selectedUser)
  const [form] = Form.useForm()
  const [ro, setRo] = useState(true)

  const {id} = useParams<Params>()
  
  function getUser() {
    if(id!=='0') 
      fetchUser(id, IObjects, IObjectsMulti)
      else
      setRo(false)
  }
  function setFormValues() {
    if(id!=='0') {
      let curUser:any = selectedUser
      //console.log('user', selectedUser);
      const currUserFields= Object.keys(curUser)
      const  formFields = Object.keys((form.getFieldsValue()))
      const form_set_values = {} as any
      formFields.map(ff => {
        form_set_values[ff] = curUser[ff]
      })
      form.setFieldsValue(form_set_values);
    }
  }

  useEffect(() => {
    getUser()
   }, [])

   useEffect(() => {
    setFormValues()
   }, [selectedUser])

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
      IRoFields.map(r => {
        delete values_[r]
      })
      let valuesMulti =  saveFormBuildMulti({...values_},{...selectedUser});
      saveFormBuild(values_)
      createUser({...values_, id}, IObjectsMulti, valuesMulti)
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
          <h1 style={{padding:'10px'}}>{ !ro && t('create_new') } { t('user')}  </h1>:
          <h1 style={{padding:'10px'}}>{ ! ro && t('update') } { t('user')}  { selectedUser.name }</h1>
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
          <Radio.Button value="top"><UpOutlined /></Radio.Button>
          <Radio.Button value="bottom"><DownOutlined /></Radio.Button>
          <Radio.Button value="left"><LeftOutlined /></Radio.Button>
          <Radio.Button value="right"><RightOutlined /></Radio.Button>
        </Radio.Group>
      </Space>
      )
      
    }
    const edit = (event:any) => {
      event.preventDefault()
      setRo(false)
    }  
    const tabChangeFunction = (key:any) => {
      console.log(key);
    }
  const localeteArr = [{'label': t('english') , 'value': 'enUS', 'code': 'enUS'},{'label': t('hebrew'), 'value': 'heIL', 'code': 'heIL'}]
  return (
    <Layout style={{height:"100vh"}}>
      {/* {
        selectedUser.id && loading &&
        setFormValues() 
      } */}
      {error && 
      <h1>{error}</h1>
      }
      {isLoading && 
       <Spin style={{padding:'20px'}} size="large" />
      }
       
       
       <Card style={{background:'#f0f2f5', border:'solid 1px lightgray', marginTop:'10px'}}>
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
         {buildTabPositins()}
         <Button type="primary" 
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
         loading={isLoading}
         >
         { t('save') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="button" 
         onClick={() => cancelUpdate() }  
         >
         { t('cancel') }
         </Button>&nbsp;&nbsp;&nbsp;
        </div>    
     }
         </Col>
        </Row>
  <Tabs onChange={tabChangeFunction} type="card" tabPosition={tabPosition }>
    <TabPane tab={t('detail')} key="1">
        <Row  >
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('last_name') }
           name="last_name" 
           style={{ padding:'5px'}} 
           rules={[validators.required()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('last_name') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('first_name') }
           name="first_name" 
           style={{ padding:'5px'}} > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('first_name') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('login_name') }
           name="login" 
           style={{ padding:'5px'}} 
           rules={[validators.isUsername()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('login') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('contact_number') }
           name="contact_number" 
           style={{ padding:'5px'}} > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('contact_number') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('contact_type') }
           name="contact_type"
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
           placeholder={ t('contact_type') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'contact_type',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'contact_type'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'contact_type')}
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('job_title') }
           name="job_title"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
      menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('job_title') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'job_title',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'job_title'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'job_title')}
           />
           </Form.Item>
           </Col>
        </Row>
        <Row  >
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
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('primary_group') }
           name="primary_group"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
      menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('primary_group') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'primary_group',  ' top 200 name as label, id as value , id as code ', 'V_contacts', GROUP_LIST , false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'primary_group')}
           />
           </Form.Item>
           </Col>
        </Row>    
        <Row  >
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('phone') }
           name="phone" 
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
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('mobile_phone') }
           name="mobile_phone" 
           style={{ padding:'5px'}} 
           rules={[validators.isPhone()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('mobile_phone') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('additional_phone') }
           name="additional_phone" 
           style={{ padding:'5px'}} 
           rules={[validators.isPhone()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('additional_phone') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('email') }
           name="email" 
           style={{ padding:'5px'}} 
           rules={[validators.isEmail()]}
           > 
           <Input
             disabled={ro} 
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('email') }
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('locale') }
           name="locale"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <Select 
           disabled={ro}
           placeholder={ t('locale') }
           onChange={(selectChange:any) => selectChanged(selectChange, 'contact_type')}
           >
             {
               localeteArr.map(o => {
                return (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                )
               })
             }
           </Select>
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
           { 
           form.getFieldsValue().contact_type && form.getFieldsValue().contact_type.value !== TEAM_TYPE_ID 
           ?
           <>
           <Col xs={12} xl={12}>
           <Form.Item 
           label={ t('roles') }
           name="roles"
           style={{ padding:'5px', width: 'maxContent'}} 
           //  rules={[validators.required()]}
           > 
           <AsyncSelect 
      menuPosition="fixed"
           isDisabled={ro}
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('roles') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'roles',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'role'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'roles')}
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={12}>
           <Form.Item 
           label={ t('teams') }
           name="teams"
           style={{ padding:'5px', width: 'maxContent'}} 
           //  rules={[validators.required()]}
           > 
           <AsyncSelect 
      menuPosition="fixed"
           isDisabled={ro}
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('teams') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'teams',  ' top 200 name as label, id as value , id as code ', 'V_contacts', " contact_type = 'F349B208096C5B982D8205DED91F5FA4'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'teams')}
           />
           </Form.Item>
           </Col>
           </>
           :
           <Col xs={12} xl={14}>
           <Form.Item 
           label={ t('members') }
           name="members"
           style={{ padding:'5px', width: 'maxContent'}} 
           //  rules={[validators.required()]}
           > 
           <AsyncSelect 
      menuPosition="fixed"
           isDisabled={ro}
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('members') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'members',  ' top 200 name as label, id as value , id as code ', 'V_contacts', " contact_type <> 'F349B208096C5B982D8205DED91F5FA4'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'members')}
           />
           </Form.Item>
           </Col>
        }
        </Row>   
      </TabPane>
      <TabPane tab={t('orgs')} key="2">
      <Row  >
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('organization') }
           name="organization"
           style={{ padding:'5px', width: 'maxContent'}} 
           > 
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('organization') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'organization',  ' top 200 name as label, id as value , id as code ', 'V_organizational_info', ORGANIZATION_LIST , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'organization')}
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('location') }
           name="location"
           style={{ padding:'5px', width: 'maxContent'}} 
           > 
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('location') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'location',  ' top 200 name as label, id as value , id as code ', 'V_organizational_info', LOCATION_LIST , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'location')}
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('department') }
           name="department"
           style={{ padding:'5px', width: 'maxContent'}} 
           > 
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('department') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'department',  ' top 200 name as label, id as value , id as code ', 'V_organizational_info', DEPARTMENT_LIST , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'department')}
           />
           </Form.Item>
           </Col>
           <Col xs={12} xl={4}>
           <Form.Item 
           label={ t('site') }
           name="site"
           style={{ padding:'5px', width: 'maxContent'}} 
           > 
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('site') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'site',  ' top 200 name as label, id as value , id as code ', 'V_organizational_info', SITE_LIST , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'site')}
           />
           </Form.Item>
           </Col>
      </Row>
      <Row  >
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('address1') }
           name="location_address1" 
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('address1') }
           />
           </Form.Item>
           </Col> 
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('address2') }
           name="location_address2" 
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('address2') }
           />
           </Form.Item>
           </Col> 
           <Col xs={12} xl={4}  >
           <Form.Item
           label={ t('address3') }
           name="location_address3" 
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('address3') }
           />
           </Form.Item>
           </Col> 
      </Row>      
    </TabPane>  
    </Tabs>   
    </Form>
    </Card>
    
  </Layout>
  )
}



export default UserDtl;

function addSelectSmall(data: any, name: string) {
  throw new Error('Function not implemented.');
}

