import React, { forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import { Menu, Button, Tooltip, Popconfirm, Card, Spin, Badge } from 'antd';
import {  FileOutlined
 } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useAction } from '../hooks/useAction';
import { useTranslation } from 'react-i18next';
import { ANALYST_DTP, IUser, NOT_GROUP_LIST } from '../models/IUser';
import { axiosFn } from '../axios/axios';
import { FROM, SELECT } from '../utils/formManipulation';
import { HOME_FOLDER, IQuery, SelectOption, SIDER_NO_FOLDER } from '../models/ISearch';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import AsyncSelect from 'react-select/async';
import {DeleteOutlined} from '@ant-design/icons';

const { SubMenu } = Menu;
interface QueriesTreeProps {
  collapsed: boolean,
  setCollapsed: (collapsed:boolean) => void,
  sider: boolean
  edit: boolean
  user: IUser
}
interface oldNew  {
  old: string
  new: string
}
const QueriesTree = forwardRef((props:QueriesTreeProps, ref) => {
    const { t } = useTranslation();      
    const router = useHistory()
    const { setAlert} = useAction()
    const {selectSmall } = useTypedSelector(state => state.cache)
    const { user, siderQueries, defaultRole } = useTypedSelector(state => state.auth)
    const [userId, setUserId ] = useState('')
    const {setSiderQueries} = useAction()
    useImperativeHandle(
      ref, () => ({
        getSiderQueries() {
          getSiderQueries()
        }
      }))
    const [heb, setHeb] = useState(true)
    useEffect(() => {
      if(props.user?.id) {
        setHeb(user.locale === 'heIL' ? true : false)
        if(userId !== props.user?.id) {
          setUserId(props.user?.id)
        }
        
      }
    }, [props.user.id,user.locale])

    useEffect(() => {
      if(userId!=='') {
          getSiderQueries()
      }
    }, [userId])

    const dataPartition = (where: string) => {

      if(defaultRole)
      if(defaultRole.label !== 'Admin') {
       return ANALYST_DTP.replace(/currentUser/g, user.id) + ( where !== '' ? " AND ( " + where + ")" : "" )
      }
      return where
     }
    const [siderFolders, setSiderFolders] = useState([] as IQuery[])   
    const getSiderQueries = async () => {
   
      if(!userId) 
      {
        return
      }
      let result_query_Arr:IQuery[] = []
      let result_query = await axiosFn("get", '', '*', 'queries', " object='"+props.user.id+"' AND folder <> '" +HOME_FOLDER + "' order by seq " , '' )  
      result_query_Arr = JSON.parse(JSON.stringify(result_query?.data)) 
        let folders:IQuery[] = result_query_Arr.filter( r => r.factory === 'folder' )
        setSiderFolders(folders)
        let index = 1 
        result_query_Arr.map(async ( q,i) =>  {
          q.index = i
          if(q.factory!=='folder') {
            if(props.sider) {
              let q_result = await axiosFn("get", '', ' count(id) as cnt ', 'V_' + q.factory + 's', q.factory === 'ticket' ? dataPartition(q.query) : q.query , '' )  
              q.count = q_result.data[0].cnt 
            }
            if(result_query_Arr.length === index){
              setSiderQueries(JSON.parse(JSON.stringify(result_query_Arr)))
            }
          }
          index++
        })
    }
    const goToQuery = (q:IQuery) => {
      if(props.edit || !props.sider) return
      setQueriesCache({ [q.factory]: q.query, [q.factory+'_label']: q.name })
      if(q.factory === 'ticket') {
        router.push(RouteNames.TICKETS)
      } else if(q.factory === 'contact') {
        router.push(RouteNames.USERS)
      } else if(q.factory === 'ci') {
        router.push(RouteNames.CIS)
      } else if(q.factory === 'allWf') {
      router.push(RouteNames.WFS)
    }
  
    }
    const {setQueriesCache} = useAction()
    const deleteQuery = async (id:string, folder=false) => {
    
       if(folder) {
        siderQueries.map(async q => {
         if(q.folder === id )
          await axiosFn("delete", '', '*', 'queries', "id" , q.id ) 
        })
       }  
        let result_query = await axiosFn("delete", '', '*', 'queries', "id" , id ) 
        let hasError = false;
        if(result_query.data["error"]) hasError = true;
        if(!hasError) { 
          setAlert({
            type: 'success' ,
            message: t('deleted_success'),
            closable: true ,
            showIcon: true ,
            visible: true,
            autoClose: 10 
           })
           getSiderQueries()
        }
        else {
          setAlert({
            type: 'warning' ,
            message: result_query.data["error"],
            closable: true ,
            showIcon: true ,
            visible: true,
            autoClose: 10 
           })
        }
   }
   //---------------------------------------
  const onDragEnd = (result: DropResult): void => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
     let queries_:IQuery[] = [...siderQueries]
     let from_index = result.source.index
     let to_index = result.destination.index
     let from_index_id = ''
     let to_index_id = ''
     let from_folder = ''
     let to_folder = ''
     let fromObj =  queries_.find(q=>q.index===from_index) || undefined
     if(fromObj) 
     {
      from_index_id = fromObj?.id
      from_folder = fromObj?.folder
     }
     
     let toObj =  queries_.find(q=>q.index===to_index) || undefined
     if(toObj) { 
       to_index_id = toObj?.id
       to_folder = toObj?.folder
     }
    queries_.map(q=>{
      if(q.id===from_index_id) {
        q.index = to_index
        q.folder = to_folder
      } 
      
      if(q.id===to_index_id)  {
        q.index = from_index
        q.folder = from_folder
      }
      
    })


     queries_ = queries_.sort((a,b) => a.index - b.index) 
     setSiderQueries(queries_)
     queries_.map(async q => {
      let js = {seq:q.index} as Object
      let q_result = await axiosFn("put", js,  '', 'queries', 'id',  q.id  ) 
      }
      ) 
  }
  const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    // background: isDraggingOver ? "lightblue" : "transparent",
    paddingRight:'5px'
  })
  const SelectStyles = {
    container: (provided: any) => ({
      ...provided,
      width: '100%',
      opacity: '1 !important',
      // color: 'green!important',
      fontWidth: '10px!important',
    })
  }
  const [queryTemplateUser, setQueryTemplateUser] = useState({} as SelectOption)


  const initSelectValues:any = { }
  const [selectValues , setSelectValues] = useState(initSelectValues) 
  const initSelectOptions:any = {}
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
          where = " (" + where + ") and name like N'%" + inputValue + "%' "
        }
        const response = await  axiosFn("get", '', what, tname, where , ''  )  
      let hasError = false;
      if(response.data["error"]) hasError = true;
        if(response.data&&!hasError)
        {
          setSelectOptions({...selectOptions, [name]: response.data}) 
          if(inputValue.length === 0 || big)
          //setSelectSmall( { [name]: response.data } )
          return response.data
        } 
      }
      else // not big table
        {
          return selectOptions[name].filter((i:SelectOption) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
        }
    }  
   
     const selectChanged = async (selectChange:any, name:string) =>
      {
        setSelectValues({...selectOptions, [name]: selectChange })
      }
    const [saved, setSaved] = useState(false) 
    
    const clean_old_queries = async () => {
      let old_query = await axiosFn("get", '', '*', 'queries', " object='"+props.user.id+"' AND folder <> '" +HOME_FOLDER + "' order by seq " , '' )  
      let old_query_Arr:IQuery[] =  old_query?.data 
      let index_old = 1
                  if(old_query_Arr.length>0)
                    old_query_Arr.map(async o => {
                    await axiosFn("delete", '', '*', 'queries', "id" , o.id  ) 
                    if(old_query.length===index_old) { 
                      getSiderQueries()
                    }
                  })
    }

    const create_queries_by_template = async () => {
      setSaved(true)
      if(!queryTemplateUser) return
      await clean_old_queries()
    
        let new_query = await axiosFn("get", '', '*', 'queries', " object='"+queryTemplateUser.value+"' AND folder <> '" +HOME_FOLDER + "' order by seq " , '' )  
        let new_query_Arr:IQuery[] =  new_query?.data 
        let new_query_FoldersArr:IQuery[] = new_query_Arr.filter(f=> (f.folder === '' || !f.folder) && f.folder !== SIDER_NO_FOLDER && f.folder !== HOME_FOLDER )
        let new_query_QueriesArr:IQuery[] = new_query_Arr.filter(q=> q.folder?.length > 10 )
        
        try {
          if(new_query_Arr )
          {
            let index = 1
            let foldersObj:oldNew[] = []
            if(new_query_FoldersArr.length!==0)
            new_query_FoldersArr.map(async q =>  {
              let query_ = {} as IQuery
              query_ = {...query_,
                name:q.name,	
                object:props.user.id, 
                factory:q.factory, 
                query: q.query, 
                folder: q.folder,
                seq: q.seq }
                const responseNewFolder = await axiosFn("post", query_, '*', 'queries', "id" , ''  )  
                foldersObj.push({old: q.id, new: responseNewFolder?.data[0].id})
                if(new_query_FoldersArr.length===index) {
                  let index_q =  1
                  new_query_QueriesArr.map(async q =>  {
                    let query_ = {} as IQuery
                    let new_folderObj = foldersObj.find(ff => ff.old === q.folder)
                    query_ = {...query_,
                      name:q.name,	
                      object:props.user.id, 
                      factory:q.factory, 
                      query: q.query, 
                      folder: new_folderObj?.new  ? new_folderObj?.new : q.folder,
                      seq: q.seq }
                      const responseNewFolder = await axiosFn("post", query_, '*', 'queries', "id" , ''  )  
                      if(new_query_QueriesArr.length===index_q) {
                          setSaved(false)
                          getSiderQueries()
                          setAlert({
                            type: 'success' ,
                            message: t('created_success'),
                            closable: true ,
                            showIcon: true ,
                            visible: true,
                            autoClose: 10 
                          })  
                      }
                      index_q ++
                    })
                }
                index++
            })  
            else
            {
              let index_q = 1
              new_query_QueriesArr.map(async q =>  {
                let query_ = {} as IQuery
                let new_folderObj = foldersObj.find(ff => ff.old === q.folder)
                query_ = {...query_,
                  name:q.name,	
                  object:props.user.id, 
                  factory:q.factory, 
                  query: q.query, 
                  folder: q.folder,
                  seq: q.seq }
                  const responseNewFolder = await axiosFn("post", query_, '*', 'queries', "id" , ''  )  
                  if(new_query_QueriesArr.length===index_q) {
                      setSaved(false)
                      getSiderQueries()
                      setAlert({
                        type: 'success' ,
                        message: t('created_success'),
                        closable: true ,
                        showIcon: true ,
                        visible: true,
                        autoClose: 10 
                      })  
                  }
                  index_q ++
                })
            }     
          }
        } catch(e:any) {
          setSaved(false)
          setAlert({
                    type: 'warning' ,
                    message:e.message,
                    closable: true ,
                    showIcon: true ,
                    visible: true,
                    autoClose: 10 
                  })
        }
      
    }  
    const buildTooltip = (name:string,count:string) => {
      return name.toString().length>25 || +count > 99 ?  name + (props.sider ? '-' + count : '') : undefined
    }
    const buildTooltipColor = (name:string,count:string) => {
      return name.toString().length>25 || + count > 99 ? 'cyan' : 'transparent'
    }
    

    return (
      <>
           {
             props.edit ?   
            <> 
           
            <DragDropContext  onDragEnd={onDragEnd} >
             <Droppable droppableId="droppable">
               {(provided, snapshot) => (
             <div {...provided.droppableProps}  
             ref={provided.innerRef}
             style={getListStyle(snapshot.isDraggingOver)}
             key="Droppable_1"
             >   
             <SubMenu key="queries" 
             icon={<FileOutlined />} title={t('queries')}
             >
               {   
                 siderQueries.filter(f=>f.folder===SIDER_NO_FOLDER&&f.factory!=='folder'&&f.object===userId).map( (q,index) => (
                   <Draggable key={'drag_'+q.id} draggableId={q.id}  index={q.index} isDragDisabled={!props.edit}>
                   {(provided, snapshot) => (
                   <div  
                   key={'div_'+q.id}
                   ref={provided.innerRef}
                   {...provided.draggableProps}
                   {...provided.dragHandleProps}
                     >
                   <Menu.Item key={q.id}
                   >
                           <Tooltip title={t('delete')}>
                             <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteQuery(q.id)}>
                             <DeleteOutlined 
                             ></DeleteOutlined>
                             </Popconfirm>
                           </Tooltip>
                     <Tooltip title={q.name}>
                         {q.name.toString().substring(0,40)} 
                     </Tooltip>
 
                   </Menu.Item>
                   </div>
                   )}
                   </Draggable>
                 ))
               }
               {
                 siderFolders.map( f => (
                   <SubMenu key={f.id} 
                     icon= 
                     {
                                   <Tooltip title={t('delete')}>
                                     <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteQuery(f.id, true)}>
                                     <DeleteOutlined 
                                     ></DeleteOutlined>
                                     </Popconfirm>
                                   </Tooltip> 
                     }
                     title={f.name}>
                   {
                   siderQueries.filter(fq=>fq.folder===f.id&&fq.object===userId).map( q => (
                    <Draggable key={'drag_sub'+q.id} draggableId={q.id}  index={q.index} isDragDisabled={!props.edit}>
                   {(index, snapshot) => (
                   <div style={{paddingRight:'15px'}}  key={'div_'+f.id}
                   ref={index.innerRef}
                   {...index.draggableProps}
                   {...index.dragHandleProps}
                     >
                           <Menu.Item key={q.id}
                           onClick={() => goToQuery(q)}
                           >
                                   <Tooltip title={t('delete')}>
                                     <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteQuery(q.id)}>
                                     <DeleteOutlined 
                                     ></DeleteOutlined>
                                     </Popconfirm>
                                   </Tooltip>
                             <Tooltip title={q.name}>
                                 {q.name.toString().substring(0,40)}
                             </Tooltip> 
                           </Menu.Item>
                              </div>
                              )}
                   </Draggable>
                         ))
                     } 
                   </SubMenu> 
                 ))
               }
             </SubMenu>
             </div>  
              )}
             </Droppable>
           </DragDropContext> 
           <Card bodyStyle={{padding: "0",background:props.sider ? '#000c17': ''}}>
           <AsyncSelect 
           autoFocus={true}
           menuPosition="fixed"
           isMulti={false}
           styles={SelectStyles}
           isClearable={true}
           placeholder={ t('query_template_user') }
           cacheOptions 
           defaultOptions
           loadOptions={ (inputValue:string) => promiseOptions(inputValue, 'query_template_user',  ' top 20 name as label, id as value , id as code ', 'V_contacts', NOT_GROUP_LIST + " AND id IN ("+SELECT+" object "+FROM+" queries  ) AND id <> '" + props.user.id + "'", true )} 
          onChange={(event:any) => setQueryTemplateUser(event)}
          value={queryTemplateUser}
           />
           <br />
           &nbsp;&nbsp;&nbsp;
           {
            saved &&
            <Spin />
           }
           
           <Tooltip title={t('create')}>
            <Popconfirm title={t('are_you_sure_rebuild')} okText={t('yes')} cancelText={t('no')}  onConfirm={() =>  create_queries_by_template()}>
              <Button  
              // style={{ background: "orange", borderColor: "white" }}
              disabled={!queryTemplateUser}
              >{t('create')}</Button>
            </Popconfirm>              
           </Tooltip>
     
          
          &nbsp;&nbsp;&nbsp;<Button  
            // style={{ background: "orange", borderColor: "white" }}
            onClick={() => setQueryTemplateUser({} as any)  }
            >{t('cancel')}</Button>  
           </Card>

           </> :

          <SubMenu key="queries" 
             icon={<FileOutlined />} title={t('queries')}
             >
               {   
                 siderQueries.filter(f=>f.folder===SIDER_NO_FOLDER&&f.factory!=='folder'&&f.object===userId).map( (q,index) => (
                 <Menu.Item key={q.id+'_noFolders'+'-' + q.count}
                   onClick={() => goToQuery(q)}
                   >
                     { props.sider && 
                     <Badge  count={ q.count}  size="small" offset={[heb ? -1:1, -20]} style={{ backgroundColor: '#28a4ae' }}></Badge>
                     }
                     <Tooltip title={()  => buildTooltip(q.name, q.count) } placement="bottom" color={buildTooltipColor(q.name, q.count)} >
                     &nbsp; {q.name.toString().substring(0,40)}
                     </Tooltip>
 
                   </Menu.Item>
                 ))
               }
               {
                 siderFolders.map( f => (
                   <SubMenu key={f.id} 
                     icon= 
                     {
                      <FileOutlined />
                     }
                     title={f.name}>
                   {
                   siderQueries.filter(fq=>fq.folder===f.id&&fq.object===userId).map( q => (
                           <Menu.Item key={q.id+'-' + q.count}
                           onClick={() => goToQuery(q)}
                           >
                              { props.sider && 
                              <Badge  count={ q.count}  size="small" offset={[heb ? -1 : 1, -20]} style={{ backgroundColor: '#28a4ae' }}></Badge>
                              }
                              <Tooltip title={()  => buildTooltip(q.name, q.count)} placement="bottom" color={buildTooltipColor(q.name, q.count)} >
                                 {q.name.toString().substring(0,40)}
                             </Tooltip> 
                           </Menu.Item>
                         ))
                     } 
                   </SubMenu> 
                
                 ))
               }
          </SubMenu>
    
           } 
      </>      
    )
  })
  
  
  export default QueriesTree;