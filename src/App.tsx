import React, {useEffect} from 'react';
import './App.scss';
import {StartMenu} from "./components/startMenu/StartMenu";
import {connectTC, disconnectTC} from "./store/appReducer";
import {useAppDispatch, useAppSelector} from "./store/Store";
import {BackDrop} from "./components/backDrop/backDrop";
import {Game} from "./components/game/Game";
import {AppMessage} from "./components/game/appMessage/AppMessage";


function App() {

    const dispatch = useAppDispatch()
    const {isLoading, inRoom, appMessage} = useAppSelector(state => state.app)

    useEffect(() => {
        dispatch(connectTC())
        return () => {
            dispatch(disconnectTC())
        }
    },[])

    return (
        <div className="App">
            {isLoading && <BackDrop/>}
            {appMessage && <AppMessage/>}
            <h1>Tic-Tac-Toe</h1>
            <div className="mainContainer">
                {inRoom? <Game/> : <StartMenu/>}
            </div>
        </div>
    );
}

export default App;
