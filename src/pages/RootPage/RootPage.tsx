import React, {FC, useContext, useState} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import cl from "./RootPage.module.sass"
import Header from '../../components/Header/Header';
import { Route, Routes } from 'react-router-dom';

const RootPage: FC = () => {
    const {store} = useContext(Context);

    return (
        <div className={cl.RootPageWrapper}>
            <h1>Root Page</h1>
        </div>
    );
};

export default observer(RootPage);
