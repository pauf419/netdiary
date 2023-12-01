import { FC, ReactNode, useContext } from "react";
import store from "../../store/store";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../..";


interface Props {
  children: ReactNode
}

const AuthorizedProtector: FC<Props> = ({ children }) => {

    const {store} = useContext(Context);

    if(store.isAuth) return <>{children}</>;
    return <Navigate to="/"/>;
    
};

export default observer(AuthorizedProtector);