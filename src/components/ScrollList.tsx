import React, { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider, Popover, Drawer, Tag } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ITicket, ITicketObjects } from '../models/ITicket';
import { translateObj } from '../utils/translateObj';
import { RouteNames } from '../router';
import { uTd } from '../utils/formManipulation';
import { useHistory } from 'react-router-dom';
import { useAction } from '../hooks/useAction';
import PopoverDtl from '../pages/ticket/PopoverDtl';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from '../hooks/useTypedSelector';
import useWindowDimensions from '../hooks/useWindowDimensions';
import {   CloseCircleOutlined, ToolOutlined } from '@ant-design/icons';
import TicketAssignee from './tickets/TicketAssignee';
interface ScrollListProps {
    data:ITicket[]
}

const ScrollList = (props:ScrollListProps) => {
    
  const { user, defaultRole } = useTypedSelector(state => state.auth)
  const [loading, setLoading] = useState(false);
  const [ticketInfo, setTicketInfo] = useState('');
  const [data, setData] = useState([] as ITicket[]);
  const  {fetchTicket } = useAction()
  const router = useHistory()
  const { height, width } = useWindowDimensions();
  const { t } = useTranslation();  
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let data_ = translateObj(props.data, ITicketObjects)
    setData([...data_]);
    setLoading(false);
  };

  useEffect(() => {
    let data_ = translateObj(props.data, ITicketObjects)
    setData([...data_]);
  }, []);

  const goTo = (route:string, id:string) =>
  {
    router.push(route + '/' + id,  )
    fetchTicket(id)
  } 
  function  popover(event:any, record:ITicket ) 
  {
    //event.preventDefault()
    return (
         <PopoverDtl 
         record={record} 
         />         
    )
  }
  const selectTicket = (id:string) => 
  {
    fetchTicket(id) 
    setTicketInfo(id)
  }
  

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 200,
        width: '100%',
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      {/* <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={false}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      > */}
        <List
          dataSource={data}
          renderItem={(item:ITicket) => (
            <List.Item
            onClick={() => selectTicket(item.id)}  
            // onClick={() => goTo(RouteNames.TICKETS , item.id)}
            >
                  <List.Item.Meta
                    key={item.id}
                    avatar={<Avatar style={{backgroundColor:'#49b6ba'}}>{item.name}</Avatar>}
                    //   <Popover 
                    //   content={(event:any)=>popover(event, item)} 
                    //   title={ t('ticket') + ' ' +  t('number') + ' ' + item.name }  trigger="hover">  
                    //   <Avatar style={{backgroundColor:'#49b6ba'}}>{item.name}</Avatar>&nbsp;
                    //   </Popover>
                    
                    style={{cursor:'pointer',color:'gray'}}
                    title={
                        
                        <Tag icon={<ToolOutlined />} color="#55acee">
                        {item?.status?.label}
                        </Tag>
                        }
                    description={
                    <>
                    <label><span style={{color:'black', fontSize:12}}>{t('tcategory') + ':'}</span><span>{item?.category?.label}</span></label>
                    <br />
                    <label><span style={{color:'black', fontSize:12}}>{t('create_date') + ':'}</span><span>{uTd(item?.create_date)}</span></label>
                    </>
                  }
                  />
                </List.Item> )}
 
        />
      {/* </InfiniteScroll> */}
      <Drawer
          title=""
          placement={ user.locale === 'heIL' ? 'left' : 'right'}
          closable={false}
          onClose={() => setTicketInfo('')}
          visible={ticketInfo.length>0}
          key={'ticketInfo'}
          // width={ width>1000 ? 640 : 340 }
          width={ width>1000 ? '80%' : '90%' }
        >
          <CloseCircleOutlined  style={{fontSize:28,color:'gray'}} onClick={() => setTicketInfo('')} />
       {
          ticketInfo &&
          <TicketAssignee/>
         
       }
      </Drawer>
    </div>
    
  );
};

export default ScrollList

