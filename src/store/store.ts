import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
import { HttpResponse } from "../models/response/HttpResponse";
import { IModalLog } from "../models/IModalLog";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;
    regsessionStatus = false;
    activeLog: IModalLog | null = null;
    headerHeight: number = 0

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    updateLog(status:number, message:string) {
        this.activeLog = {
            status,
            message
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.data.user);
            this.updateLog(response.status, response.data.msg!)
        } catch (e) {
            console.error(e);
        }
    }

    async registration(email: string, password: string, username: string): Promise<boolean> {
        try {
            const response = await AuthService.registration(email, password, username);
            localStorage.setItem("regsession", response.data.data.session.id)
            localStorage.setItem("regsession_payload", response.data.data.session.email)
            this.updateLog(response.status, response.data.msg!)
            this.regsessionStatus = true
            return true
        } catch (e) {
            console.error(e);
            return false
        }
    }

    async verify(code:string) {
        try {
            const response = await AuthService.verify(localStorage.getItem("regsession")!, code);
            localStorage.setItem('token', response.data.data.accessToken);
            localStorage.removeItem("regsession")
            localStorage.removeItem("regsession_payload")
            this.regsessionStatus = false
            this.setAuth(true);
            this.setUser(response.data.data.user);
            this.updateLog(response.status, response.data.msg!)
        } catch (e) {
            console.error(e);
        }
    }

    async destroyRegsession() {
        const response = await AuthService.destroyRegsession(localStorage.getItem("regsession")!)
        localStorage.removeItem("regsession")
        localStorage.removeItem("regsession_payload")
        this.regsessionStatus = false
        this.updateLog(response.status, response.data.msg!)
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.error(e);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<HttpResponse<AuthResponse>>(`${API_URL}/auth/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.data.user);
        } catch (e) {
            console.error(e)
        } finally {
            this.setLoading(false);
        }
    }
}
