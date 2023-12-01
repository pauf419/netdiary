import { FC, useState, useContext, useEffect } from "react";
import { IModalLog } from "../../models/IModalLog";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import cl from "./LogModal.module.sass"

const LogModal: FC = () => {
    const [active, setActive] = useState<boolean>(false)
    const [lastTimeout, setLastTimeout] = useState<any>(null)

    const {store} = useContext(Context)

    useEffect(() => {
        if(!store.activeLog) return;
        setActive(true)
        clearTimeout(lastTimeout)
        setLastTimeout(setTimeout(() => setActive(false), 2000))
    }, [store.activeLog])


    return (
        <div className={`${cl.LogModalWrapper} ${active ? cl.LogModalActive : cl.LogModalInactive}`}>
            <div className={cl.MessageWrapper}>
                {
                    store.activeLog?.message
                }
            </div>
            <div className={cl.IconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
                </svg>
            </div>
        </div>
    )
}

export default observer(LogModal)