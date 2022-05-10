import {Form, Input, Checkbox, Button, Tabs, Table}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { UnorderedListOutlined, LayoutOutlined, ApiOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import { validators } from '../../utils/validators';
import { IUtil } from '../../models/admin/IUtil';
import { useAction } from '../../hooks/useAction';
import TextArea from 'rc-textarea';
import { TabsPosition } from 'antd/lib/tabs';
import AsyncSelect from 'react-select/async';
import { SelectOption } from '../../models/ISearch';
import { axiosFn } from '../../axios/axios';
import { saveFormBuild, saveFormBuildMulti, uTd } from '../../utils/formManipulation';
import { ColumnsType } from 'antd/lib/table';
const { TabPane } = Tabs;
interface UtilFormProps {
  utils: IUtil[],
  submit: (event: IUtil) => void,
  clearSelectedId: () => void,
  modalVisible: boolean,
  selectedId: string
}

const UtilForm: FC<UtilFormProps> = (props) => {
  const { t } = useTranslation();      
  const { user } = useTypedSelector(state => state.auth)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const {error, isLoading  } = useTypedSelector(state => state.admin)
  const [form] = Form.useForm()
  useEffect(() => {
    console.log('props.modalVisible',props.modalVisible );
    form.resetFields()
  },[props.modalVisible])



  const { createUtil, setSelectSmall} = useAction()
  const [util, setUtil] = useState({
    name:'',
    id:'',
    type:'',
    code:'',
    active: 1,
    children: [] 
  } as IUtil)
  const [activeTabKey, setActiveTabKey] = useState('detail');
  useEffect(() => {
    setDisableButton(false)
  form.resetFields()
  let util = {} as IUtil
  if(props.selectedId) {
     let selectedObj = props.utils.find(u=>u.id===props.selectedId)
     if(selectedObj)
     {
      util = selectedObj
     }
     setUtil(util)
     form.setFieldsValue(util)
     setActiveTabKey('detail')
  }
  }
    ,[props])
  const [disableButton, setDisableButton] = useState(false)
  const [tabPosition, setTabPosition] = useState('top' as TabsPosition )
  const SelectStyles = {
    container: (provided: any) => ({
      ...provided,
      width: '100%',
      opacity: '1 !important',
      zIndex:1000
    })
  };
  const initSelectValues:any = {
  }
  const [selectValues , setSelectValues] = useState(initSelectValues) 
  const onFinish = async (values: any) => {
    setDisableButton(true)
    console.log('Success:', values);
    console.log('Util:', util);
    let valuesMulti =  saveFormBuildMulti({...values},{...util});
    values.active = values.active ? 1 : 0
    values.code = values.code || ''
    if(util.id) {
      values.id = util.id
    }
    form.resetFields()
    setUtil({
      name:'',
      id:'',
      type:'',
      code:'',
      active: 1
    } as IUtil)
    createUtil(values, valuesMulti)
    props.submit(values)
  
  
  };
  
  const onFinishFailed = (errorInfo: any) => {
    setDisableButton(false)
    console.log('Failed:', errorInfo);
  };
  const initSelectOptions:any = {
  }
  const [selectOptions , setSelectOptions] = useState(initSelectOptions)

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
          where = " (" + where + ") and name + ':' +  isnull(type, '') like N'%" + inputValue + "%' "
        }

        let exist_children =  form.getFieldValue('children')
        let exist_children_ids = ""
        if(exist_children.length>0) {
          exist_children.map((c: { value: string; })=>{
            exist_children_ids += "'"+c.value+"',"
          })
         exist_children_ids =  " AND id not in (" + exist_children_ids.slice(0, -1) + ") "
          
        }
       console.log(exist_children_ids);
       
        const response = await  axiosFn("get", '', what, tname, where  , ''  )  
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

  const tabChangeFunction = async (key:any) => {
    if(key==='detail')
    {
      setActiveTabKey('detail')
    }
    if(key==='log')
    {
      setActiveTabKey('log')
      const response = await  axiosFn("get", '', "util as value,  name + ':' +  isnull(type, '') as label, id as code ", 'V_util_parent', "parent = '" + util.id + "'", '' )  
      let hasError = false;
      if(response.data["error"]) hasError = true;
      setUtil({...util, children: response.data })
      form.setFieldsValue({children: response.data})
    }
  }
  const childrenColumns: ColumnsType<any> = [
    {
      key: 'label',
      title: t('name'),
      dataIndex: 'label',
      sorter: true,
      render: (name, record, index) => {
        return (record.label.split(":")[0] 
        );}
    },
    {
      key: 'code',
      title: t('type'),
      dataIndex: 'code',
      sorter: true,
      render: (name, record, index) => {
        return (record.label.split(":")[1] 
        );}
    }
  ]
    return (
      <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 30 }}
      initialValues={{active: 1}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
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
     
      {error && <div style={{color: 'red'}}>
        {error}
        </div>}
      <Form.Item
        label={ t('name') }
        name="name"
        rules={[validators.required()]}
        
      >
        <Input
        // prefix={<UserOutlined />}
        value={util.name} 
        />
      </Form.Item>

      <Form.Item
        label={ t('type') }
        name="type"
        rules={[validators.required()]}
      >
        <Input 
        value={util.type} 
        // prefix={<UnlockOutlined />}
        />
      </Form.Item>

      <Form.Item
        label={ t('code') }
        name="code"
        rules={[]}
      >
        <TextArea 
        rows={5}
        style={{width:'100%'}}
        value={util.code}
        // prefix={<UnlockOutlined />}
        />
      </Form.Item>

      <Form.Item
        label={ t('id') }
        name="id"
        rules={[]}
      >
        <Input 
        disabled={true}
        value={util.id}
        // prefix={<UnlockOutlined />}
        />
      </Form.Item>

      <Form.Item name="active" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox
         value={util.active ? true : false}
        >{t('active_object')}</Checkbox>
      </Form.Item>

      
    
      </TabPane> 
      { props.selectedId !== '' && 
      <TabPane tab={
        <span> 
        <UnorderedListOutlined /> 
        {t('children')} 
        </span>
      } 
      key="log" forceRender={true}
      
      >
      
         <Form.Item 
         label={ t('children') }
         name="children"
         style={{ padding:'5px', width: 'maxContent'}} 
         //  rules={[validators.required()]}
         > 
         <AsyncSelect 
         menuPosition="absolute"
         isDisabled={false}
         isMulti={true}
         styles={SelectStyles}
         isClearable={true}
         placeholder={ t('children') }
         cacheOptions 
         defaultOptions
         loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'children',  " top 20 name + ':' +  isnull(type, '') as label, id as value , id as code ", 'utils', " active = 1 and id not in('"+util.id+"')", true )} 
         onChange={(selectChange:any) => selectChanged(selectChange, 'children')}
         />
         </Form.Item>
         <Table
        columns={childrenColumns} 
        dataSource={util.children} 
        title={() => <h3><ApiOutlined />{t('children')}</h3> } 
        >
       </Table>
       
    </TabPane>
      } 
      
  </Tabs> 
  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isLoading}
        disabled={disableButton}
        >
        { t('submit') } {disableButton}
        </Button>
      </Form.Item>
      </Form>
    
    
    )
  }
  
  
  export default UtilForm;