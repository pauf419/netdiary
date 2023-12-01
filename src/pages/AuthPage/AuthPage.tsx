import React, {FC, useContext, useState} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import { Link, useNavigate } from 'react-router-dom';
import cl from "./AuthPage.module.sass"

interface Props {
    login: boolean
}

const AuthPage: FC<Props> = ({login}) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const {store} = useContext(Context);

    const navigate = useNavigate()

    const onSubmitRegistration = async (): Promise<void> => {
        const success = await store.registration(email, password, username)
    }

    return (
        <div className={cl.AuthPageWrapper}>
            <div className={cl.AuthPageActive}>
                <div className={cl.AuthPageFields}>
                    {
                        !login ?
                            <h1>Sign Up</h1>
                            :
                            <h1>Sign In</h1>
                    }
                    <input
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="text"
                        placeholder='Enter email'
                        className={cl.AuthPageField}
                    />
                    {
                        !login && <input className={cl.AuthPageField} onChange={e => setUsername(e.target.value)} placeholder="Enter username"/>
                    }
                    <input
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        className={cl.AuthPageField}
                        type="password"
                        placeholder='Enter password'
                    />
                </div>
                <div className={cl.AuthPageAction}>
                    {
                        login 
                            ?
                            <button className="btn" onClick={() => store.login(email, password)}>
                                Sign In
                            </button>
                            :
                            <button className="btn" onClick={() => onSubmitRegistration()}>
                                Sign Up
                            </button>
                    }
                    <div className={cl.AuthPageSpan}>
                        <div className={cl.AuthPageOr}>OR</div>
                        {
                            login 
                                ?
                                <Link to="/">Sign Up</Link>
                                :
                                <Link to="/login">Sign In</Link>
                        }
                    </div>
                </div>
            </div>
            <div className={cl.AuthPageBackground}>

            </div>
        </div>
    );
};

export default observer(AuthPage);
