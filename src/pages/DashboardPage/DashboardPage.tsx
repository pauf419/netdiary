import React, {FC, useContext, useEffect, useState, useRef} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import cl from "./DashboardPage.module.sass" 
import ClassroomSelector from '../../components/ClassroomSelector/ClassroomSelector';
import { IClassroom } from '../../models/IClassroom';
import { format } from 'path';
import Calendar from 'react-calendar';
import Modal from '../../components/Modal/Modal';
import { ISchedule } from '../../models/ISchedule';
import ScheduleService from '../../services/ScheduleService';
import { IScheduleSubject } from '../../models/IScheduleSubject';
import ClassroomService from '../../services/ClassroomService';
import MarkService from '../../services/MarkService';
import { IMark } from '../../models/IMark';
import { Link } from 'react-router-dom';


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface IProps {
    cb:(v:string) => void
    defaultValue: string
}

const TimeoutInput:FC<IProps> = ({cb, defaultValue}) => {

    const [lastTimeout, setLastTimeout] = useState<any>()

    const changeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(lastTimeout)
        const timeout = setTimeout(() => e.target.value !== "" && cb(e.target.value), 1000)
        setLastTimeout(timeout)
    }

    return (
        <input className={cl.MarkInput} placeholder="o" defaultValue={defaultValue ? defaultValue : ""} onChange={changeHandler}/>
    )
}


