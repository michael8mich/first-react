import { SelectOption } from "./ISearch";

export interface IObject {
    id: string
    name: string
}
export interface IAttachment {
    id: string
    name: string
    object: SelectOption | string
    factory: string
    active: number
    file_name: string
    folder: string
    last_mod_by: SelectOption | string
    last_mod_dt: string
    create_date: string
}

