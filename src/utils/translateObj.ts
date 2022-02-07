
export const translateObj = (objects_: any[], IObjects:string[]) => {
    if(objects_.length === 0 )
    return objects_
    const keys = Object.keys(objects_[0])
    const found = IObjects.some(r=> keys.indexOf(r) )
    objects_.map(e => {
      const keys = Object.keys(e)
      IObjects.map( i => {
        if(e[i])
         e[i] = { value: e[i], label: e[i+"_name"] }
         delete e[i+"_name"]
      })
    })
    return objects_
}

export const translateObj_event = (objects_: any[], IObjects:string[]) => {
  const keys = Object.keys(objects_[0])
  const found = IObjects.some(r=> keys.indexOf(r) )
  objects_.map(e => {
    const keys = Object.keys(e)
    IObjects.map( i => {
       e[i] = { id: e[i], name: e[i+"_name"] }
       delete e[i+"_name"]
    })
  })
  return objects_
}
export const compareObjects = (obj1: any, obj2: any) => {
  try {
    if(Array.isArray(obj1) && Array.isArray(obj2))
        {
          if(obj1.toString()!==obj2.toString())
          return false
            else
          return true
        } else {
          if(JSON.stringify(obj1)!==JSON.stringify(obj2))
          return false
            else
          return true
        }
    
  } catch (e) {
    return false
  }
  
}