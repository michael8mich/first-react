import { Button, Col, Drawer, Popconfirm, Progress, Row, Steps, Switch, Table, Tabs, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useState } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { ITicketWfTpl, WF_STATUS_COMPLETE, WF_STATUS_PEND, WF_STATUS_REJECT, WF_TASK_END_GROUP, WF_TASK_START_GROUP } from "../../models/ITicket";
import { uTd } from "../../utils/formManipulation";
import {UndoOutlined, PlusCircleOutlined,DeleteOutlined, VerticalAlignBottomOutlined} from '@ant-design/icons';
import { axiosFn } from "../../axios/axios";
import TicketWfDtl from "./TicketWfDtl";
import { userInfo } from "os";
import { useAction } from "../../hooks/useAction";
import useWindowDimensions from "../../hooks/useWindowDimensions";
const { Step } = Steps;
const TicketWfs:FC = () => {
    const { t } = useTranslation();
    const { height, width } = useWindowDimensions();
    const { selectedTicket, selectedWfsId } = useTypedSelector(state => state.ticket)
    const {user, defaultRole } = useTypedSelector(state => state.auth)
    const {setSelectedWfsId, fetchTicketWfs} = useAction()
    const ticketWfsColumns: ColumnsType<ITicketWfTpl> = [
        {
          key: 'sequence',
          title: t('sequence'),
          // dataIndex: 'sequence',
          sorter: (a:any, b:any) =>  a.sequence - b.sequence,
          width: '5%',
          render: ( record) => {
            return (
                <>   
                {
                record.task?.value && record.task?.value === WF_TASK_START_GROUP.value ?  
                <VerticalAlignBottomOutlined  style={{fontSize:30,color:'#49b6ba'} }    /> 
                : 
                record.task?.value && record.task?.value === WF_TASK_END_GROUP.value ?  
                <VerticalAlignBottomOutlined  style={{fontSize:30,color:'#49b6ba'} } rotate={180}   /> 
                :   
                record.sequence  
                }
                
              
                {
                record.task?.value && record.task?.value !== WF_TASK_START_GROUP.value && record.task?.value && record.task?.value !== WF_TASK_END_GROUP.value &&
                record.status.value !== WF_STATUS_COMPLETE.value && 
                <Tooltip title={ t('add_new', { object: t('wf') })}>
               <PlusCircleOutlined style={{cursor:"pointer",paddingInline:5}}
               onClick={()=>setSelectedNewWf(record)}
              
               />
                </Tooltip>

                }
                {
                record.task?.value && record.task?.value !== WF_TASK_START_GROUP.value && record.task?.value && record.task?.value !== WF_TASK_END_GROUP.value &&
                record.status.value !== WF_STATUS_COMPLETE.value && record.deleteable === 1 &&
                <Tooltip title={ t('delete', { object: t('wf') })}>
                   <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  
                   onConfirm={() => deleteWf(record.id)}
                   onCancel={()=> cancelDeleteWf()}
   
                   >
                      <DeleteOutlined style={{cursor:"pointer",paddingInline:5}}/>
                   </Popconfirm>
                </Tooltip>

                }
                </>

                
            );},
            fixed: 'left'
        },
        {
          key: 'name',
          title: t('action'),
          dataIndex: 'name',
          sorter: (a:any, b:any) =>  a.name.localeCompare(b.name),
          width: '10%',
          fixed: 'left'
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
  const [selectedNewWf, setSelectedNewWf] = useState({} as ITicketWfTpl)
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

  useEffect(() => {
    
    if(selectedNewWf)
    {
      const selectedNewWf_ = JSON.parse(JSON.stringify({...selectedNewWf, id:'0'}) )
      setSelectedWf(selectedNewWf_ )
     
        setSelectedNewWf({...selectedNewWf_, id: ''} )
    
      
    }
  }, [selectedNewWf.id])

  const deleteWf = async (id:string) => {
    let result_query = await axiosFn("delete", '', '*', 'wf', "id" , id )
    fetchTicketWfs(selectedTicket)
    setViewWf(false)
    setSelectedWf({} as ITicketWfTpl )
  }
  const cancelDeleteWf =  () => {
    setTimeout(() => {
      setViewWf(false)
      setSelectedWf({} as ITicketWfTpl )
    }, 500);
    
  }
  
  const [selectedWf, setSelectedWf] = useState({} as ITicketWfTpl)
  
  const selectWf = (record:ITicketWfTpl, ro:boolean) => {
    if( record.task?.value === WF_TASK_START_GROUP.value || record.task?.value === WF_TASK_END_GROUP.value)
    return
    if(record.status?.value === WF_STATUS_COMPLETE.value && !ro) return
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
           <UndoOutlined onClick={()=>fetchTicketWfs(selectedTicket)} style={{fontSize:20}}/>&nbsp;&nbsp;&nbsp;
            <Switch checkedChildren={t('my_wfs_only')} unCheckedChildren={t('all')} 
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
         
           <Row>
           <Col  xl={viewWf ? 24 : 24 }  lg={viewWf ? 24 : 24} sm={viewWf ? 24 : 24} xs={24} >
           <Table<ITicketWfTpl>
             onRow={(record, rowIndex) => {
              return {
                onClick: event => {selectWf(record, true)}, // click row
                onDoubleClick: event => {selectWf(record, false)}, // double click row
                onContextMenu: event => {}, // right button click row
                onMouseEnter: event => {}, // mouse enter row
                onMouseLeave: event => {}, // mouse leave row
              };
            }}
          
           rowClassName={(record) => row_color_class(record) }
           scroll={{ x: 1200, y: 700 }}
           columns={ticketWfsColumns} 
           dataSource={!wiveMyWfs ? selectedTicket.ticketWfs : selectedTicket.ticketWfs?.filter(w=> ifMyWf(w))} 
           rowKey={record => record.id}
           pagination={{ pageSize: 100 }}          
           >
           </Table> 
           </Col>
           {/* <Col   xl={viewWf ? 12 : 0 }  lg={viewWf ? 12 : 0} sm={viewWf ? 12 : 0} xs={24} 
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
           </Col> */}
            <Drawer
          title=""
          placement={ user.locale === 'heIL' ? 'left' : 'right'}
          closable={false}
          onClose={() =>  { setViewWf(false); setSelectedWf({} as ITicketWfTpl ) } }
          visible={viewWf}
          key={'openWfScreen'}
          width={ width>1000 ? '80%' : '90%' }
          height={ '90%' }
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
        </Drawer>
           </Row>
           
    </>        
    
    )
}

export default TicketWfs;