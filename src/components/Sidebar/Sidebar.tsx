import {FC, useContext} from "react"

import cl from "./Sidebar.module.sass"
import { observer } from "mobx-react-lite"

export interface ISidebarProp {
    title: string 
    cb: () => void
}

interface ISidebarProps {
    title: string
    props: ISidebarProp[]
}

const Sidebar: FC<ISidebarProps> = ({props, title}) => {

    return (
        <div className={cl.SidebarWrapper}>
            <div className={cl.SidebarProps}>
                {
                    props.map(el => {
                        return (
                            <button key={el.title} className={`btn ${cl.SidebarProp}`} onClick={el.cb}>
                                {
                                    el.title
                                }
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default observer(Sidebar)