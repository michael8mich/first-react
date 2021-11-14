import { Button, Card, Checkbox, Col, Divider, Form, Input, Layout, Modal, Row, Select, Spin, Table, TablePaginationConfig} from 'antd';
import  {FC, useEffect, useRef, useState} from 'react';
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
import { INotificationObjects, INotificationObjectsMulti, INotificationRoFields } from '../../models/INotification';
import EmailEditor from 'react-email-editor';

const NotificationDtl:FC = () => {
const emailEditorRef = useRef(null);
const [editor , setEditor  ] = useState({} as any)

const exportHtml = () => {
  editor.exportHtml((data: { design: any; html: any; }) => {
    const { design, html } = data
    console.log('exportHtml', html)
    form.setFieldsValue({ 'body': html.toString()} );
  })
}

  const { t } = useTranslation();
  const {fetchNotification, createNotification} = useAction()
  const {error, isLoading, notifications, selectedNotification } = useTypedSelector(state => state.admin)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const { Option } = Select;
  const { TextArea } = Input;

  const [userCurrentLoaded] = useState(selectedNotification)
  const [form] = Form.useForm()
  const [ro, setRo] = useState(true)

  const {id} = useParams<Params>()

  function getNotification() {
    if(id!=='0') 
      fetchNotification(id)
      else
      setRo(false)
  }
  function setFormValues() {
    if(id!=='0') {
      let curNotification:any = selectedNotification
      //console.log('user', selectedNotification);
      const currUserFields= Object.keys(curNotification)
      const  formFields = Object.keys((form.getFieldsValue()))
      const form_set_values = {} as any
      formFields.map(ff => {
        form_set_values[ff] = curNotification[ff]
      })
      form.setFieldsValue(form_set_values);
    }
  }

  useEffect(() => {
    getNotification()
   }, [])

   useEffect(() => {
    setFormValues()
    setEditor(selectedNotification.body)
    
   }, [selectedNotification])

  useEffect(() => {
   console.log('error', error);
  }, [error])
 const onReadyEditor = () => {
  setEditor(selectedNotification.body)
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
   
    const onFinish = async (values: any) => { 
      values = form.getFieldsValue()
      const values_ = {...values}
      INotificationRoFields.map(r => {
        delete values_[r]
      })
      let valuesMulti =  saveFormBuildMulti({...values_},{...selectedNotification});
      saveFormBuild(values_)
      createNotification({...values_, id}, valuesMulti)
      getNotification()
      setRo(true)
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }

    const cancelUpdate = () => {
      setRo(true) 
      getNotification()
    }

    const buildTitle = () =>
    {
        return (
          id === '0'? 
          <h1 style={{padding:'10px'}}>{ !ro && t('create_new') } { t('notifications')}  </h1>:
          <h1 style={{padding:'10px'}}>{ ! ro && t('update') } { t('notifications')}  { selectedNotification.name }</h1>
        )
    }
  const edit = (event:any) => {
    event.preventDefault()
    setRo(false)
  }  
  const localeteArr = [{'label': t('english') , 'value': 'enUS', 'code': 'enUS'},{'label': t('hebrew'), 'value': 'heIL', 'code': 'heIL'}]
  
  const [preview, setPreview] = useState(false)
  const onLoad = () => {
    // editor instance is created
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  }

  const onReady = () => {
    // editor is ready
    console.log('onReady');
    setEditor(selectedNotification.body)
  };

  return (
    <Layout style={{height:"100vh"}}>
      {error && 
      <h1>{error}</h1>
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
         onClick={() => getNotification() }
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
           <Col xs={24} xl={4}  >
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
           <Col xs={24} xl={4}>
           <Form.Item 
           label={ t('notification_type') }
           name="notification_type"
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
           placeholder={ t('notification_type') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'notification_type',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'notification_type'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'notification_type')}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={18}  >
           <Form.Item
           label={ t('send_to') }
           name="send_to" 
           style={{ padding:'5px'}} > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('send_to') }
           />
           </Form.Item>
           </Col>
           </Row>   
           <Row  >
           <Col xs={24} xl={24}  >
           <Form.Item
           label={ t('condition') }
           name="condition" 
           style={{ padding:'5px'}} 
          //  rules={[validators.isUsername()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('condition') }
           />
           </Form.Item>
           </Col>
           </Row>   
           <Row  >
           <Col xs={24} xl={24}  >
           <Form.Item
           label={ t('subject') }
           name="subject" 
           style={{ padding:'5px'}} > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('subject') }
           />
           </Form.Item>
           </Col>
        </Row>   
        
        <Row  >
         <Col xs={24} xl={20}  >
         
         <Form.Item
           label={ t('body') }
           name="body" 
           style={{ padding:'5px'}} > 
           <TextArea 
            disabled={ro}
            rows={10}
            showCount maxLength={3999}
            //  style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('body') }
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
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             defaultChecked={true}
           />
           </Form.Item>
           </Col>
        </Row>    
        <Row  >
        
         <Col xs={24} xl={4}  >
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

   <br />
   {
     !ro && 
     <div style={{border:'1px solid red'}} >
         <Button onClick={exportHtml}>Export HTML</Button>


         
           <EmailEditor ref={(editor) => setEditor(editor)} 
           //onLoad={onLoad} 
           //onReady={() => onReadyEditor() } 
           />

         </div>
   }
   
      </Card>
    </Layout>
  )
}
export default NotificationDtl;

function setSelectSmall(arg0: { [x: string]: any; }) {
  throw new Error('Function not implemented.');
}

