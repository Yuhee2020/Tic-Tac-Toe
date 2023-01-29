import React, {useEffect} from "react";
import "./Game.css"
import {useAppDispatch, useAppSelector} from "../../store/Store";
import {gameStartTC, gameUpdateTC, gameWinTC, updateGameMatrixTC} from "../../store/appReducer";
import {GameMenu} from "./gameMenu/GameMenu";


export function Game() {
    const dispatch = useAppDispatch()
    const {playerSymbol, matrix, isGameStarted, isPlayerTurn} = useAppSelector(state => state.app)

    const updateGameMatrix = (column: number, row: number, symbol: "x" | "o") => {
        dispatch(updateGameMatrixTC({column, row, symbol}))
    };

    useEffect(() => {
        dispatch(gameUpdateTC())
        dispatch(gameStartTC())
        dispatch(gameWinTC())
    }, []);

    return (
        <div className="gameContainer">
            {!isGameStarted
                ? <div className='waitingText'>Waiting for the second player...</div>
                : <GameMenu/>
            }
            {(!isGameStarted || !isPlayerTurn) && <div className="stopper"/>}
            {matrix.map((row, rowIdx) => {
                return (
                    <div className="rowContainer" key={rowIdx}>
                        {row.map((column, columnIdx) => (
                            <div className="cell"
                                 key={columnIdx}
                                 onClick={() =>
                                     updateGameMatrix(columnIdx, rowIdx, playerSymbol)}>
                                {column && column !== "null"
                                    ? (column === "x"
                                        ? (<span className="x"/>)
                                        : (<span className='o'/>))
                                    : null}
                            </div>))}
                    </div>
                );
            })}
        </div>
    );
}
