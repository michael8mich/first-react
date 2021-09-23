import axios from 'axios'
const Base_URL = "https://localhost:44367/v1/qtrm"

export async function axiosFn(type, data, first, second, third, id='', limit='', page='',offset = '' ) {
  let path = Base_URL;
    if(id!=='') 
      path = path+"/"+id
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Expose-Headers' : 'X-Total-Count',
        'first': first,
        'second': second,
        'third': third
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