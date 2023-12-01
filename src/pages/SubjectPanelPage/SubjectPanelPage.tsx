import React, {FC, useContext, useState, useEffect} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import cl from "./SubjectPanelPage.module.sass"
import Sidebar from '../../components/Sidebar/Sidebar';
import { ISubject } from '../../models/ISubject';
import SubjectService from '../../services/SubjectService';
import Modal from '../../components/Modal/Modal';
import Subject from '../../components/Subject/Subject';
import FileInput from '../../components/FileInput/FileInput';

const SubjectPanelPage: FC = () => {
    const {store} = useContext(Context);
    const [subjects, setSubjects] = useState<ISubject[]>([])
    const [activeTab, setActiveTab] = useState<number>(0)
    const [createSubjectModalActive, setCreateSubjectModalActive] = useState<boolean>(false)
    const [updateSubjectModalActive, setUpdateSubjectModalActive] = useState<ISubject | null>(null)
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [preloadedFile, setPreloadedFile] = useState<any>(null)

    const savePreloadedFile = (url:string, data:string) => {
        setPreloadedFile(data)
    }

    const createSubject = async () => {
        setTitle("")
        setDescription("")
        const response = await SubjectService.createSubject(title, description)
        setSubjects(prev => {
            return [...prev, response.data.data]
        })
        store.updateLog(200, "Subject successfully created.")
        setCreateSubjectModalActive(false)
    }

    const updateSubject = async (id:string) => {
        const formData = new FormData()
        formData.append("banner", preloadedFile)
        formData.append("title", title)
        formData.append("description", description)
        formData.append("id", id)
        const response = await SubjectService.updateSubject(formData)
        setSubjects(prev => {
            return prev.map(el => el.id === response.data.data.id ? response.data.data : el)
        })
        setUpdateSubjectModalActive(null)
        setPreloadedFile(null)
    }

    const getSubjects = async () => {
        const response = await SubjectService.getSubjects() 
        setSubjects(response.data.data)
    }

    const removeSubject = async (id:string) => {
        const response = await SubjectService.removeSubject(id)
        setSubjects(prev => {
            return prev.filter(el => el.id !== id)
        })
    }

    useEffect(() => {
        getSubjects()
    }, [])

    useEffect(() => {
        if(!updateSubjectModalActive)return 

        setTitle(updateSubjectModalActive.title)
        setDescription(updateSubjectModalActive.description)
    }, [updateSubjectModalActive])

    return (
        <div className={cl.SubjectPanelPageWrapper}>
            <Modal 
                state={updateSubjectModalActive ? true : false}
                title="Update classroom"
                onClose={() => setUpdateSubjectModalActive(null)}
            >
                <div className={cl.ModalAction}>
                    <input 
                        key={updateSubjectModalActive?.id} 
                        placeholder="Enter subject title" 
                        defaultValue={updateSubjectModalActive?.title} 
                        className="input-modal" 
                        onChange={e => setTitle(e.target.value)}
                    />
                    <input 
                        key={updateSubjectModalActive?.description} 
                        placeholder="Enter classroom prefix" 
                        defaultValue={updateSubjectModalActive?.description} 
                        className="input-modal"  
                        onChange={e => setDescription(e.target.value)}
                    />
                    <FileInput key={updateSubjectModalActive?.banner} defaultImg={updateSubjectModalActive?.banner!} onChange={savePreloadedFile}/>
                </div>
                <div className={cl.ModalSave}>
                    <button className="btn-mini" onClick={() => updateSubject(updateSubjectModalActive?.id!)}>
                        save
                    </button>
                </div>
            </Modal>
            <Modal 
                title="Create subject"
                state={createSubjectModalActive}
                onClose={() => setCreateSubjectModalActive(false)}
            >
                <div className={cl.ModalAction}>
                    <input placeholder="Enter subject title" className="input-modal" onChange={e => setTitle(e.target.value)}/>
                    <input placeholder="Enter subject description" className="input-modal" onChange={e => setDescription(e.target.value)}/>
                </div>
                <div className={cl.ModalSave}>
                    <button className="btn-mini" onClick={() => createSubject()}>
                        save
                    </button>
                </div>
            </Modal>
            <div className={cl.SidebarContainer}>
                <Sidebar title="Test" props={
                    [
                        {
                            title: "Create subject",
                            cb: () => setCreateSubjectModalActive(true)
                        }
                    ]
                }/>
            </div>
            <div className={cl.ActionTab}>
                {
                    activeTab===0 &&
                    <div className={cl.ClassroomListWrapper}>
                        {
                            subjects.map(el => <Subject 
                                onRemove={(id:string) => removeSubject(id)} 
                                onUpdate={(subject:ISubject) => setUpdateSubjectModalActive(subject)}
                                subject={el}
                                key={el.id}
                            />
                                
                            )
                        }
                    </div>
                }
            </div>
        </div>
    );
};

export default observer(SubjectPanelPage);
