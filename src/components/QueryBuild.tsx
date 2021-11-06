import {Form, Input, Button, Select, DatePicker,TimePicker, Row}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useAction } from '../hooks/useAction';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { IEvent } from '../models/IEvent';
import { IUser } from '../models/IUser';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { validators } from '../utils/validators';
import { HOME_FOLDER, IQuery, NEW_SIDER_FOLDER, SIDER_NO_FOLDER } from '../models/ISearch';
import { axiosFn } from '../axios/axios';
import {UserOutlined} from '@ant-design/icons';

interface QueryBuildProps {
  where: string,
  //submit: (event: IEvent) => void,
  factory: string
}
const { Option } = Select;
const QueryBuild: FC<QueryBuildProps> = (props) => {

  const {error, isLoading } = useTypedSelector(state => state.event)
  const {setAlert} = useAction()
  const {user } = useTypedSelector(state => state.auth)
  const [new_query_name, setNew_query_name] = useState('')
  const [new_sider_folder, setNew_sider_folder] = useState('')
  const [new_query_view, setNew_query_view] = useState(false)
  const [folder, setFolder] = useState('')
  const { t } = useTranslation();

  const create_query = async () => {

      let  hasError = false   
      let query_ = {} as IQuery
      if(folder.trim()===NEW_SIDER_FOLDER)
      {
        let folder_query_ = {} as IQuery
        folder_query_ = {...folder_query_,
          name:new_sider_folder,	
          object:user.id, 
          factory:'folder', 
          query: '', 
          folder: '',
          seq: 1 }
          const responseNewFolder = await axiosFn("post", folder_query_, '*', 'queries', "id" , ''  )  
          if(responseNewFolder.data["error"]) hasError = true;
          if(responseNewFolder.data&&!hasError)
          {
            let new_id: string = responseNewFolder.data[0].id
            query_ = {...query_,
              name:new_query_name,	
              object:user.id, 
              factory:props.factory, 
              query: props.where, 
              folder: new_id,
              seq: 1 }
              const responseNew = await axiosFn("post", query_, '*', 'queries', "id" , ''  )  
              if(responseNew.data["error"]) hasError = true;
              if(responseNew.data&&!hasError)
              {
                let new_id: string = responseNew.data[0].id
              }
          }
      }
      else {
          query_ = {...query_,
          name:new_query_name,	
          object:user.id, 
          factory:props.factory, 
          query: props.where, 
          folder: folder,
          seq: 1 }
          const responseNew = await axiosFn("post", query_, '*', 'queries', "id" , ''  )  
          if(responseNew.data["error"]) hasError = true;
          if(responseNew.data&&!hasError)
          {
            let new_id: string = responseNew.data[0].id
          }
      }
    if(!hasError) {
      setNew_query_view(false)
      setNew_query_name('')
      setAlert({
        type: 'success' ,
        message: t('created_success'),
        closable: true ,
        showIcon: true ,
        visible: true,
        autoClose: 10 
      })
    }   
}
const [folders, setFolders] = useState([] as IQuery[])

 const getFolders = async () => {
  let result_query = await axiosFn("get", '', '*', 'queries', " object='"+user.id+"' AND factory = 'folder' order by name " , '' )  
  let result_query_Arr:IQuery[] =  result_query?.data 
  if(result_query_Arr) setFolders(result_query_Arr)
 }

 useEffect(() => {
  getFolders()
 }, [])

  function handleSelectChange(value:string) {
    setFolder(value)
  }
    return (
      <div>
      {
        new_query_view ? 
        <>
          &nbsp;&nbsp;&nbsp;<Button  
          disabled={(new_query_name.trim().length===0||folder.trim().length===0) 
          ||(folder.trim()===NEW_SIDER_FOLDER&&new_sider_folder.trim().length===0)
          }
          style={{ background: "#01a77c", borderColor: "white" }}
          onClick={() => create_query()  }
          >{t('save')}</Button>
          
          &nbsp;&nbsp;&nbsp;<Button  style={{ background: "#01a77c", borderColor: "white" }}
            onClick={() => { setNew_query_view(false); setNew_query_name('') }  }
            >{t('cancel')}</Button>  
            &nbsp;&nbsp;&nbsp;<Input 
            style={{ height:'38px', width: '200px'}}
            placeholder={ t('query_name') }
            value={new_query_name}
            onChange={(event) => setNew_query_name(event.target.value ) }
          />&nbsp;&nbsp;&nbsp;
          <Select onChange={handleSelectChange}
          size="large"
          style={{height:38, width: 200}}
          placeholder={ t('folder_name')}
          // <FolderOutlined />
          >
          <Option key="home" value={HOME_FOLDER}>{t('home')}</Option>
          <Option key="noFolder" value={SIDER_NO_FOLDER}>{t('sider_no_folder')}</Option>
          <Option key="new_sider_folder" value={NEW_SIDER_FOLDER}>{t('new_sider_folder')}</Option>
          <Option disabled={true} key="---------" value="----------"><UserOutlined />&nbsp;&nbsp;&nbsp;{t('private_sider_folders')}</Option>
          {
            folders.map(m=> (
              <Option key={m.id} value={m.id}>{m.name}</Option>
            ))
          }
          </Select>&nbsp;&nbsp;&nbsp;
          {
            folder === NEW_SIDER_FOLDER &&
            <Input 
            style={{ height:'38px', width: '200px'}}
            placeholder={ t('new_sider_folder') }
            value={new_sider_folder}
            onChange={(event) => setNew_sider_folder(event.target.value ) }
            />
          }
          </>
         
        :
        <>
          &nbsp;&nbsp;&nbsp;<Button  style={{ background: "#01a77c", borderColor: "white" }}
            onClick={() => setNew_query_view(true)  }
            >{t('create_query')}</Button>
          
      </>  
      }
      </div>
    )
  }
  export default QueryBuild;