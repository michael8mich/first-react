import { Button, Card, Checkbox, Col, Collapse, Descriptions, List, Form, Input, Layout, Modal, Radio, Row, Select, Space, Spin, Table, TablePaginationConfig, Tabs, Tooltip, Popconfirm, Badge} from 'antd';
import { UpOutlined, DownOutlined, LeftOutlined, RightOutlined, FolderViewOutlined, DeleteOutlined } from '@ant-design/icons';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../hooks/useAction';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../../axios/axios';
import {  SelectOption } from '../../../models/ISearch';
import { saveFormBuild, saveFormBuildMulti, uTd } from '../../../utils/formManipulation';
import {  ASSIGNEE_LIST, GROUP_LIST, NOT_GROUP_LIST } from '../../../models/IUser';
import { Link, NavLink, useHistory, useParams } from 'react-router-dom';
import { Params } from '../../../models/IParams';
import { validators } from '../../../utils/validators';
import classes from './TCategoryDtl.module.css'
import { ITicketLog, ITicketObjects, ITicketObjectsMulti, ITicketPrpTpl, ITicketRoFields, ITicketWfTpl, PRIORITY_LOW, STATUS_CREATED, TICKET_INCIDENT, TICKET_REQUEST, URGENCY_LOW } from '../../../models/ITicket';
import { ColumnsType } from 'antd/lib/table';
import { TabsPosition } from 'antd/lib/tabs';
import { RouteNames } from '../../../router';
import UserAddOutlined from '@ant-design/icons/lib/icons/UserAddOutlined';
import Avatar from 'antd/lib/avatar/avatar';
import { getScrollTop } from 'react-select/dist/declarations/src/utils';
import PropertyDtl from './PropertyDtl';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import WfDtl from './WfDtl';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;
const TCategoryDtl:FC = () => {
  const { t } = useTranslation();
  const {fetchCategory, createCategory, fetchProperties, createProperty, setSelectedProperty, setSelectedWf ,fetchWfs} = useAction()
  const {error, isLoading, tickets, selectedCategory, properties, selectedProperty, wfs } = useTypedSelector(state => state.ticket)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const {user } = useTypedSelector(state => state.auth)
  const { Option } = Select;
  const { TextArea } = Input;


  const [userCurrentLoaded] = useState(selectedCategory)
  const [form] = Form.useForm()
  const [ro, setRo] = useState(true)

  const {id} = useParams<Params>()

  function getCategory() {
      fetchCategory(id) 
  }
  function setFormValues() {
    if(id!=='0') {
      let curTicket:any = selectedCategory
      const currUserFields= Object.keys(curTicket)
      const  formFields = Object.keys((form.getFieldsValue()))
      const form_set_values = {} as any
      formFields.map(ff => {
        form_set_values[ff] = curTicket[ff]
      })
      form.setFieldsValue(form_set_values);
    }
  }
  const router = useHistory()
  useEffect(() => {
    if(id==='0')  {
      setRo(false)
      //CleanSelectedTicket()
    } else 
    getCategory()
   }, [])

   useEffect(() => {
    if(id!=='0')
    setFormValues()
   }, [selectedCategory])

  useEffect(() => {
   console.log('error', error);
  }, [error])

  useEffect( () => {
     if(id==='0') {
      if(Object.keys(selectedCategory).find( k=> k === 'id'))
      {
        if(!Object.keys(selectedCategory).find( k=> k === 'name'))
        {
          fetchCategory(selectedCategory.id)
          router.push(RouteNames.TCATEGORIES + '/' + selectedCategory.id )
        }
      }
     }
   }, [selectedCategory?.id])



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
      const values_ = {...values, }
      ITicketRoFields.map(r => {
        delete values_[r]
      })
      let valuesMulti =  saveFormBuildMulti({...values_},{...selectedCategory});
      saveFormBuild(values_)
      createCategory({...values_, id}, valuesMulti, user.id)
      getCategory()
      setRo(true)
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }

    const cancelUpdate = () => {
      if(id==='0') {
        router.push(RouteNames.TCATEGORIES)
      } else {
        setRo(true) 
        getCategory()
      }

    }

    const buildTitle = () =>
    {
        return (
          id === '0'? 
          <h1 style={{padding:'10px'}}>{ !ro && t('create_new') } { t('tcategory')}  </h1>:
          <h1 style={{padding:'10px'}}>{ ! ro && t('update') } { t('tcategory')}   { selectedCategory?.name }</h1>
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
    const tabChangeFunction = (key:any) => {
      if(key==='properties')
      {
        fetchProperties(selectedCategory.id)
      }
      if(key==='wfs')
      {
        fetchWfs(selectedCategory.id)
      }
      console.log(key);
    }
  const edit = (event:any) => {
    event.preventDefault()
    setRo(false)
  }  
  const localeteArr = [{'label': t('english') , 'value': 'enUS', 'code': 'enUS'},{'label': t('hebrew'), 'value': 'heIL', 'code': 'heIL'}]
  const defaultOnNew = {
  active: 1,
  ticket_type: TICKET_REQUEST,
  priority: PRIORITY_LOW,
  urgency: URGENCY_LOW,
  ticket_types: [TICKET_REQUEST, TICKET_INCIDENT]
  }
  

 
  const goTo = (route:string, id:string) =>
  {
 
    router.push(route + '/' + id,  )
    fetchCategory(id)
    //router.replace('/', route + '/' + id)
    //window.location.reload();
  }

  const propertyColumns: ColumnsType<ITicketPrpTpl> = [
    {
      key: 'name',
      title: t('action'),
      dataIndex: 'name',
      sorter: (a:any, b:any) =>  a.name.localeCompare(b.name),
      width: '10%',
    },
    {
      key: 'factory',
      title: t('factory'),

      sorter: (a:any, b:any) =>  a.factory.localeCompare(b.factory),
      width: '10%',
      render: ( record) => {
            return (
                <>        
                {record.factory?.label} 
                </>
            );}
    },
    {
      key: 'sequence',
      title: t('sequence'),
      dataIndex: 'sequence',
      sorter: (a:any, b:any) =>  a.sequence - b.sequence,
      width: '10%',
    },
    // {
    //   key: 'width',
    //   title: t('width'),
    //   sorter: (a:any, b:any) =>  a.width - b.width,  
    //   render: ( record) => {
    //     return (
    //         <>        
    //         {record.width} 
    //         </>
    //     );}
    // },
    // {
    //   key: 'last_mod_by',
    //   title: t('last_mod_by'),
    //   sorter: (a:any, b:any) =>  a.last_mod_by_name.localeCompare(b.last_mod_by_name),
    //   width: '10%',
    //   render: ( record) => {
    //     return (
    //         <>        
    //         {record.last_mod_by_name && record.last_mod_by_name} 
    //         </>
    //     );}
    // }
    {
      key: 'pattern',
      title: t('pattern'),
      dataIndex: 'pattern',
      sorter: (a:any, b:any) =>  a.pattern.localeCompare(b.pattern),
      width: '10%',
    },
    {
      key: 'default',
      title: t('default'),
      dataIndex: 'default',
      sorter: (a:any, b:any) =>  a.default.localeCompare(b.default),
      width: '10%',
    },
    {
      key: 'placeholder',
      title: t('placeholder'),
      dataIndex: 'placeholder',
      sorter: (a:any, b:any) =>  a.placeholder.localeCompare(b.placeholder),
      width: '10%',
    },
    {
      key: 'action',
      title: t('actions'),
      width: '10%',
      render: (record, index) => {
        return (
          <>
         <FolderViewOutlined key="view" 
          onClick={() => selectProperty(record, true)}
         />&nbsp;&nbsp;
         <EditOutlined key="edit"
         onClick={() => selectProperty(record, false)}
         />&nbsp;&nbsp;
         <Tooltip title={t('delete')} key="delete">
            <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteProperty(record.id)}>
                          <DeleteOutlined 
                          ></DeleteOutlined>
            </Popconfirm>              
         </Tooltip>
         </>
        )}
    }
  ]
  const [viewProperty, setViewProperty] = useState(false)
  const [roProperty, setRoProperty] = useState(false)
  
  const addNewProperties = () => {
    setViewProperty(true)
    setSelectedProperty({} as ITicketPrpTpl)
    setRoProperty(false)
  }
  const deleteProperty = async (id:string) => {
    let result_query = await axiosFn("delete", '', '*', 'tprptpl', "id" , id )
    fetchProperties(selectedCategory.id)
  }
  const selectProperty = (record:ITicketPrpTpl, ro:boolean) => {
    setSelectedProperty(record)
    setViewProperty(true)
    setRoProperty(ro)

  }
  //------- wfs
  const wfColumns: ColumnsType<ITicketWfTpl> = [
    {
      key: 'name',
      title: t('action'),
      dataIndex: 'name',
      sorter: (a:any, b:any) =>  a.name.localeCompare(b.name),
      width: '10%',
    },
    {
      key: 'task',
      title: t('task'),

      sorter: (a:any, b:any) =>  a.task.localeCompare(b.task),
      width: '10%',
      render: ( record) => {
            return (
                <>        
                {record.task?.label} 
                </>
            );}
    },
    {
      key: 'sequence',
      title: t('sequence'),
      dataIndex: 'sequence',
      sorter: (a:any, b:any) =>  a.sequence - b.sequence,
      width: '10%',
    },

    {
      key: 'team',
      title: t('team'),
      sorter: (a:any, b:any) =>  a.team?.label.localeCompare(b.team?.label),
      width: '10%',
      render: ( record) => {
        return (
            <>        
            {record.team?.label && record.team?.label} 
            </>
        );}
    },
    {
      key: 'assignee',
      title: t('assignee'),
      sorter: (a:any, b:any) =>  a.assignee?.label.localeCompare(b.assignee?.label),
      width: '10%',
      render: ( record) => {
        return (
            <>        
            {record.assignee?.label && record.assignee?.label} 
            </>
        );}
    },
  
    {
      key: 'action',
      title: t('actions'),
      width: '10%',
      render: (record, index) => {
        return (
          <>
         <FolderViewOutlined key="view" 
          onClick={() => selectWf(record, true)}
         />&nbsp;&nbsp;
         <EditOutlined key="edit"
         onClick={() => selectWf(record, false)}
         />&nbsp;&nbsp;
         <Tooltip title={t('delete')} key="delete">
            <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteWf(record.id)}>
                          <DeleteOutlined 
                          ></DeleteOutlined>
            </Popconfirm>              
         </Tooltip>
         </>
        )}
    }
  ]
  const [viewWf, setViewWf] = useState(false)
  const [roWf, setRoWf] = useState(false)
  
  const addNewWfs = () => { 
    setViewWf(true)
    setSelectedWf({} as ITicketWfTpl)
    setRoWf(false)
  }
  const deleteWf = async (id:string) => {
    let result_query = await axiosFn("delete", '', '*', 'wftpl', "id" , id )
    fetchWfs(selectedCategory.id)
  }
  const selectWf = (record:ITicketWfTpl, ro:boolean) => {
    setSelectedWf(record)
    setViewWf(true)
    setRoWf(ro)

  }


  return (
  <Layout style={{height:"100vh"}}>
      {error && 
     <h1 className='ErrorH1'>{error}</h1>
      }
      {isLoading && 
       <Spin style={{padding:'20px'}} size="large" />
      }

       <Card  >
       
       {buildTitle()}
        <Tabs onChange={tabChangeFunction} type="card" tabPosition={tabPosition }>
        <TabPane tab={t('detail')} key="detail" >
        <div>
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
        <Col  xs={24} xl={12}>
        {ro 
        ?     
        <div style={{display:'flex', justifyContent:'start'}}>
         <Button type="primary" htmlType="button" 
          onClick={(event) => edit(event)  }
         >
         { t('edit') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="button" 
         onClick={() => getCategory() }
         >
         { t('refresh') }
         </Button>&nbsp;&nbsp;&nbsp;
         </div> 
         :
         <div style={{display:'flex', justifyContent:'start'}}>
         <Button type="primary" htmlType="submit" 
         disabled={isLoading}
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
        <Col xl={8}  lg={12} sm={12} xs={24}  >
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
        <Col xl={6}  lg={6} sm={12} xs={24}>
           <Form.Item 
           key="ticket_type"
           label={ t('ticket_type') }
           name="ticket_types"
           style={{ padding:'5px', width: 'maxContent'}} 
           rules={[validators.required()]}
           > 
           <AsyncSelect 
           menuPosition="fixed"
           className={classes.selectClass}
           isDisabled={ro}
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('ticket_type') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ticket_types',  ' top 20 name as label, id as value , id as code ', 'utils', " type = 'ticket_type'", false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'ticket_types')}
           />
           </Form.Item>
        </Col>
        <Col xl={6}  lg={6} sm={12} xs={24} >
           <Form.Item 
           key="template"
           label={ t('ticket') + ' ' + t('template') }
           name="ticket"
           style={{ padding:'5px', width: 'maxContent'}} 
           > 
           <AsyncSelect 
           menuPosition="fixed"
           isDisabled={ro}
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('ticket') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'ticket',  ' top 20 name as label, id as value , id as code ', 'V_tickets', "name<>'' order by create_date desc" , true )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'ticket')}
           />
           </Form.Item>
        </Col>
        </Row>   
        <Row  >
        <Col xl={4}  lg={8} sm={12} xs={24} onClick={
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
        <Col xl={4}  lg={8} sm={12} xs={24} onClick={
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
        <Col xl={4}  lg={8} sm={12} xs={24}>
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
        <Col xl={4}  lg={8} sm={12} xs={24}>
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
        {
          id && id!=='0' &&
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
             value={selectedCategory.last_mod_by && selectedCategory.last_mod_by.label}
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
             value={ uTd(selectedCategory.last_mod_dt)}
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
             value={uTd(selectedCategory.create_date)}
           />
           </Form.Item>
           </Col>
           </Row> 
    
        }
        </Form>
        </div>
        </TabPane>
        
            <TabPane 
            tab={<Badge 
            size="small"
            count={properties?.length}
            offset={[-10,-5]}
            > 
            {t('properties')}
            </Badge>} 
            
            key="properties" forceRender={true} 
           
            >
            
              {
                !viewProperty &&
                <Button
                  onClick={addNewProperties}
                  > {t('add_new', { object: t('property') })}
                </Button>
              }
              {
                viewProperty &&
                <PropertyDtl 
                save={() => setViewProperty(false) }
                cancel={() => setViewProperty(false) }
                ro={roProperty}
                lastSequence={(+properties[properties?.length-1]?.sequence+10).toString()}
                />
              }
              <Table<ITicketPrpTpl>
                scroll={{ x: 1200, y: 700 }}
                columns={propertyColumns} 
                dataSource={properties} 
                rowKey={record => record.id}
                >
                </Table>    
            </TabPane>
       
       <TabPane 
       tab={<Badge 
        size="small"
        count={wfs?.length}
        offset={[-10,-5]}
        > 
        {t('wfs')}
        </Badge>} 
       
       key="wfs" forceRender={true} >
         {
           !viewWf &&
           <Button
             onClick={addNewWfs}
             > {t('add_new',  { object: t('wf') })}
           </Button>
        }
        {
           viewWf &&
           <WfDtl 
           save={() => setViewWf(false) }
           cancel={() => setViewWf(false) }
           ro={roWf}
           lastSequence={(+wfs[wfs?.length-1]?.sequence+10).toString()}
           />
         }
        <Table<ITicketWfTpl>
          scroll={{ x: 1200, y: 700 }}
          columns={wfColumns} 
          dataSource={wfs} 
          rowKey={record => record.id}
          >
          </Table>    
       </TabPane>
    </Tabs>  
      </Card>     
  </Layout>
  )
}
export default TCategoryDtl;

