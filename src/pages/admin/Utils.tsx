import { Button, Card, Checkbox, Col, Divider, Form, Input, Layout, Modal, Row, Table, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { ColumnsType  } from 'antd/es/table';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import UtilForm from '../../components/admin/UtilForm';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IUtil } from '../../models/admin/IUtil';
import AsyncSelect from 'react-select/async';
import { axiosFn } from '../../axios/axios';
import { SearchPagination, SelectOption } from '../../models/ISearch';
import { searchFormWhereBuild } from '../../utils/formManipulation';
import FilterOutlined from '@ant-design/icons/lib/icons/FilterOutlined';

const SORT_DEFAULT = 'name asc'
const LIMIT_DEFAULT = '10'
const WHERE_DEFAULT = ' active = 1 '


const Utils:FC = () => {
  const { t } = useTranslation();
  const searchP = {
    _limit: LIMIT_DEFAULT,
    _page: '1',
    _offset: SORT_DEFAULT 
  } as SearchPagination
  const [modalVisible, setModalVisible] = useState(false)
  const {error, isLoading, utils,filters,utilsCount } = useTypedSelector(state => state.admin)
  const {selectSmall } = useTypedSelector(state => state.cache)
  const {fetchUtils, setSelectSmall} = useAction()

  const [typeSelect, setTypeSelect] = useState('')
  function  SubmitUtil(util:IUtil) {
    if(!error) {
       setModalVisible(false)
       fetchUtils(searchP, where)
       setSelectedId('')
    }
  }

  useEffect(() => {
    fetchUtils(searchP, where)
      
  }, [])

  useEffect(() => {
   console.log('error', error);
  }, [error])

  useEffect( () => {
    setPagination({...pagination, total: utilsCount})
    }, [utilsCount]
  )

  const [pagination, setPagination] = useState({ current: +searchP._page, pageSize: +searchP._limit, total: utilsCount} as TablePaginationConfig )
  const [where, setWhere] = useState(WHERE_DEFAULT as string )
  const [filter, setFilter] = useState({ } as Record<string, FilterValue | null> )
  const [selectedId, setSelectedId] = useState('')
  const [form] = Form.useForm()
  const [viewForm, setViewForm] = useState(true )
  const goToObject = (event:any, id:string) => {
    event.stopPropagation()
    setModalVisible(true)
    setSelectedId(id)
  }
  const columns: ColumnsType<IUtil> = [
    {
      key: 'name',
      title: t('name'),
      dataIndex: 'name',
      sorter: true,
      render: (name, record, index) => {
        return (
          <a onClick={(event) => goToObject(event, record.id  ) }>
            {name} 
          </a>
        );}
    
    },
    {
      key: 'type',
      title: t('type'),
      dataIndex: 'type',
      sorter: true,
      // filters: filters
    },
    {
      key: 'code',
      title: t('code'),
      dataIndex: 'code',
      sorter: true,
    },
    {
      key: 'id',
      title: t('id'),
      dataIndex: 'id',
      sorter: true,
    }
  ]

  const handleTableChange = (pagination: TablePaginationConfig, filter: Record<string, FilterValue | null>, sorter: SorterResult<any> | SorterResult<any>[]   ) => {  
    setPagination({...pagination, total: utilsCount})
    setFilter(filter)
    let page = pagination.current?.toString() || '1'
    let sorter_ = JSON.parse(JSON.stringify(sorter))
    let pageSize = pagination.pageSize || LIMIT_DEFAULT
    let _offset = 
    sorter_.field ?
    sorter_.field + ' ' + (sorter_.order ? sorter_.order === 'descend' ? ' DESC' : ' ASC' : ' ASC')
    : SORT_DEFAULT
    
    console.log('_offset',_offset);
    fetchUtils({...searchP, _page: page, _offset: _offset, _limit: pageSize.toString() } , where) 
  }
  const openCloseModal = (value:boolean) => {
    if(!value)  setSelectedId('')
    setModalVisible(value)
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
    const fastSearchArray = ['type', 'name']
    const onFinish = async (values: any) => { 
      console.log('Success:', values);
      let where_ = searchFormWhereBuild(values, fastSearchArray)
      console.log(where_);
      fetchUtils({...searchP } , where_)
      setWhere(where_)
      
    }
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    }
    const buildTitle = () =>
    {
        return (
          <h1 style={{padding:'10px'}}>{   t('search')} { t('utils')}</h1>
        )
    }
  return (
    <Layout style={{height:"100vh"}}>
       <Card style={{background:'#fafafa', border:'solid 1px lightgray', marginTop:'10px'}}>
      {error && 
      <h1 className='ErrorH1'>{error}</h1>
      }
       <Form
       // layout="vertical"
       form={form}
       name="basic"
       // labelCol={{ span: 8 }}
       // wrapperCol={{ span: 30 }}
       initialValues={{active: true}}
       onFinish={onFinish}
       onFinishFailed={onFinishFailed}
       autoComplete="off" 
       > 
        <Row>
        <div style={{display:'flex', justifyContent:'start'}}>
        <Col  xs={12} xl={24}>
        
         {buildTitle()}
         </Col>
         <Col  xs={12} xl={24}>
         <Button type="primary" htmlType="submit" loading={isLoading}
         >
         { t('search') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button type="primary" htmlType="button" 
         onClick={() => form.resetFields() }
         >
         { t('clear') }
         </Button>&nbsp;&nbsp;&nbsp;
         <Button  style={{ background: "orange", borderColor: "white" }}
          onClick={() => openCloseModal(true)  }
          >{t('add_new')}</Button>&nbsp;&nbsp;&nbsp;
          {viewForm ? 
         <FilterOutlined style={{color:'gray', fontSize: '24px'}}
         onClick={() => setViewForm(false)}
         />  :
          <FilterOutlined 
          onClick={() => setViewForm(true)}
          style={{color:'green', fontSize: '24px'}}  
          rotate={180} />  
        } 
        
         </Col>
         </div>
        </Row>
        {viewForm &&
        <>
       
        <Row  >
           <Col xs={24} xl={8}  >
           <Form.Item
           // label={ t('name') }
           name="name" 
           style={{ padding:'5px'}} > 
           <Input 
             style={{ height:'38px', width: 'maxContent'}}
             placeholder={ t('name') }
           />
           </Form.Item>
           </Col>
           <Col  xs={24} xl={8}>
           <Form.Item 
           // label={ t('type') }
           name="type"
           style={{ padding:'5px', width: 'maxContent'}} > 
           <AsyncSelect 
            menuPosition="fixed"
           isMulti={true}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('type') }
           cacheOptions 
           autoFocus
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'type',  'distinct type as label, type as value , type as code', 'utils', '', false )} 
           onChange={(selectChange:any) => selectChanged(selectChange, 'type')}
           />
           </Form.Item>
           </Col>
           <Col xs={24} xl={8}  >
           <Form.Item
           label={ t('active') }
           name="active" 
           style={{ padding:'5px'}} 
           valuePropName="checked"
           > 
           <Checkbox 
             style={{ height:'38px', width: 'maxContent'}}
             defaultChecked={true}
           />
           </Form.Item>
           </Col>
     </Row>
     </>
      }
       </Form>
     
      <Row justify="center" align="middle" >
      <Table<IUtil> 
      rowClassName={(record) => record.active === 1 ? 'table-row-light' :  'table-row-dark'}
      columns={columns} 
      dataSource={utils} 
      loading={isLoading}
      rowKey="id"
      bordered
      pagination={pagination}
      onChange={handleTableChange}
      title={() => <h3>{t('utils')}</h3> }
      footer={() => t('total_count') + ' ' + utilsCount}
      style={{width: '100%', padding: '5px'}}
      // scroll={{ x: 1500, y: 700 }}
      />
      </Row>
      <Row justify="center" align="middle" >
       <Modal
       title={t('add_new')}
       footer={null}
       onCancel={() => openCloseModal(false) }
       visible={modalVisible}
       >
         <Card>
           <UtilForm
           submit={util => SubmitUtil(util) }
           utils={utils}
           modalVisible={modalVisible}
           selectedId={selectedId}
           clearSelectedId={() => setSelectedId('') }
           />
         </Card>
       </Modal>
      </Row>
      </Card>
    </Layout>
  )
}



export default Utils;

