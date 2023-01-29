import React from 'react';
import "../../App.scss"
import {useFormik} from "formik";
import {useAppDispatch} from "../../store/Store";
import {joinGameRoomTC, setPlayerName} from "../../store/appReducer";

export const StartMenu = () => {
    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues: {
            playerName: '',
            roomNumber: '',
        },
        validate: (values: { playerName: string, roomNumber: string }) => {
            const errors: { playerName: string, roomNumber: string } = {
                playerName: '',
                roomNumber: ''
            };
            if (!values.playerName) {
                errors.playerName = 'Required';
            }
            if (!values.roomNumber) {
                errors.roomNumber = 'Required';
            }
            return errors;
        }
        ,
        onSubmit: values => {
            dispatch(joinGameRoomTC(values.roomNumber))
            dispatch(setPlayerName(values.playerName))
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="startGameContainer">
                <h4>Enter your name</h4>
                <input className="gameInput"
                       placeholder="Your name"
                       {...formik.getFieldProps('playerName')}/>
                <div className="errorMessage">{formik.errors.playerName}</div>
                <h4>Enter Room number to Join the Game</h4>
                <input className="gameInput"
                       placeholder="Room number"
                       {...formik.getFieldProps('roomNumber')}/>
                <div className="errorMessage">{formik.errors.roomNumber}</div>
                <button type="submit" className="gameButton">Start game</button>
            </div>
        </form>
    );
};

