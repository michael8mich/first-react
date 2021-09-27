import moment, { Moment } from 'moment';
import { message } from "antd";
import i18n from "i18next";


export const validators = {
    required: (message: string = i18n.t('required_field')) => ({
        required: true,
        message
    }
    ),
    isDateAfter: (message: string = i18n.t('isDateAfter')) => () => (
        {
            validator(_:any,value:Moment) {
                if(value.isSameOrAfter(moment())) 
                {
                    return Promise.resolve()
                }
                return Promise.reject(new Error(message))
            }
        }
    )
}