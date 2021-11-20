import axios from 'axios'
import FormData from 'form-data'
//----------local
//const SERVER = "https://localhost:44367"
//----------iis
const SERVER = "https://mx/uta50"
const Base_URL = SERVER + "/v1/qtrm"
const Base_URL_Email =  SERVER + "/api/Mail/send"

export async function axiosFn(type, data, first, second, third, id='', limit='', page='',offset='' ) {
  let path = Base_URL;
    if(id!=='') 
      path = path+"/"+id
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Expose-Headers' : 'X-Total-Count',
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
      console.log(e)
      return [{error: e}]
  }   

}

export async function axiosFnUpload(file, id ) {
  let path = Base_URL + '/upload'
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
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
      console.log(e)
      return [{error: e}]
  }   
}
export async function axiosFnEmail(ToEmail, Subject, Body ) {
    let path = Base_URL_Email
      const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
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
        console.log(e)
        return [{error: e}]
    } 
}