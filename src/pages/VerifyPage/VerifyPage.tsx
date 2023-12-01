import React, {FC, useContext, useState} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import cl from './VerifyPage.module.sass'

const VerifyPage: FC = () => {
    const [code, setCode] = useState<string>('')
    const {store} = useContext(Context);

    return (
        <div className={cl.VerifyPageWrapper}>
            <div className={cl.VerifyPageTitle}>
                <h1>Verify your email</h1>
                <p>
                verification code sent to <span className={cl.TitleEmail}>{localStorage.getItem("regsession_payload")}</span>
                </p>
            </div>
            <input placeholder="Enter verification code" onChange={e => setCode(e.target.value)}/>

            <div className={cl.VerifyPageAction}>
                <button className="btn" onClick={() => store.verify(code)}>Verify email address</button> 
                <button className="btn" onClick={() => store.destroyRegsession()}>destroy verification session</button>
            </div>
        </div>
    );
};

export default observer(VerifyPage);
