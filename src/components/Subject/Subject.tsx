import {FC, useContext, useState} from 'react'
import { ISubject } from '../../models/ISubject'
import { observer } from 'mobx-react-lite'
import cl from "./Subject.module.sass"
import { Context } from '../..'
import FileInput from '../FileInput/FileInput'

interface IProps {
    subject: ISubject
    onUpdate: (ubject:ISubject) => void
    onRemove: (id:string) => void
}

const Subject: FC<IProps> = ({subject, onUpdate, onRemove}) => {

    const {store} = useContext(Context)

    return (
        <div className={cl.SubjectWrapper}>
            <div className={cl.SubjectStats} 
                style={
                    {
                        backgroundPosition: "center center",
                        backgroundRepeat: "none",
                        backgroundSize: "cover",
                        backgroundImage: "url(" + subject.banner + ")"
                    }
                }
            >
                <div className={cl.SubjectStat}>
                    <div className={cl.StatPrefix}>
                        title: 
                    </div>
                    <div className={cl.StatValue}>
                        {subject.title}
                    </div>
                </div>
                <div className={cl.SubjectStat}>
                    <div className={cl.StatPrefix}>
                        description: 
                    </div>
                    <div className={cl.StatValue}>
                        {subject.description}
                    </div>
                </div>
            </div>
            <div className={cl.SubjectAction}>
                <button className="btn-mini" onClick={() => onUpdate(subject)}>
                    update
                </button>
                <button className="btn-mini" onClick={() => onRemove(subject.id)}>
                    delete
                </button>
            </div>
        </div>
    )
}

export default observer(Subject)