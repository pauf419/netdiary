import { FC, ReactNode, useContext } from "react";
import store from "../../store/store";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../..";


interface Props {
  children: ReactNode
}

const RegsessionProtector: FC<Props> = ({ children }) => {

    const {store} = useContext(Context);

    if(store.regsessionStatus) return <Navigate to="/root"/>;
    return <>{children}</>;
    
};

export default observer(RegsessionProtector);