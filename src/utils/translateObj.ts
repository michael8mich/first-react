
export const translateObj = (objects_: any[], IObjects:string[]) => {
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