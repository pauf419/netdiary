import $api from "../http";
import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import { HttpResponse } from "../models/response/HttpResponse";
import { IRegsession } from "../models/IRegsession";
import { RegistrationResponse } from "../models/response/RegistrationResponse";
import { TernaryResponse } from "../models/response/TernaryResponse";
import { IClassroom } from "../models/IClassroom";
import { ISubject } from "../models/ISubject";

export default class SubjectService {
    static async createSubject(title:string, description:string): Promise<AxiosResponse<HttpResponse<ISubject>>> {
        return $api.post<HttpResponse>("/crud/subject", {title, description})
    }

    static async getSubjects(): Promise<AxiosResponse<HttpResponse<ISubject[]>>> {
        return $api.get<HttpResponse>("/crud/subject")
    }

    static async updateSubject(data:any): Promise<AxiosResponse<HttpResponse<ISubject>>> {
        return $api.post<HttpResponse>('/crud/subject/u', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    static async removeSubject(id:string): Promise<AxiosResponse<HttpResponse<ISubject>>> {
        return $api.post<HttpResponse>("/crud/subject/d", {id})
    }

}

 