import $api from "../http";
import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import { HttpResponse } from "../models/response/HttpResponse";
import { IRegsession } from "../models/IRegsession";
import { RegistrationResponse } from "../models/response/RegistrationResponse";
import { TernaryResponse } from "../models/response/TernaryResponse";
import { IClassroom } from "../models/IClassroom";

export default class ClassroomService {

    static async createClassroom(level:string,prefix:string,title:string): Promise<AxiosResponse<HttpResponse<IClassroom>>> {
        return $api.post<HttpResponse>("/crud/classroom", {level, prefix, title})
    }

    static async getClassrooms(): Promise<AxiosResponse<HttpResponse<IClassroom[]>>> {
        return $api.get<HttpResponse>("/crud/classroom")
    }

    static async updateClassroom(config:IClassroom): Promise<AxiosResponse<HttpResponse<IClassroom>>> {
        return $api.post<HttpResponse>("/crud/classroom/u", {...config})
    }

    static async removeClassroom(id:string): Promise<AxiosResponse<HttpResponse<IClassroom>>> {
        return $api.post<HttpResponse>("/crud/classroom/d", {id})
    }

    static async getClassroomById(id:string): Promise<AxiosResponse<HttpResponse<IClassroom>>> {
        return $api.get<HttpResponse>("/crud/classroom/id", {
            params: {
                id
            }
        })
    }

}

 