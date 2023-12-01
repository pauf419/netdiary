import { ISubject } from "./ISubject"

export interface IScheduleSubject {
    id: string 
    subject: ISubject 
    index: number
    day: string 
    time: string 
    description:string
}