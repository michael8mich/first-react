
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