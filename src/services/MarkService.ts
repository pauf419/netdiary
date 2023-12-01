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
import { IMark } from "../models/IMark";
export default class MarkService {

    static async getMarks(classroom:string, time:string): Promise<AxiosResponse<HttpResponse<IMark[]>>> {
        return $api.get("/crud/mark", {
            params: {
                classroom,
                time,
            }
        })
    }

    static async createMark(refer:string, classroom:string,subject:string,time:string,value:string, index:number): Promise<AxiosResponse<HttpResponse<IMark>>> {
        return $api.post("/crud/mark", {
            refer, 
            classroom, 
            subject,
            value,
            time,
            index
        })
    }
}