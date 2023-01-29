import React from 'react';
import {useAppSelector} from "../../../store/Store";
import "./AppMessage.scss"

export const AppMessage = () => {
    const message=useAppSelector(state => state.app.appMessage)
    return (
        <div className="message">
            {message}
        </div>
    );
};

