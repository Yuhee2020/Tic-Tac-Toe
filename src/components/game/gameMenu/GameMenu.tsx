import React from 'react';
import {useAppDispatch, useAppSelector} from "../../../store/Store";
import {setNewGame} from "../../../store/appReducer";

export const GameMenu = () => {
    const dispatch = useAppDispatch()
    const {playerSymbol, playerName,} = useAppSelector(state => state.app)

    const handleButtonClick = () => {
        dispatch(setNewGame())
    }

    return (
        <div className="gameMenu">
            <div>Symbol: {playerSymbol}</div>
            <div>Player: {playerName}</div>
            <button className='gameButton' onClick={handleButtonClick}> new game
            </button>
        </div>
    );
};

