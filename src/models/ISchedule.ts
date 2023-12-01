import { IParticipant } from "./IParticipant";
import { IScheduleSubject } from "./IScheduleSubject";

export interface ISchedule {
    classroom: string
    participants?: IParticipant[]
    mon: IScheduleSubject[]
    tue: IScheduleSubject[]
    wed: IScheduleSubject[]
    thu: IScheduleSubject[] 
    fri: IScheduleSubject[]
    sat: IScheduleSubject[]
    sun: IScheduleSubject[]
}