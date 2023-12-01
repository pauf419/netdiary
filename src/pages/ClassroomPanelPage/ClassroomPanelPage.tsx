import React, {FC, useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import cl from "./ClassroomPanelPage.module.sass"
import Sidebar from '../../components/Sidebar/Sidebar';
import ClassroomService from '../../services/ClassroomService';
import { IClassroom } from '../../models/IClassroom';
import Classroom from '../../components/Classroom/Classroom';
import Modal from '../../components/Modal/Modal';

const ClassroomPanelPage: FC = () => {
    const {store} = useContext(Context);   
    const [activeTab, setActiveTab] = useState<number>(0)
    const [level, setLevel] = useState<string>("")
    const [prefix, setPrefix] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [classrooms, setClassrooms] = useState<IClassroom[]>([])
    const [modalActive, setModalActive] = useState<IClassroom | null>(null)
    const [createModalActive, setCreateModalActive] = useState<boolean>(false)
    const [randoms, setRandoms] = useState<string>("")

    const saveClassroom = async() => {
        setLevel("")
        setPrefix("")
        setTitle("")
        const response = await ClassroomService.createClassroom(level, prefix, title)
        const classroom:IClassroom = response.data.data
        setClassrooms(prev => {
            return [...prev, classroom]
        })
        setCreateModalActive(false)
        store.updateLog(200, "Classroom successfully created.")
    }

    const updateClassroom = async (id:string) => {
        const response= await ClassroomService.updateClassroom({level, prefix, title, id})
        setClassrooms(prev => {
            return prev.map(el => {
                if(el.id === response.data.data.id) return response.data.data
                return el
            })
        })
        setModalActive(null)
    }

    const removeClassroom = async (id:string) => {
        await ClassroomService.removeClassroom(id) 
        setClassrooms(prev => {
            return prev.filter(el => el.id !== id)
        })
    }

    const loadClassrooms = async() => {
        const response = await ClassroomService.getClassrooms()
        setClassrooms(response.data.data)
    }

    useEffect(() => {
        loadClassrooms()
    }, [])

    useEffect(() => {
        if(!modalActive) return 
        setRandoms(`${Math.random()} ${Math.random()} ${Math.random()}`)
        setLevel(modalActive!.level)
        setPrefix(modalActive!.prefix)
        setTitle(modalActive!.title)
    }, [
        modalActive
    ])

    return (
        <div className={cl.ClassroomPanelPageWrapper}>
            <Modal 
                state={modalActive ? true : false}
                title="Update classroom"
                onClose={() => setModalActive(null)}
            >
                <div className={cl.ModalAction}>
                    <input key={randoms.split(" ")[0]}placeholder="Enter classroom level" defaultValue={modalActive?.level} className="input-modal" onChange={e => setLevel(e.target.value)}/>
                    <input key={randoms.split(" ")[1]} placeholder="Enter classroom prefix" defaultValue={modalActive?.prefix} className="input-modal"  onChange={e => setPrefix(e.target.value)}/>
                    <input key={randoms.split(" ")[2]} placeholder="Enter classroom title" defaultValue={modalActive?.title}  className="input-modal"  onChange={e => setTitle(e.target.value)}/>
                </div>
                <div className={cl.ModalSave}>
                    <button className="btn-mini" onClick={() => updateClassroom(modalActive?.id!)}>
                        save
                    </button>
                </div>
            </Modal>
            <Modal 
                state={createModalActive}
                title="Create classroom"
                onClose={() => setCreateModalActive(false)}
            >
                <div className={cl.ModalAction}>
                    <input placeholder="Enter classroom level" className="input-modal" onChange={e => setLevel(e.target.value)}/>
                    <input placeholder="Enter classroom prefix" className="input-modal" onChange={e => setPrefix(e.target.value)}/>
                    <input placeholder="Enter classroom title" className="input-modal" onChange={e => setTitle(e.target.value)}/>
                </div>
                <div className={cl.ModalSave}>
                    <button className="btn-mini" onClick={() => saveClassroom()}>
                        save
                    </button>
                </div>
            </Modal>
            <div className={cl.SidebarContainer}>
                <Sidebar title="Test" props={
                    [
                        {
                            title: "Create classroom",
                            cb: () => setCreateModalActive(true)
                        }
                    ]
                }/>
            </div>
            <div className={cl.ActionTab}>
                {
                    activeTab===0 &&
                    <div className={cl.ClassroomListWrapper}>
                        {
                            classrooms.map(el => <Classroom key={el.id} classroom={el} onRemove={(id) => removeClassroom(id)} onUpdate={(classroom:IClassroom) => setModalActive(classroom)}/>)
                        }
                    </div>
                }
            </div>
        </div>
    );
};

export default observer(ClassroomPanelPage);