const DashboardPage: FC = () => {
    const {store} = useContext(Context);    
    const [classroom, setClassroom] = useState<IClassroom|null>(null)
    const [value, onChange] = useState<Value>(new Date());
    const [modalActive, setModalActive] = useState<boolean>(false)
    const [schedule, setSchedule] = useState<any|null>(null)
    const [currentScheduleDay, setCSD] = useState<string>("")
    const [currentSchedule, setCS] = useState<any>([])
    const [marks,setMarks] = useState<IMark[]>([])
    const [rowW, setRW] =useState<number>(80)
    const [blurerActive, setBlurerActive] = useState<boolean>(false)

    const formatDate = (): string => {
            const months = [
              'Jany', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
          
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const date = new Date()
          
            const month = months[date.getMonth()];
            const dayOfWeek = days[date.getDay()];
            const dayOfMonth = date.getDate();
          
            return `${dayOfWeek}/${month}/${dayOfMonth}`;
    }

    const handleDateSelect = (value:Value, event:React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {

        const split = value?.toString().split(" ")
        const el = [split![0], split![1], split![2]].join("/")
        localStorage.setItem("dashboard_time", el)
        setCSD(split![0])
        setModalActive(false)

        if(!schedule && !localStorage.getItem("dashboard_classroom")) {
            return;
        }
        if(!schedule[split![0].toLowerCase()].length) setBlurerActive(true)
        setCS(schedule[split![0].toLowerCase()])
        getMarks()
    }

    const updateCS = (schedule:any) => {
        if(!localStorage.getItem("dashboard_time")) localStorage.setItem("dashboard_time", formatDate())
        const day = currentScheduleDay ? currentScheduleDay : localStorage.getItem("dashboard_time")
        if(!schedule[day!.toLowerCase().split("/")[0]].length) setBlurerActive(true)
        setCS(schedule[day!.toLowerCase().split("/")[0]])
        setCSD(day!.split("/")[0])
    }

    const loadSchedule = async () => {
        const response = await ScheduleService.getSchedule(classroom!.id)
        setSchedule(response.data.data)
        updateCS(response.data.data)
    }

    const loadConfigFromHistory = async () => {
        if(!localStorage.getItem("dashboard_time")) localStorage.setItem("dashboard_time", formatDate())
        const response = await ScheduleService.getSchedule(localStorage.getItem("dashboard_classroom")!)
        const classroom = await ClassroomService.getClassroomById(localStorage.getItem("dashboard_classroom")!)
        setClassroom(classroom.data.data)
        setSchedule(response.data.data)
        updateCS(response.data.data)
    }

    const saveMark = async(mark:string, subject:string, refer:string, index:number) => {
        const response = await MarkService.createMark(refer, classroom?.id!, subject, localStorage.getItem("dashboard_time")!, mark, index)
    }

    const getMarks = async() => {
        const response = await MarkService.getMarks(classroom!.id, localStorage.getItem("dashboard_time") ? localStorage.getItem("dashboard_time")! : formatDate())
        setMarks(response.data.data)
    }

    const getRowMark = (subject:string,refer:string, index:number): IMark => {
        for(var i=0;i < marks.length;i++) {
            if(
                marks[i].classroom === classroom!.id && 
                marks[i].time === localStorage.getItem("dashboard_time")! &&
                marks[i].subject === subject && 
                marks[i].refer === refer &&
                marks[i].index === index
            ) return marks[i]
        }

        return {} as IMark
    }

    useEffect(() => {
        if(!classroom) return;
        getMarks()
        loadSchedule()
        localStorage.setItem("dashboard_classroom", classroom!.id)
    }, [classroom])

    useEffect(() => {
        if(localStorage.getItem("dashboard_classroom")) loadConfigFromHistory()
        if(localStorage.getItem("dashboard_time")) setCSD(localStorage.getItem("dashboard_time")!)
    }, [])


    return (
        <div className={cl.DashboardPageWrapper}>
            <div className={`${cl.Blurer} ${blurerActive ? cl.Active : cl.Inactive}`}> 
                <div>
                    No schedule found for the selected day. You can <Link to="/schedule"><span className={cl.AStyled}>create</span></Link> one or choose another day.
                </div>
                <button className="btn" onClick={() => setBlurerActive(false)}>
                    Ok
                </button>
            </div>
            <Modal

                onClose={() => setModalActive(false)}
                state={modalActive}
                title='Select day'
            >
                <Calendar onChange={handleDateSelect} value={value} />
            </Modal>
            <div className={cl.DashboardHeader} style={{
                    height: (!currentSchedule.length) ? window.innerHeight - store.headerHeight : "auto"
                }}>
                <div className={cl.HeaderElementWrapper}>
                    <div className={cl.ElementTitle}>
                        observing classroom: 
                    </div>
                    <div className={cl.ElementValue}>
                        <ClassroomSelector pre={classroom!} onSelect={setClassroom}/>
                    </div>
                </div>
                <div className={cl.HeaderElementWrapper}>
                    <div className={cl.ElementTitle}>
                        observing timestamp: 
                    </div>
                    <div className={cl.ElementValue}>
                        <button className="btn" onClick={() => setModalActive(true)}>
                            {currentScheduleDay ? localStorage.getItem("dashboard_time") : "Select timestamp"}
                        </button>
                    </div>
                </div>
            </div>
            {
                (currentSchedule.length &&  currentScheduleDay)?
                    <div className={cl.DashboardTableWrapper}>
                        <div className={cl.TableHeader}>
                            <div className={cl.SpacerContainer}>
                                <div className={cl.TableColumnHeaderSpacer} style={{
                                    width: rowW,
                                }}>
                                </div>
                            </div>
                            
                            {
                                currentSchedule.map((el:any) => {
                                    return (
                                        <div key={el.id} className={cl.TableColumnHeader}>
                                            {
                                                el.subject.title
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={cl.TableBody}>
                            {
                                schedule?.participants!.map((el:any) => {
                                    return (
                                        <div key={el.id} className={cl.TableRowElement}>
                                            <div className={cl.RowRefer}>
                                                <div style={{
                                                minWidth: rowW!==0 ? rowW : "auto"
                                            }}>{el.firstname}</div>
                                                <div>{el.lastname}</div>
                                            </div>
                                            <div className={cl.TableRowContent}>
                                                {
                                                    currentSchedule?.map((e:any, i:number) => {
                                                        return (
                                                            <div key={e.id} className={cl.TableRowMark}>
                                                                <TimeoutInput defaultValue={getRowMark(e.subject.id, el.id, i).value} cb={(value:string) => saveMark(value, e.subject.id, el.id, i)}/>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>  
                                    )
                                })
                            }
                        </div>
                    </div>
                :
                ""
            }
        </div>
    )
};

export default observer(DashboardPage);