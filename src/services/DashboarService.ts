import $api from "../http";
import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import { HttpResponse } from "../models/response/HttpResponse";
import { IRegsession } from "../models/IRegsession";
import { RegistrationResponse } from "../models/response/RegistrationResponse";
import { TernaryResponse } from "../models/response/TernaryResponse";
import { IClassroom } from "../models/IClassroom";
import { ISchedule } from "../models/ISchedule";
import { IScheduleSubject } from "../models/IScheduleSubject";
export default class ScheduleService {

    static async getSchedule(classroom:string): Promise<AxiosResponse<HttpResponse<ISchedule>>> {
        return $api.get<HttpResponse>("/crud/schedule", {
            params: {
                classroom
            }
        })
    }

    static async removeScheduleSubject(id:string): Promise<AxiosResponse<HttpResponse<IScheduleSubject>>> {
        return $api.post<HttpResponse>("/crud/schedule/d", {id})
    }

    static async createScheduleSubject(
        classroom:string, 
        subject:string, 
        index:string,
        day:string,
        time:string, 
        description:string
    ): Promise<AxiosResponse<HttpResponse<IScheduleSubject>>> {
        return $api.post<HttpResponse>("/crud/schedule", {
            classroom,
            subject,
            index,
            day,
            time,
            description
        })
    }

}