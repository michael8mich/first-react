import moment from "moment";
export const SELECT = "__s__"
export const FROM = "__f__"
export const WHERE = "__w__"

export const DATETIMEFORMAT = "DD/MM/YYYY HH:mm"
function isBoolean(val:any) {
    return val === false || val === true;
 }
export const searchFormWhereBuild = (values: any, fastSearchArray: string[] = []) => {
    
      let where = ''
      Object.keys(values).map(v => {
        if(values[v] && v !== 'fast_search') 
        {
            if(values[v] === true)
            where += (where.length !==0 ? " AND " : "" ) + " " + v + " = " + (values[v] ? 1 : 0 )
            else 
            if(Array.isArray(values[v]))
            {
            let arr_w = ""
            values[v].map( (a: { value: string; }, index: number) => {
              arr_w += "'" + a.value.replace("'", "''") + "'" + (values[v].length-1 !== index ? ' , ' : '')
            })
            if(arr_w.length !== 0) {
              where += (where.length !==0 ? " AND " : "" ) + " " + v + " IN (" + arr_w + ")"
            }
            } else
            if(values[v] instanceof Object )
            where += (where.length !==0 ? " AND " : "" ) + " " + v + " = '" + values[v].value.replace("'", "''") + "'"
            else
            where += (where.length !==0 ? " AND " : "" ) + " " + v + " like N'%" + values[v].replace("'", "''") + "%'"

        }
      })
      if(fastSearchArray.length !== 0 && values.fast_search)
      {
        let fastSearchWhere = ''
        fastSearchArray.map(v=> {
            fastSearchWhere += (fastSearchWhere.length !==0 ? " OR " : "" ) + " " + v + " like N'%" + values.fast_search.replace("'", "''") + "%'"
        })
        if(where.length!==0)
        where = ' ( ' + where + ' ) AND ' + ' ( ' +  fastSearchWhere + ' ) '
        else
        where = ' ( ' +  fastSearchWhere + ' ) '
       }
    return where ? ' ( ' + where + ' ) ' : ''
}

export const saveFormBuild = (values: any) => { 
  Object.keys(values).map(v => {
    let val = values[v] || ''
        if(val === true || val === false )
        values[v]  = val  ? 1 : 0 
        else 
        if(Array.isArray(val))
        {
        //  delete values[v]
        // let arr_w = ""
        // values[v].map( (a: { value: string; }, index: number) => {
        //   arr_w += "'" + a.value.replace("'", "''") + "'" + (values[v].length-1 !== index ? ' , ' : '')
        // })
        // if(arr_w.length !== 0) {
        //   where += (where.length !==0 ? " AND " : "" ) + " " + v + " IN (" + arr_w + ")"
        // }
        } else
        if(val instanceof Object )
        values[v]  = val.value
        else
        values[v]  = val.toString().replace(/'/g, "''") 
  })
  
return values
}
export const saveFormBuildMulti = (values: any, pre_values: any ) => {
  let values_ret =  {} as any 
  Object.keys(values).map(v => {
    let val = values[v] || ''
    let pre_val = pre_values[v] || ''
        if(Array.isArray(val))
        {
              let arr_w: any[] = []
              const is_new = Object.entries(pre_values).length === 0
              if(is_new || pre_val==='')
              {
                  //insert
                  val.map( obj => {
                    arr_w.push({ value: obj.value, status: true, code: '' } )
                  })
              }
              else // exist 
              {
                  //insert
                  val.map( obj => {
                    let if_not_in_old = !pre_val.find((pre_val: { value: any; }) => pre_val.value === obj.value )
                    if(if_not_in_old)
                    arr_w.push({ value: obj.value, status: true, code: '' } )
                  })
                  //delete
                  pre_val.map( (pre_val: { value: any; code:any }) => {
                    let if_not_in_new = !val.find((obj: { value: any; code:any }) => pre_val.value === obj.value ) 
                    if(if_not_in_new)
                    arr_w.push({ value: pre_val.value, status: false, code: pre_val.code } )
                  })
              }
              if(arr_w.length !== 0) {
                values_ret[v] = arr_w
              }
              
        }
  })
  
return values_ret
}
export const uTd = (value:any) => {
  const v:number = value
   if( v!==0 )
   return  moment.unix(value).format(DATETIMEFORMAT) 
   else
   return ''
}
export const nowToUnix = () => {
   return moment().unix()
}
