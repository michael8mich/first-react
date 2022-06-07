import { Table, Tabs } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useTranslation } from "react-i18next";
import { FC } from "react-router/node_modules/@types/react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { ITicketLog } from "../../models/ITicket";
import { uTd } from "../../utils/formManipulation";
const TicketSla:FC = () => {
    const { t } = useTranslation();
    const { selectedTicket } = useTypedSelector(state => state.ticket)
    const ticketLogColumns: ColumnsType<ITicketLog> = [
      {
        key: 'name',
        title: t('action'),
        dataIndex: 'name',
        sorter: (a:any, b:any) =>  a.name.localeCompare(b.name),
        width: '10%',
        fixed: 'left',
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
        key: 'new_value',
        title: t('new_value'),
        dataIndex: 'new_value',
        sorter: (a:any, b:any) =>  a.new_value.localeCompare(b.new_value),
        width: '35%',
      },
      {
        key: 'old_value',
        title: t('old_value'),
        dataIndex: 'old_value',
        sorter: (a:any, b:any) =>  a.old_value.localeCompare(b.old_value),
        width: '35%',
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
        
        
      <Table<ITicketLog>
      scroll={{ x: 1200, y: 700 }}
      columns={ticketLogColumns} 
      dataSource={selectedTicket.tickets_log} 
      rowKey={record => record.id}
      >
      </Table> 
    
    )
}

export default TicketSla;