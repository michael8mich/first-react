export interface IUtil {
    id: string
    name: string
    type: string
    active: number
    code: string
}
export interface IFilter {
    text: string,
    value: string
  }
export interface AlertPrp {
    type?: 'success' | 'info' | 'warning' | 'error',
    message: string,
    closable: boolean ,
    showIcon: boolean ,
    visible: boolean,
    autoClose: number  
  }  