import moment, { Moment } from 'moment';
import { message } from "antd";
import i18n from "i18next";
export const getValidatorsToProp = (pattern:string) =>
  {
    let validatorsArr:any = []
     pattern.split(',').map(v=>
      {
        v = v.trim() || ''
        if(v==='required')
        validatorsArr.push( validators['required']() )
        if(v==='isEmail')
        validatorsArr.push( validators['isEmail']() )
        if(v==='isPhone')
        validatorsArr.push( validators['isPhone']() )
        if(v==='isUsername')
        validatorsArr.push( validators['isUsername']() )
        if(v==='isNumber')
        validatorsArr.push( validators['isNumber']() )
        if(v==='isDateAfter')
        validatorsArr.push( validators['isDateAfter']() )
      }
      ) 
      console.log('validatorsArr', validatorsArr);
      
      return validatorsArr
  } 

function validateEmail(email:string) 
    {
        var re = /\S+@\S+\.\S+/
        return re.test(email)
    }
function validatePhone(phone:string) 
    {
        var re =/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm
        return re.test(phone);
    }
function validateUsername(username:string) 
    {
        var re =/^[A-Za-z .]{3,15}$/
        return re.test(username);
    }  
function validateNumber(number:string) 
    {
        var re =/^-?[\d.]+(?:e-?\d+)?$/
        return re.test(number);
    }             
    
export const validators = {
    required: (message: string = i18n.t('required_field')) => ({
        required: true,
        message
    }
    ),
    isEmail: (message: string = i18n.t('email_field')) => () => (
        {
            validator(_:any,value:string) {
                value = value || ''
                if(validateEmail(value)||value.length===0)
                {
                    return Promise.resolve()
                }
                return Promise.reject(new Error(message))
            }
        }
    ),
    isPhone: (message: string = i18n.t('phone_field')) => () => (
        {
            validator(_:any,value:string) {
                value = value || ''
                if(validatePhone(value)||value.length===0)
                {
                    return Promise.resolve()
                }
                return Promise.reject(new Error(message))
            }
        }
    ),
    isUsername: (message: string = i18n.t('username_field')) => () => (
        {
            validator(_:any,value:string) {
                value = value || ''
                if(validateUsername(value)||value.length===0)
                {
                    return Promise.resolve()
                }
                return Promise.reject(new Error(message))
            }
        }
    ),
    isNumber: (message: string = i18n.t('number_field')) => () => (
        {
            validator(_:any,value:string) {
                value = value || ''
                if(validateNumber(value)||value.length===0)
                {
                    return Promise.resolve()
                }
                return Promise.reject(new Error(message))
            }
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