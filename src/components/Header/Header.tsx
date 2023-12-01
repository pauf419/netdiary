import { FC, useContext, useRef, useEffect } from "react";
import cl from "./Header.module.sass"
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../..";

const Header: FC = () => {

    const {store} = useContext(Context)
    const ref = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(()=>{
        store.headerHeight = ref.current?.offsetHeight!
    })
    
    return (
        <div className={cl.HeaderWrapper} ref={ref}>
            <div className={cl.HeaderLogo}>
                Xl№150
            </div>
            <div className={cl.HeaderAction}>
            <   div className={cl.HeaderActionLink}>
                    <Link to="/schedule">schedule</Link>
                </div>
                <div className={cl.HeaderActionLink}>
                    <Link to="/dashboard">dash</Link>
                </div>
                <div className={cl.HeaderActionLink}>
                    <Link to="/subject">subject</Link>
                </div>
                <div className={cl.HeaderActionLink}>
                    <Link to="/classroom">classroom</Link>
                </div>
            </div>
            <div className={cl.HeaderAuth}>
                <button className={`btn ${cl.HeaderAuthBtn}`} onClick={async () => {
                    await store.logout()
                    navigate("/login")
                    
                }}>
                    logout
                </button>
            </div>
        </div>
    )
}

export default observer(Header)