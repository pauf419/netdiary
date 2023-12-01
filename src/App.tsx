import React, {FC, useContext, useEffect, useState} from 'react';
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
  } from "react-router-dom";
import AuthPage from './pages/AuthPage/AuthPage';
import RootPage from './pages/RootPage/RootPage';
import UnauthorizedProtector from './components/UnauthorizedProtector/UnauthorizedProtector';
import AuhtorizedProtector from './components/AuthorizedProtector/AuhtorizedProtector';
import VerifyPage from './pages/VerifyPage/VerifyPage';
import LogModal from './components/LogModal/LogModal';
import Header from './components/Header/Header';
import ClassroomPanelPage from './pages/ClassroomPanelPage/ClassroomPanelPage';
import SubjectPanelPage from './pages/SubjectPanelPage/SubjectPanelPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ScheduleManagementPage from './pages/ScheduleManagementPage/ScheduleManagementPage';


const App: FC = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        if(localStorage.getItem('regsession') && localStorage.getItem('regsession_payload')) store.regsessionStatus = true
    }, [])

    if (store.isLoading) {
        return <div>loading</div>
    }

    return (
        <div>
            <LogModal/>
            <BrowserRouter>
                {
                    store.isAuth && <Header/>
                }
                <Routes>   
                    {
                        !store.isAuth 
                            ?
                            <>
                                {
                                    store.regsessionStatus 
                                        ?
                                        <Route path="/" element={<VerifyPage/>}/>
                                        : 
                                        ""
                                }
                                <Route path="/" element={<AuthPage login={false}/>} />
                                <Route path="/login" element={<AuthPage login={true}/>}/>
                            </>
                            :
                            <>
                                <Route path="/" element={<Navigate to="/subject"/>} />
                                <Route path="/login" element={<Navigate to="/"/>}/>
                                <Route path="/dashboard" element={<DashboardPage/>}/>
                                <Route path="/classroom" element={<ClassroomPanelPage/>}/>
                                <Route path="/subject" element={<SubjectPanelPage/>}/>
                                <Route path="/schedule" element={<ScheduleManagementPage/>}/>
                            </>
                    }
                </Routes>
            </BrowserRouter>
        </div>
    )
};

export default observer(App);
