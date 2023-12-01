import { observer } from "mobx-react-lite"
import {FC, useContext, ReactNode } from "react"
import cl from "./Modal.module.sass"

interface IProps {
    state:boolean
    children: ReactNode
    title: string
    onClose: () => void
}

const Modal:FC<IProps> = ({state, children, title, onClose}) => {

    return (
        <div className={`${cl.ModalWrapper} ${state ? cl.ModalActive : cl.ModalInactive}`}>
            <div className={cl.ModalInner}>
                <div className={cl.ModalHeader}>
                    <div className={cl.ModalTitle}>
                        {title}
                    </div>
                    <button className="btn-mini" onClick={() => onClose()}>
                        close
                    </button>
                </div>
                <div className={cl.ModalBody}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default observer(Modal)