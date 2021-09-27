import { Button, Layout, Modal, Row } from 'antd';
import  {FC, useEffect, useState} from 'react';
import EventCalendar from '../components/EventCalendar';
import EventForm from '../components/EventForm';
import { useAction } from '../hooks/useAction';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTranslation } from 'react-i18next';
import { IEvent } from '../models/IEvent';

const Event:FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const {error, isLoading, guests, events } = useTypedSelector(state => state.event)
  const {user } = useTypedSelector(state => state.auth)
  const {fetchGuests, fetchEvents, createEvent} = useAction()
  useEffect(() => {
    fetchGuests("")
  }, [])
  useEffect(() => {
    fetchEvents(user.id)
  }, [])


  const { t } = useTranslation();
  function SubmitEvent(event:IEvent) {
    createEvent(event)
    setModalVisible(false)
    fetchEvents(user.id)
  }
  return (
    <Layout>
       <EventCalendar events={events} me={user.id} />
       <Row justify="center">          
          <Button 
          onClick={() => setModalVisible(true) }
          >{t('add_new_vent')}</Button>
       </Row>
       <Modal
       title={t('add_new_vent')}
       footer={null}
       onCancel={() => setModalVisible(false)}
       visible={modalVisible}
       >
         <EventForm 
         submit={event => SubmitEvent(event) }
         guests={guests}
         modalVisible={modalVisible}
         />
       </Modal>
    </Layout>
    
  )
}
export default Event;