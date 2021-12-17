import { Button, Col, Popconfirm, Progress, Row, Steps, Switch, Table, Tabs, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useState } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { ITicketWfTpl, WF_STATUS_COMPLETE, WF_STATUS_PEND, WF_STATUS_REJECT, WF_TASK_END_GROUP, WF_TASK_START_GROUP } from "../../models/ITicket";
import { uTd } from "../../utils/formManipulation";
import {FolderViewOutlined, EditOutlined,DeleteOutlined, VerticalAlignBottomOutlined} from '@ant-design/icons';
import { axiosFn } from "../../axios/axios";
import TicketWfDtl from "./TicketWfDtl";
import { userInfo } from "os";
import { useAction } from "../../hooks/useAction";
const { Step } = Steps;
const TicketWfs:FC = () => {
    const { t } = useTranslation();
    const { selectedTicket, selectedWfsId } = useTypedSelector(state => state.ticket)
    const {user, defaultRole } = useTypedSelector(state => state.auth)
    const {setSelectedWfsId} = useAction()
    // useEffect(() => {
     
  
    //  }, [selectedWfsId])
    const ticketWfsColumns: ColumnsType<ITicketWfTpl> = [
        {
            key: 'action',   
            title: t('actions'),
            width: '7%',
            fixed: 'left',
            render: (record, index) => {
              return (
                <>
                {
                    record.task.value !== WF_TASK_START_GROUP.value && record.task.value !== WF_TASK_END_GROUP.value && 
                    <>
                    <FolderViewOutlined key="view" 
                        onClick={() => selectWf(record, true)}
                    />&nbsp;&nbsp;
                    {
                        record.status.value !== WF_STATUS_COMPLETE.value &&
                        <EditOutlined key="edit"
                        onClick={() => selectWf(record, false)}
                        />
                    }
                    &nbsp;&nbsp;
                    {
                        record.deleteable !== 0 &&
                        <Tooltip title={t('delete')} key="delete">
                        <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteWf(record.id)}>
                                        <DeleteOutlined 
                                        ></DeleteOutlined>
                        </Popconfirm>              
                        </Tooltip>
                    }
                </>
                }
                {
                    record.task.value === WF_TASK_START_GROUP.value &&  
                    <VerticalAlignBottomOutlined  style={{fontSize:30,color:'#49b6ba'} }   />
               
                }
                {
                    record.task.value === WF_TASK_END_GROUP.value &&  
                    <VerticalAlignBottomOutlined  style={{fontSize:30,color:'#49b6ba'} } rotate={180}   />
                }
               </>
              )}
        },
        {
          key: 'sequence',
          title: t('sequence'),
          dataIndex: 'sequence',
          sorter: (a:any, b:any) =>  a.sequence - b.sequence,
          width: '5%',
        },
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
          sorter: (a:any, b:any) =>  a.task?.label.localeCompare(b.task?.label),
          width: '10%',
          render: ( record) => {
            return (
                <>        
                {record.task?.label && record.task?.label} 
                </>
            );}
        },
        {
          key: 'status',
          title: t('status'),
          sorter: (a:any, b:any) =>  a.status?.label.localeCompare(b.status?.label),
          width: '10%',
          render: ( record) => {
            return (
                <>        
                {record.status?.label && record.status?.label} 
                </>
            );}
        },
        {
          key: 'start_dt',
          title: t('start_dt'),
          sorter: (a:any, b:any) =>  a.start_dt - b.start_dt,
          width: '10%',
          render: ( record) => {
            return (
                <>        
                {uTd(record.start_dt)} 
                </>
            );}
        },
        {
          key: 'team',
          title: t('team'),
          sorter: (a:any, b:any) => a.team?.label && a.team?.label.localeCompare(b.team?.label),
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
          sorter: (a:any, b:any) =>  a.assignee?.label && a.assignee?.label.localeCompare(b.assignee?.label),
          width: '10%',
          render: ( record) => {
            return (
                <>        
                {record.assignee?.label && record.assignee?.label} 
                </>
            );}
        },
        {
            key: 'done_by',
            title: t('done_by'),
            sorter: (a:any, b:any) =>  a.done_by - b.done_by,
            width: '10%',
            render: ( record) => {
              return (
                  <>        
                  {record.done_by?.label && record.done_by?.label} 
                  </>
              );}
        },
        {
          key: 'done_dt',
          title: t('done_dt'),
          sorter: (a:any, b:any) =>  a.done_dt - b.done_dt,
          width: '10%',
          render: ( record) => {
            return (
                <>        
                {uTd(record.done_dt)} 
                </>
            );}
        }
      ]
  const [viewWf, setViewWf] = useState(false)
  const [roWf, setRoWf] = useState(false)
  
  useEffect(() => {
    if(selectedWfsId!=='')
    {
      let obj = selectedTicket.ticketWfs?.find(w=>w.id===selectedWfsId)
      if(obj) {
        setSelectedWf(obj)
        setViewWf(true)
        setRoWf(true)
        setSelectedWfsId('')
      }
    } else
    if(selectedWf?.id)
    {
      let obj = selectedTicket.ticketWfs?.find(w=>w.id===selectedWf?.id)
      if(obj)
      setSelectedWf(obj)
    } 
  }, [selectedTicket.ticketWfs])

  const addNewWfs = () => { 
    setViewWf(true)
    //setSelectedWf({} as ITicketWfTpl)
    setRoWf(false)
  }
  const deleteWf = async (id:string) => {
    let result_query = await axiosFn("delete", '', '*', 'wftpl', "id" , id )
    //fetchWfs(selectedCategory.id)
  }
  const [selectedWf, setSelectedWf] = useState({} as ITicketWfTpl)
  const selectWf = (record:ITicketWfTpl, ro:boolean) => {
    setSelectedWf(record)
    setViewWf(true)
    setRoWf(ro)

  }

  const resetSelectedWf =(id:string) => {
    
    let obj = selectedTicket.ticketWfs?.find(w=>w.id===id)
    setSelectedWf(obj ? obj : {} as ITicketWfTpl)
    setViewWf(true)
    setRoWf(true)
  }
  const row_color_class = (record:ITicketWfTpl) => {
      let ret = 'table-row-complete'  
      if( record.status?.value === WF_STATUS_PEND.value)
      ret=  'table-row-pend'
      if( record.status?.value === WF_STATUS_REJECT.value)
      ret=  'table-row-reject'
      if(record.id ===  selectedWf.id)
      ret=  'table-row-selected'
      if( record.task?.value === WF_TASK_START_GROUP.value || record.task?.value === WF_TASK_END_GROUP.value)
      ret=  'table-row-start-end'
      return ret
  }
  const [wiveMyWfs, setWiveMyWfs ] = useState(false)
  const ifMyWf = (w:ITicketWfTpl) => {
     let ret = false
     if( w.assignee?.value === user.id || JSON.stringify(user.teams).includes(w.team?.value)  ) 
     ret = true
     return ret
  }
    return (
        <>
           
            <Switch checkedChildren={t('my_wfs_only')} unCheckedChildren={t('all_wfs')} 
            onChange={() => setWiveMyWfs(!wiveMyWfs)}
            defaultChecked={wiveMyWfs} />
            <Progress strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                }} 
              percent={
               selectedTicket?.ticketWfs?.filter(fw=>fw.task?.value!==WF_TASK_START_GROUP.value && fw.task?.value!==WF_TASK_END_GROUP.value && fw.status ?.value===WF_STATUS_COMPLETE.value).length && 
               Math.round((selectedTicket?.ticketWfs?.filter(fw=>fw.task?.value!==WF_TASK_START_GROUP.value && fw.task?.value!==WF_TASK_END_GROUP.value && fw.status ?.value===WF_STATUS_COMPLETE.value).length/
                selectedTicket?.ticketWfs?.filter(fw=>fw.task?.value!==WF_TASK_START_GROUP.value && fw.task?.value!==WF_TASK_END_GROUP.value).length)*100)

            } width={80} key="Progress" />
            <Steps key="Steps" progressDot current={

                selectedTicket?.ticketWfs?.filter(fw=>fw.task?.value!==WF_TASK_START_GROUP.value && fw.task?.value!==WF_TASK_END_GROUP.value && fw.status ?.value===WF_STATUS_COMPLETE.value).length
            }
            
            >
                {
                    selectedTicket.ticketWfs &&
                    selectedTicket.ticketWfs.filter(fw=>fw.task?.value!==WF_TASK_START_GROUP.value && fw.task?.value!==WF_TASK_END_GROUP.value).map(w=> (
                        <Step title={w.sequence}  key={w.id}
                         description={w.name} /> 
                       )

                    )
                }
            </Steps>
 
        {
            !viewWf && false &&
            <Button
              onClick={addNewWfs}
              > {t('add_new')}
            </Button>
         }
         
           <Row>
           <Col  xl={viewWf ? 12 : 24 }  lg={viewWf ? 12 : 24} sm={viewWf ? 12 : 24} xs={24} >
           <Table<ITicketWfTpl>
           rowClassName={(record) => row_color_class(record) }
           scroll={{ x: 1200, y: 700 }}
           columns={ticketWfsColumns} 
           dataSource={!wiveMyWfs ? selectedTicket.ticketWfs : selectedTicket.ticketWfs?.filter(w=> ifMyWf(w))} 
           rowKey={record => record.id}
           pagination={{ pageSize: 100 }}          
           >
           </Table> 
           </Col>
           <Col   xl={viewWf ? 12 : 0 }  lg={viewWf ? 12 : 0} sm={viewWf ? 12 : 0} xs={24} 
           >
           {
            viewWf &&
            <TicketWfDtl 
            save={() => setViewWf(false) }
            cancel={() =>  { setViewWf(false); setSelectedWf({} as ITicketWfTpl ) } }
            setRoWf={(value:boolean) => setRoWf(value) }
            resetSelectedWf={(value:string) => resetSelectedWf(value) }
            ro={roWf}
           
            // lastSequence={(+selectedTicket.ticketWfs[selectedTicket.ticketWfs?.length-1]?.sequence+10).toString()}
            lastSequence={'10'}
            selectedWf={selectedWf}
            wfs={selectedTicket.ticketWfs ? selectedTicket.ticketWfs : [] as ITicketWfTpl[]}
            />
          }
           </Col>
           </Row>
           
    </>        
    
    )
}

export default TicketWfs;