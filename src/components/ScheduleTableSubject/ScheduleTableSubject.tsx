import {FC} from 'react'
import { IScheduleSubject } from '../../models/IScheduleSubject'
import cl from "./ScheduleTableSubject.module.sass"

interface IProps { 
    subject: IScheduleSubject
    onRemove: (e:IScheduleSubject) => void
}

const ScheduleTableSubject:FC<IProps> = ({subject, onRemove}) => {

    return (
        <div className={cl.ScheduleTableSubjectWrapper}>
            <div className={cl.Blurer}>
                <button className={cl.BlurerBtn} onClick={() => onRemove(subject)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                    </svg>
                </button>
            </div>
            <div className={cl.Header}>
                <div className={cl.HeaderTitle}>
                    {subject.subject.title}
                </div>
            </div>
            <div className={cl.Body}>
                <div className={cl.BodyDescription}>
                    {subject.description}
                </div>
                <div className={cl.BodyTime}>
                    {subject.time}
                </div>
            </div>
        </div>
    )
}

export default ScheduleTableSubject