import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useTranslation } from "react-i18next";
import { FC } from "react-router/node_modules/@types/react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { INotification } from "../../models/INotification";
import { ITicketLog } from "../../models/ITicket";
import { uTd } from "../../utils/formManipulation";
const TicketNotifications:FC = () => {
    const { t } = useTranslation();
    const { selectedTicket } = useTypedSelector(state => state.ticket)
    const ticketNotificationColumns: ColumnsType<INotification> = [
      { 
       key: 'name',
       title: t('action'),
       dataIndex: 'name',
       sorter: (a:any, b:any) =>  a.name.localeCompare(b.name),
       width: '10%',
       fixed: 'left'
     },
     {
       key: 'send_to',
       title: t('send_to'),
       dataIndex: 'sended_to',
       sorter: (a:any, b:any) =>  a.sended_to.localeCompare(b.sended_to),
       width: '35%',
     },
     {
       key: 'subject',
       title: t('subject'),
       dataIndex: 'sended_subject',
       sorter: (a:any, b:any) =>  a.sended_subject.localeCompare(b.sended_subject),
       width: '35%',
     },
     {
       key: 'create_date',
       title: t('create_date'),
       sorter: (a:any, b:any) =>  a.create_date - b.create_date,
       render: ( record) => {
         return (
             <>        
             {uTd(record.create_date)} 
             </>
         );}
     },
     ]
    return (
        
        
      <Table<INotification>
      scroll={{ x: 1200, y: 700 }}
      columns={ticketNotificationColumns} 
      dataSource={selectedTicket.tickets_notifications} 
      rowKey={record => record.id}
      expandable={{
        expandedRowRender: record => <div dangerouslySetInnerHTML={{__html: record.sended_body?.toString() ? record.sended_body?.toString() : ''}} />,
        rowExpandable: record => record.sended_body !== '' ,
      }}
      >
      </Table>    
    
    )
}

export default TicketNotifications;