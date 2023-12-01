import { FC, useEffect, useState } from "react";
import { IClassroom } from "../../models/IClassroom";
import cl from "./ClassroomSelector.module.sass"
import ClassroomService from "../../services/ClassroomService";

interface IProps {
    onSelect: (element:IClassroom) => void
    pre?: IClassroom
}

const ClassroomSelector: FC<IProps> = ({onSelect, pre}) => {


    const [classrooms, setClassrooms] = useState<IClassroom[]>([])
    const [selected, setSelected] = useState<IClassroom | null>(pre ? pre : null)
    const [loading, setLoading] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(false)

    const loadClassrooms = async() => {
        setLoading(true)
        try {
            const response = await ClassroomService.getClassrooms()
            setClassrooms(response.data.data)
        } catch(e) {
            console.error(e) 
        }
        setLoading(false)
    }

    const handleSelect = (classroom:IClassroom) => {
        setSelected(classroom)
        setActive(false)
        onSelect(classroom)
    }

    useEffect(() => {
        loadClassrooms()
    }, [])

    useEffect(() => {
        if(selected === null) setSelected(pre!)
    }, [pre])
    
    return (
        <div className={cl.ClassroomSelectorWrapper}>
            <button className={`btn ${cl.ClassroomSelectorHeader}`} onClick={() => setActive(!active)}>
                {
                    selected 
                        ?
                        `${selected.level} - ${selected.prefix}`
                        :
                        "Select classroom"
                }
            </button>

            <div className={`${cl.ClassroomSelectorBody} ${active ? cl.Active : ""}`}>
                {
                    classrooms.filter(el => el.id !== selected?.id).map(el => {
                        return (
                            <button key={el.id} className={`btn ${cl.ClassroomSelectorElement}`} onClick={() => handleSelect(el)}>
                                {el.level} - {el.prefix}
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ClassroomSelector