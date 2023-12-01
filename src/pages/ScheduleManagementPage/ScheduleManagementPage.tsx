import React, {FC, useContext, useState, useEffect, useRef} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import cl from "./ScheduleManagementPage.module.sass"
import ClassroomSelector from '../../components/ClassroomSelector/ClassroomSelector';
import { IClassroom } from '../../models/IClassroom';
import { ISchedule } from '../../models/ISchedule';
import ScheduleService from '../../services/ScheduleService';
import ScheduleTableSubject from '../../components/ScheduleTableSubject/ScheduleTableSubject';
import { IScheduleSubject } from '../../models/IScheduleSubject';
import ScheduleTableSubjectSelector from '../../components/ScheduleTableSubjectSelector/ScheduleTableSubjectSelector';
import { ISubject } from '../../models/ISubject';
import ClassroomService from '../../services/ClassroomService';

const ScheduleManagementPage: FC = () => {
    const {store} = useContext(Context);
    const [classroom, setClassroom] = useState<IClassroom|null>(null)
    const [schedule, setSchedule] = useState<ISchedule|null>(null)
    const ref = useRef<HTMLDivElement>(null)
    const [refHeight, setRefHeight] = useState<number>(0)

    const loadSchedule = async (classroom:string) => {
        const response = await ScheduleService.getSchedule(classroom) 
        setSchedule(response.data.data)
    }

    const reconstructSchedule = (type: string, data:any) => {
        setSchedule((prev) => {
            if (!prev) return null
            const updatedSchedule = { ...prev };
            switch (data.day) {
                case 'Mon':
                    switch(type) {
                        case "remove": 
                            updatedSchedule.mon = updatedSchedule.mon.filter(el => el.id !== data.id)
                            break
                        case "push": 
                            updatedSchedule.mon.push(data);
                            break

                    }
                    break;
                case 'Tue':
                    switch(type) {
                        case "remove": 
                        updatedSchedule.tue =  updatedSchedule.tue.filter(el => el.id !== data.id)
                            break
                        case "push": 
                            updatedSchedule.tue.push(data);
                            break

                    }
                    break;
                case 'Wed':
                    switch(type) {
                        case "remove": 
                            updatedSchedule.wed = updatedSchedule.wed.filter(el => el.id !== data.id)
                            break
                        case "push": 
                            updatedSchedule.wed.push(data);
                            break

                    }
                    break;
                case 'Thu':
                    switch(type) {
                        case "remove": 
                            updatedSchedule.thu = updatedSchedule.thu.filter(el => el.id !== data.id)
                            break
                        case "push": 
                            updatedSchedule.thu.push(data);
                            break

                    }
                    break;
                case 'Fri':
                    switch(type) {
                        case "remove": 
                            updatedSchedule.fri = updatedSchedule.fri.filter(el => el.id !== data.id)
                            break
                        case "push": 
                            updatedSchedule.fri.push(data);
                            break

                    }
                    break;
                case 'Sat':
                    switch(type) {
                        case "remove": 
                            updatedSchedule.sat = updatedSchedule.sat.filter(el => el.id !== data.id)
                            break
                        case "push": 
                            updatedSchedule.sat.push(data);
                            break

                    }
                    break;
                case 'Sun':
                    switch(type) {
                        case "remove": 
                            updatedSchedule.sun = updatedSchedule.sun.filter(el => el.id !== data.id)
                            break
                        case "push": 
                            updatedSchedule.sun.push(data);
                            break

                    }
                    break;
                default:
                    break;
            }

            return updatedSchedule
        }) 
    }

    const pushScheduleSubject = async (subject:ISubject, day:string, index:string, time:string, description: string) => {
        const response = await ScheduleService.createScheduleSubject(classroom?.id!, subject.id, index, day, time, description)
        reconstructSchedule("push", response.data.data)

    }   

    const removeSubject = async (subject:IScheduleSubject) => {
        const response = await ScheduleService.removeScheduleSubject(subject.id)
        reconstructSchedule("remove", {
            id:subject.id,
            day: subject.day
        })
    }

    const preloadClassroom = async (id:string) => {
        const response = await ClassroomService.getClassroomById(id)
        setClassroom(response.data.data)
    }

    useEffect(() => {
        const _classroom = localStorage.getItem("schedule_classroom")
        if(!_classroom) return;
        preloadClassroom(_classroom)
        loadSchedule(_classroom)
    }, [])

    useEffect(() => {
        setRefHeight(ref.current?.offsetHeight!)
    })

    useEffect(() => {
        if(!classroom) return;
        loadSchedule(classroom.id)
        localStorage.setItem("schedule_classroom", classroom.id)
    }, [classroom])


    return (
        <div className={cl.ScheduleManagementPageWrapper}>
            <div className={cl.ScheduleManagementHeaderWrapper} ref={ref} style={
                !classroom ?{ 
                    height: window.innerHeight - store.headerHeight,
                    position: "absolute",
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    padding: "0",
                    alignItems: "center"
                } :
                {}
            }>
                <div className={cl.HeaderElement}>
                    <div className={cl.ElementPrefix}>
                        Observing classroom:
                    </div>
                    <div className={cl.ElementValue}>
                        <ClassroomSelector pre={classroom!} onSelect={setClassroom}/>
                    </div>
                </div>
            </div>
            <div className={cl.ScheduleTableWrapper}>
                {
                    classroom ? 
                        <>
                            <div className={cl.TableColumn}>
                                <div className={cl.ColumnHeader}>
                                    Monday
                                </div>
                                <div className={cl.ColumnBody}>
                                    {
                                        schedule?.mon.map(el => 
                                            <ScheduleTableSubject
                                                key={el.id} 
                                                subject={el} 
                                                onRemove={removeSubject}
                                            />
                                        )
                                    }
                                    <ScheduleTableSubjectSelector
                                        onSelect={
                                            (e:ISubject, d:string, t:string) => {
                                                pushScheduleSubject(
                                                    e,
                                                    "Mon",
                                                    String(schedule?.mon.length),
                                                    t,
                                                    d
                                                )
                                            }
                                        }
                                    />
                                </div>
                            </div>
                            <div className={cl.TableColumn}>
                                <div className={cl.ColumnHeader}>
                                    Tuesday
                                </div>
                                <div className={cl.ColumnBody}>
                                    {
                                        schedule?.tue.map(el => 
                                            <ScheduleTableSubject 
                                                key={el.id}
                                                subject={el} 
                                                onRemove={removeSubject}
                                            />
                                        )
                                    }
                                    <ScheduleTableSubjectSelector
                                        onSelect={
                                            (e:ISubject, d:string, t:string) => {
                                                pushScheduleSubject(
                                                    e,
                                                    "Tue",
                                                    String(schedule?.mon.length),
                                                    t,
                                                    d
                                                )
                                            }
                                        }
                                    />
                                </div>
                            </div>
                            <div className={cl.TableColumn}>
                                <div className={cl.ColumnHeader}>
                                    Wednesday
                                </div>
                                <div className={cl.ColumnBody}>
                                    {
                                        schedule?.wed.map(el => 
                                            <ScheduleTableSubject 
                                                key={el.id}
                                                subject={el} 
                                                onRemove={removeSubject}
                                            />
                                        )
                                    }
                                    <ScheduleTableSubjectSelector
                                        onSelect={
                                            (e:ISubject, d:string, t:string) => {
                                                pushScheduleSubject(
                                                    e,
                                                    "Wed",
                                                    String(schedule?.mon.length),
                                                    t,
                                                    d
                                                )
                                            }
                                        }
                                    />
                                </div>
                            </div>
                            <div className={cl.TableColumn}>
                                <div className={cl.ColumnHeader}>
                                    Thursday 
                                </div>
                                <div className={cl.ColumnBody}>
                                    {
                                        schedule?.thu.map(el => 
                                            <ScheduleTableSubject
                                                key={el.id} 
                                                subject={el} 
                                                onRemove={removeSubject}
                                            />
                                        )
                                    }
                                    <ScheduleTableSubjectSelector
                                        onSelect={
                                            (e:ISubject, d:string, t:string) => {
                                                pushScheduleSubject(
                                                    e,
                                                    "Thu",
                                                    String(schedule?.mon.length),
                                                    t,
                                                    d
                                                )
                                            }
                                        }
                                    />
                                </div>
                            </div>
                            <div className={cl.TableColumn}>
                                <div className={cl.ColumnHeader}>
                                    Friday
                                </div>
                                <div className={cl.ColumnBody}>
                                    {
                                        schedule?.fri.map(el => 
                                            <ScheduleTableSubject 
                                                key={el.id}
                                                subject={el} 
                                                onRemove={removeSubject}
                                            />
                                        )
                                    }
                                    <ScheduleTableSubjectSelector
                                        onSelect={
                                            (e:ISubject, d:string, t:string) => {
                                                pushScheduleSubject(
                                                    e,
                                                    "Fri",
                                                    String(schedule?.mon.length),
                                                    t,
                                                    d
                                                )
                                            }
                                        }
                                    />
                                </div>
                            </div>
                            <div className={cl.TableColumn}>
                                <div className={cl.ColumnHeader}>
                                    Saturday
                                </div>
                                <div className={cl.ColumnBody}>
                                    {
                                        schedule?.sat.map(el => 
                                            <ScheduleTableSubject 
                                                key={el.id}
                                                subject={el} 
                                                onRemove={removeSubject}
                                            />
                                        )
                                    }
                                    <ScheduleTableSubjectSelector
                                        onSelect={
                                            (e:ISubject, d:string, t:string) => {
                                                pushScheduleSubject(
                                                    e,
                                                    "Sat",
                                                    String(schedule?.mon.length),
                                                    t,
                                                    d
                                                )
                                            }
                                        }
                                    />
                                </div>
                            </div>
                            <div className={`${cl.TableColumn} ${cl.Last}`}>
                                <div className={cl.ColumnHeader}>
                                    Sunday
                                </div>
                                <div className={cl.ColumnBody}>
                                    {
                                        schedule?.sun.map(el => 
                                            <ScheduleTableSubject
                                                key={el.id} 
                                                subject={el} 
                                                onRemove={removeSubject}
                                            />
                                        )
                                    }
                                    <ScheduleTableSubjectSelector
                                        onSelect={
                                            (e:ISubject, d:string, t:string) => {
                                                pushScheduleSubject(
                                                    e,
                                                    "Sun",
                                                    String(schedule?.mon.length),
                                                    t,
                                                    d
                                                )
                                            }
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    :
                    ""
                }
                
            </div>
        </div>
    );
};

export default observer(ScheduleManagementPage);
