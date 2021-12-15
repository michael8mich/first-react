import { Avatar, Button, Card, Checkbox, Col, DatePicker, Divider, Form, Input, Layout, Menu, Modal, Radio, Row, Select, Space, Spin, Table, TablePaginationConfig, Tabs} from 'antd';
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined,
  UnorderedListOutlined, LayoutOutlined } from '@ant-design/icons';
import  {FC, useEffect, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../axios/axios';
import {  SelectOption } from '../../models/ISearch';
import { DATETIMEFORMAT, saveFormBuild, saveFormBuildMulti, uTd } from '../../utils/formManipulation';
import {  ICiRoFields, ICi, ICiLog} from '../../models/ICi';
import { useHistory, useParams } from 'react-router-dom';
import { Params } from '../../models/IParams';
import { validators } from '../../utils/validators';
import classes from './CiDtl.module.css'
import { TabsPosition } from 'antd/lib/tabs';
import { DEPARTMENT_LIST, LOCATION_LIST, ORGANIZATION_LIST, SITE_LIST } from '../../models/IOrg';
import { stubTrue } from 'lodash';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import QueriesTree from '../../components/QueriesTree';
import { NOT_GROUP_LIST } from '../../models/IUser';
interface RefObject {
  getSiderQueries: () => void
}
const { TabPane } = Tabs;
const CisDtl:FC = () => {
  const { t } = useTranslation();
  const {fetchCi, setSelectSmall, createCi, setAlert, setPathForEmpty, fetchCiLog} = useAction()
  const {error, isLoading, cis, selectedCi } = useTypedSelector(state => state.ci)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const {user } = useTypedSelector(state => state.auth)
  const queriesRef=useRef<RefObject>(null)
  const { Option } = Select;
  const { TextArea } = Input;

  const [ciCurrentLoaded] = useState(selectedCi)
  const [form] = Form.useForm()
  const [ro, setRo] = useState(true)

  const {id} = useParams<Params>()
  
  function getCi() {
    if(id!=='0') {
      fetchCi(id) 
      // if(queriesRef.current)
      // {
      //   queriesRef.current.getSiderQueries()
      // }
    }
      
      else
      setRo(false)
  }
  function setFormValues() {
    if(id!=='0') {
      let curci:any = selectedCi
      //console.log('ci', selectedCi);
      const currciFields= Object.keys(curci)
      const  formFields = Object.keys((form.getFieldsValue()))
      const form_set_values = {} as any
      formFields.map(ff => {
        if(ff.indexOf('_dt')!==-1) 
        {
          if(curci[ff]) {
            
          
            if(Number(curci[ff]))
            form_set_values[ff] =  curci[ff] ?   moment(+curci[ff]*1000) : ''
        }
      }
        else
        form_set_values[ff] = curci[ff] 
      })
      form.setFieldsValue(form_set_values);
    }
  }

  useEffect(() => {
    getCi()
   }, [])

   useEffect(() => {
    setFormValues()
   }, [selectedCi])

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
    const router = useHistory()
    const onFinish = async (values: any) => { 

      values = form.getFieldsValue()
      const values_ = {...values}
      ICiRoFields.map(r => {
        delete values_[r]
      })
      let valuesMulti =  saveFormBuildMulti({...values_},{...selectedCi});
      saveFormBuild(values_)
      createCi({...values_, id},  valuesMulti, user.id, router, setPathForEmpty)
      setAlert({
        type: 'success' ,
        message: t('created_success'),
        closable: true ,
        showIcon: true ,
        visible: true,
        autoClose: 10 
      })
      
      
      getCi()
      setRo(true)
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }

    const cancelUpdate = () => {
      setRo(true) 
      getCi()
    }

    const buildTitle = () =>
    {
        return (
          id === '0'? 
          <h1 style={{padding:'10px'}}>{ !ro && t('create_new') } { t('ci')}  </h1>:
          <h1 style={{padding:'10px'}}>{ ! ro && t('update') } { t('ci')}  { selectedCi.name }</h1>
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
      if(key==='log')
      {
       fetchCiLog(selectedCi)
      }
    }
  const localeteArr = [{'label': t('english') , 'value': 'enUS', 'code': 'enUS'},{'label': t('hebrew'), 'value': 'heIL', 'code': 'heIL'}]
    const [collapsed,  setCollapsed]  = useState(true)
    const ciLogColumns: ColumnsType<ICiLog> = [
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
        // dataIndex: 'old_value',
        sorter: (a:any, b:any) =>  a.old_value.localeCompare(b.old_value),
        width: '35%',
        render: ( record) => {
          return (
              <>        
              {  record.name.indexOf(' date ') != -1 ?  uTd(record.old_value) : record.old_value} 
              </>
          );}
      },
      {
        key: 'new_value',
        title: t('new_value'),
        // dataIndex: 'new_value',
        sorter: (a:any, b:any) =>  a.new_value.localeCompare(b.new_value),
        width: '35%',
        render: ( record) => {
          return (
              <>        
               {  record.name.indexOf(' date ') != -1 ?  uTd(record.new_value) : record.new_value} 
              </>
          );}
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
        <Col  xs={12} xl={24}>
        
        {ro 
        ?     
        <div style={{display:'flex', justifyContent:'start'}}>
         {buildTitle()}
         {/* {buildTabPositins()} */}
         <Button type="primary" 
          onClick={(event) => edit(event)  }
         >
         { t('edit') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="button" 
         onClick={() => getCi() }
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
    <TabPane
    tab={
      <span> 
      <LayoutOutlined />
      {t('detail')} 
      </span>
    }
     key="1" >
        <Row  >
           <Col xs={24} xl={4} sm={12} lg={8} >
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
           <Col  xs={24} xl={4} sm={12} lg={8}>
           <Form.Item
           label={ t('ci_family') }
           name="ci_family" 
           style={{ padding:'5px'}} > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('ci_family') }
           />
           </Form.Item>
           </Col>
           
           <Col  xs={24} xl={4} sm={12} lg={8}>
           <Form.Item 
           label={ t('ci_class') }
           name="ci_class"
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
           placeholder={ t('ci_class') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ci_class',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'ci_class'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'ci_class')}
           />
           </Form.Item>
           </Col>

           <Col  xs={24} xl={4} sm={12} lg={8}>
           <Form.Item 
           label={ t('ci_status') }
           name="ci_status"
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
           placeholder={ t('ci_status') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ci_status',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'ci_status'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'ci_status')}
           />
           </Form.Item>
           </Col>

           <Col  xs={24} xl={4} sm={12} lg={8}>
           <Form.Item 
           label={ t('ci_user') }
           name="ci_user"
           style={{ padding:'5px', width: 'maxContent'}} 
           > 
           <AsyncSelect 
      menuPosition="fixed"
           className={classes.selectClass}
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('ci_user') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ci_user',  ' top 20 name as label, id as value , id as code ', 'V_contacts', NOT_GROUP_LIST , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'ci_user')}
           />
           </Form.Item>
           </Col>

           <Col xs={24} xl={2} sm={2} lg={2}  >
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
           <Col xs={24} xl={4} sm={12} lg={8}>
           <Form.Item 
           label={ t('ci_model') }
           name="ci_model"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('ci_model') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ci_model',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'ci_model'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'ci_model')}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={4} sm={12} lg={8}  >
           <Form.Item
           label={ t('manufacturer') }
           name="manufacturer" 
           style={{ padding:'5px'}} 
          //  rules={[validators.isPhone()]}
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('manufacturer') }
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={4} sm={12} lg={8}  >
           <Form.Item
           label={ t('ip') }
           name="ip" 
           style={{ padding:'5px'}} 
          //  rules={[validators.isPhone()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('ip') }
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={4} sm={12} lg={8}  >
           <Form.Item
           label={ t('serial') }
           name="serial" 
           style={{ padding:'5px'}} 
          //  rules={[validators.isPhone()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('serial') }
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={4} sm={12} lg={8}  >
           <Form.Item
           label={ t('mac') }
           name="mac" 
           style={{ padding:'5px'}} 
          //  rules={[validators.isPhone()]}
           > 
           <Input 
             disabled={ro}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('mac') }
           />
           </Form.Item>
           </Col>
           <Col  xs={24} xl={4} sm={12} lg={8}>
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
        </Row> 
        <Row  >
           <Col xs={24} xl={4} sm={12} lg={8}>
           <Form.Item 
           label={ t('acquire_dt') }
           name="acquire_dt"
           style={{ padding:'5px', width: 'maxContent'}}
           > 
            <DatePicker 
                  format={DATETIMEFORMAT}
                  disabled={ro}
                  placeholder={t('acquire_dt')}
                  showTime={{ format: 'HH:mm' }} 
                  >
                  </DatePicker>
           </Form.Item>
           </Col>
           <Col xs={24} xl={4} sm={12} lg={8}>
           <Form.Item 
           label={ t('install_dt') }
           name="install_dt"
           style={{ padding:'5px', width: 'maxContent'}}
           > 
            <DatePicker 
                  format={DATETIMEFORMAT}
                  disabled={ro}
                  placeholder={t('install_dt')}
                  showTime={{ format: 'HH:mm' }} 
                  >
                  </DatePicker>
           </Form.Item>
           </Col>  
           <Col xs={24} xl={4} sm={12} lg={8}>
           <Form.Item 
           label={ t('expiration_dt') }
           name="expiration_dt"
           style={{ padding:'5px', width: 'expiration_dt'}}
           > 
            <DatePicker 
                  format={DATETIMEFORMAT}
                  disabled={ro}
                  placeholder={t('expiration_dt')}
                  showTime={{ format: 'HH:mm' }} 
                  >
                  </DatePicker>
           </Form.Item>
           </Col>
           <Col xs={24} xl={4} sm={12} lg={8}>
           <Form.Item 
           label={ t('warranty_start_dt') }
           name="warranty_start_dt"
           style={{ padding:'5px', width: 'warranty_start_dt'}}
           > 
            <DatePicker 
                  format={DATETIMEFORMAT}
                  disabled={ro}
                  placeholder={t('warranty_start_dt')}
                  showTime={{ format: 'HH:mm' }} 
                  >
                  </DatePicker>
           </Form.Item>
           </Col>
           <Col xs={24} xl={4} sm={12} lg={8}>
           <Form.Item 
           label={ t('warranty_end_dt') }
           name="warranty_end_dt"
           style={{ padding:'5px', width: 'maxContent'}}
           > 
            <DatePicker 
                  format={DATETIMEFORMAT}
                  disabled={ro}
                  placeholder={t('warranty_end_dt')}
                  showTime={{ format: 'HH:mm' }} 
                  >
                  </DatePicker>
           </Form.Item>
           </Col>
          
        </Row> 
        <Row  >
         <Col xs={24} xl={24}  >
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
           
        </Row>   
        <Row  >
           <Col xs={24} xl={5} sm={5} lg={5}  >
           <Form.Item
           label={ t('last_mod_by') }
           style={{ padding:'5px'}} 
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('last_mod_by') }
             value={selectedCi.last_mod_by && selectedCi.last_mod_by.label}
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
             value={ uTd(selectedCi.last_mod_dt)}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={5} sm={5} lg={5}  >
           <Form.Item
           label={ t('create_date') }
           style={{ padding:'5px'}} 
           rules={[validators.isPhone()]}
           > 
           <Input 
             disabled={true}
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('create_date') }
             value={uTd(selectedCi.create_date)}
           />
           </Form.Item>
           </Col>
           </Row>
    </TabPane>
    <TabPane tab={
      <span> 
      <UnorderedListOutlined /> 
      {t('log')} 
      </span>
    } 
    key="log" forceRender={true} >
      <Table<ICiLog>
        scroll={{ x: 1200, y: 700 }}
        columns={ciLogColumns} 
        dataSource={selectedCi.ci_log} 
        rowKey={record => record.id}
        >
        </Table>  
    </TabPane>  
    </Tabs>   
    </Form>
    </Card>
    
  </Layout>
  )
}



export default CisDtl;

function x(x: any) {
  throw new Error('Function not implemented.');
}

