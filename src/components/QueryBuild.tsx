import {Form, Input, Button, Select, DatePicker,TimePicker, Row}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useAction } from '../hooks/useAction';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { IEvent } from '../models/IEvent';
import { IUser } from '../models/IUser';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { validators } from '../utils/validators';
import { IQuery } from '../models/ISearch';
import { axiosFn } from '../axios/axios';

interface QueryBuildProps {
  where: string,
  //submit: (event: IEvent) => void,
  factory: string
}

const QueryBuild: FC<QueryBuildProps> = (props) => {

  const {error, isLoading } = useTypedSelector(state => state.event)
  const {setAlert} = useAction()
  const {user } = useTypedSelector(state => state.auth)
  const [new_query_name, setNew_query_name] = useState('')
  const [new_query_view, setNew_query_view] = useState(false)
  const { t } = useTranslation();

  const create_query = async () => {
    if(new_query_name.trim().length > 3 ) {
    let  hasError = false   
    let query_ = {} as IQuery
    query_ = {...query_,
    name:new_query_name,	
    object:user.id, 
    factory:props.factory, 
    query: props.where, 
    seq: 1 }
    const responseNew = await axiosFn("post", query_, '*', 'queries', "id" , ''  )  
    if(responseNew.data["error"]) hasError = true;
    if(responseNew.data&&!hasError)
    {
      let new_id: string = responseNew.data[0].id
    }
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

  };
    return (
      <div>
      {
        new_query_view ? 
        <>
          &nbsp;&nbsp;&nbsp;<Button  
          disabled={new_query_name.trim().length===0}
          style={{ background: "orange", borderColor: "white" }}
          onClick={() => create_query()  }
          >{t('save')}</Button>
          
          &nbsp;&nbsp;&nbsp;<Button  style={{ background: "orange", borderColor: "white" }}
            onClick={() => { setNew_query_view(false); setNew_query_name('') }  }
            >{t('cancel')}</Button>  
            &nbsp;&nbsp;&nbsp;<Input 
            style={{ height:'38px', width: '400px'}}
            placeholder={ t('fast_search') }
            value={new_query_name}
            onChange={(event) => setNew_query_name(event.target.value ) }
          />
          </>
        :
        <>
          &nbsp;&nbsp;&nbsp;<Button  style={{ background: "orange", borderColor: "white" }}
            onClick={() => setNew_query_view(true)  }
            >{t('create_query')}</Button>
          
      </>  
      }
      </div>
    )
  }
  export default QueryBuild;