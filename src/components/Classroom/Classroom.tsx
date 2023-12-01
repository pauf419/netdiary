import {FC, useContext} from 'react'
import { IClassroom } from '../../models/IClassroom'
import { observer } from 'mobx-react-lite'
import cl from "./Classroom.module.sass"
import { Context } from '../..'

interface IProps {
    classroom: IClassroom
    onUpdate: (classroom:IClassroom) => void
    onRemove: (id:string) => void
}

const Classroom: FC<IProps> = ({classroom, onUpdate, onRemove}) => {

    const {store} = useContext(Context)

    return (
        <div className={cl.ClassroomWrapper}>
            <div className={cl.ClassroomStats}>
                <div className={cl.ClassroomStat}>
                    <div className={cl.StatPrefix}>
                        title: 
                    </div>
                    <div className={cl.StatValue}>
                        {classroom.title}
                    </div>
                </div>
                <div className={cl.ClassroomStat}>
                    <div className={cl.StatPrefix}>
                        level: 
                    </div>
                    <div className={cl.StatValue}>
                        {classroom.level}
                    </div>
                </div>
                <div className={cl.ClassroomStat}>
                    <div className={cl.StatPrefix}>
                        prefix: 
                    </div>
                    <div className={cl.StatValue}>
                        {classroom.prefix}
                    </div>
                </div>
            </div>
            <div className={cl.ClassroomAction}>
                <button className="btn-mini" onClick={() => onUpdate(classroom)}>
                    update
                </button>
                <button className="btn-mini" onClick={() => onRemove(classroom.id)}>
                    delete
                </button>
            </div>
        </div>
    )
}

export default observer(Classroom)