import axios from 'axios'
import FormData from 'form-data'
import React from 'react';
//----------local
const SERVER = "https://localhost:44367"
//----------iis
export const SSO_PATH = "http://mx/user/user.asp"
//const SERVER = "http://mx/uta50"
export const Base_URL = SERVER + "/v1/uta"
const Base_URL_Email =  SERVER + "/v1/utaMail"
const Base_URL_LOGIN =  SERVER + "/v1/utaAuth"
const HOSTNAME = "http://localhost:3000"
export class TOKEN {
   static token  = ''
   static token_error = false
}


export async function axiosFn(type, data, first, second, third, id='', limit='', page='',offset='' ) {
 
  let path = Base_URL;
    if(id!=='') 
      path = path+"/"+id
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Expose-Headers' : 'X-Total-Count',
        'Authorization':'Bearer ' + TOKEN.token ,
        'first': encodeURIComponent(first),
        'second': second,
        'third': encodeURIComponent(third)
      }
      try {
          if(type==='post'||type==='put') 
          return await axios[type](path, data, {
            headers: headers
          })
          else if (limit!=='' &&  page!=='' )
          return await axios[type](path,  {
            headers: headers,
            params: {
              _limit: limit,
              _page: page-1,
              _offset: offset
            }
        }) 
        else
        return await axios[type](path,  {
          headers: headers
      }) 
      } catch (e) {
      if(e.toString().indexOf('status code 401')!= -1)
      {
        localStorage.removeItem('isAuth')
        localStorage.removeItem('token')
        TOKEN.token = ""
        // let href = window.location.href.toString() || ''
        // console.log('href.indexOf(login)', href.indexOf('login'));
        // if(href.indexOf('login') == -1)
        // window.location = HOSTNAME + "#/login"
      }
      return [{error: e}]
  }   

}

export async function axiosFnUpload(file, id ) {
  let path = Base_URL + '/upload'
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Authorization':'Bearer ' + TOKEN.token ,
      }
      try {
        let data = new FormData();
        data.append('file', file)
        data.append('FileName', file.name)
        //data.append('fileFile', file.name)
          return await axios.post(path, data, {
            headers: headers,
            params: {
              id: id
            }
          })
          
      } catch (e) {
        if(e.toString().indexOf('status code 401')!= -1)
        {
        localStorage.removeItem('isAuth')
        localStorage.removeItem('token')
        TOKEN.token = ""
        }
        return [{error: e}]
  }   
}
export async function axiosFnEmail(ToEmail, Subject, Body ) {
    let path = Base_URL_Email
      const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Authorization':'Bearer ' + TOKEN.token ,
        }
        try {
          let data = new FormData();
          data.append('ToEmail', ToEmail)
          data.append('Subject', Subject)
          data.append('Body', Body)
            return await axios.post(path, data, {
              headers: headers
            })
            
        } catch (e) {
          if(e.toString().indexOf('status code 401')!= -1)
          {
          localStorage.removeItem('isAuth')
          localStorage.removeItem('token')
          TOKEN.token = ""
          }
          return [{error: e}]
    } 
}
export async function axiosFnLogin(username, password ) {
  let path = Base_URL_LOGIN
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      }
      try {
        let data = new Object()
        data.username = username
        data.password =  password
          return await axios.post(path, data, {
            headers: headers
          })
          
      } catch (e) {
      console.log(e)
      return [{error: e}]
  } 
}