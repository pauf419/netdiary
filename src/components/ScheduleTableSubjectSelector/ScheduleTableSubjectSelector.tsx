import {useEffect, useState, FC} from 'react'
import { IScheduleSubject } from '../../models/IScheduleSubject'
import { ISubject } from '../../models/ISubject'
import SubjectService from '../../services/SubjectService'
import cl from './ScheduleTableSubjectSelector.module.sass'

interface IProps {
    onSelect: (e:ISubject, description:string, time:string) => void
}

const ScheduleTableSubjectSelector: FC<IProps> = ({onSelect}) => {

    const [subjects, setSubjects] = useState<ISubject[]>([])
    const [selected, setSelected] = useState<ISubject| null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(false)
    const [description, setDescription] = useState<string>("")
    const [time, setTime] = useState<string>("")
    const [keys, setKeys] = useState<string>("")

    const loadSubjects = async() => {
        setLoading(true)
        try {
            const response = await SubjectService.getSubjects()
            setSubjects(response.data.data)
        } catch(e) {
            console.error(e) 
        }
        setLoading(false)
    }

    const handleSelect = (subject:ISubject) => {
        setSelected(subject)
        setActive(false)
    }

    const upload = () => {
        onSelect(selected!, description, time)
        setSelected(null)
        setTime("")
        setDescription("")
        setKeys(`${Math.random()} ${Math.random()}`)
    }

    useEffect(() => {
        loadSubjects()
    }, [])

    return (
        <div className={cl.SubjectSelectorWrapper}>
            <div className={cl.SubjectSelectorContent}>
                <div className={cl.Cont1}>
                    <div className={`${cl.SubjectSelectorHeader}`} onClick={() => setActive(!active)}>
                        {
                            selected 
                                ?
                                selected.title 
                                : 
                                "Select subject"
                        }
                        <div className={`${cl.SubjectSelectorBody} ${active ? cl.Active : ""}`}>
                            {
                                subjects.filter(el => el.id !== selected?.id).map(el => {
                                    return (
                                        <button key={el.id} className={`btn ${cl.SubjectSelectorElement}`} onClick={() => handleSelect(el)}>
                                            {el.title}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <input 
                        className={`${cl.SubjectSelectorInput} ${cl.SubjectSelectorDescription}`}
                        key={keys.split(" ")[0]}
                        defaultValue={description}
                        placeholder='Enter description'
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className={cl.Cont2}>
                    <input 
                        className={cl.SubjectSelectorInput}
                        key={keys.split(" ")[1]}
                        defaultValue={time}
                        onChange={e => setTime(e.target.value)}
                        placeholder='Enter time'
                    />
                    <button className={`${cl.SaveBtn} ${time !== "" && description !== "" && selected && cl.Visible}`} onClick={() => upload()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M12 2h-2v3h2z"/>
                            <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>
                        </svg>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ScheduleTableSubjectSelector