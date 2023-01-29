import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {gameAPI, IPlayMatrix} from "../api/socket";
import {checkGameState} from "../components/game/utils/utils";
import {StateType} from "./Store";


export const connectTC = createAsyncThunk("app/connect", async (params, {dispatch}) => {
    try {
        dispatch(setIsLoading(true))
        await gameAPI.connect()
    } catch (err: any) {
        dispatch(setAppError(err))
    } finally {
        dispatch(setIsLoading(false))
    }
})

export const disconnectTC = createAsyncThunk("app/disconnect", async (params, {dispatch}) => {
    try {
        await gameAPI.disconnect()
    } catch (err: any) {
        dispatch(setAppError(err))
    }
})

export const joinGameRoomTC = createAsyncThunk("app/joinRoom", async (params: string, {dispatch}) => {
    try {
        await gameAPI.joinGameRoom(params)
        dispatch(setInRoom(true))
    } catch (err: any) {
        dispatch(setAppError(err))
    }
})

export const gameUpdateTC = createAsyncThunk("app/gameUpdate", async (params, {dispatch, getState}) => {
    try {
        const state = getState() as StateType
        const playerSymbol = state.app.playerSymbol
        gameAPI.onGameUpdate((newMatrix) => {
            dispatch(setMatrix(newMatrix));
            checkGameState(newMatrix, playerSymbol);
            dispatch(setPlayerTurn(true));
            dispatch(setAppMessage(""))
        });
    } catch (err: any) {
        dispatch(setAppError(err))
    }
})

export const gameStartTC = createAsyncThunk("app/gameStart", async (params, {dispatch}) => {
    try {
        gameAPI.onStartGame((options) => {
            dispatch(setGameStarted(true));
            dispatch(setPlayerSymbol(options.symbol));
            options.start
                ? dispatch(setPlayerTurn(true))
                : dispatch(setPlayerTurn(false));
        });
    } catch (err: any) {
        dispatch(setAppError(err))
    }
})

export const gameWinTC = createAsyncThunk("app/gameWin", async (params, {dispatch}) => {
    try {
        gameAPI.onGameWin((message) => {
            dispatch(setPlayerTurn(false));
            dispatch(setAppMessage(message))
        });
    } catch (err: any) {
        dispatch(setAppError(err))
    }
})

export const updateGameMatrixTC = createAsyncThunk("app/updateGameMatrix", async (params:{column: number, row: number, symbol: "x" | "o"}, {dispatch,getState}) => {
    try {
        const state=getState() as StateType
        const {matrix, playerSymbol}=state.app
        if (matrix[params.row][params.column] === null || matrix[params.row][params.column] === "null") {
            const newMatrix = matrix.map((r, i) => {
                return i === params.row
                    ? r.map((c, ii) => {
                        return ii === params.column ? (c = params.symbol) : c
                    })
                    : r
            })
            dispatch(setMatrix(newMatrix));
            gameAPI.updateGame(newMatrix);
            const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix, playerSymbol);
            if (currentPlayerWon && otherPlayerWon) {
                gameAPI.gameWin("The Game is a TIE!");
                dispatch(setAppMessage("The Game is a TIE!"))
            } else if (currentPlayerWon && !otherPlayerWon) {
                gameAPI.gameWin("You Lost!");
                dispatch(setAppMessage("You Won!"))
            }
            dispatch(setPlayerTurn(false));
        }
    } catch (err: any) {
        dispatch(setAppError(err))
    }
})


export const slice = createSlice({
    name: "app",
    initialState: {
        isLoading: false,
        playerName: "",
        inRoom: false,
        appError: null as any,
        matrix: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ] as IPlayMatrix,
        playerSymbol: "x" as "x" | "o",
        isPlayerTurn: false,
        isGameStarted: false,
        appMessage:""
    },
    reducers: {
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        },
        setPlayerName(state, action: PayloadAction<string>) {
            state.playerName = action.payload
        },
        setInRoom(state, action: PayloadAction<boolean>) {
            state.inRoom = action.payload
        },
        setMatrix(state, action: PayloadAction<IPlayMatrix>) {
            state.matrix = action.payload
        },
        setPlayerTurn(state, action: PayloadAction<boolean>) {
            state.isPlayerTurn = action.payload
        },
        setGameStarted(state, action: PayloadAction<boolean>) {
            state.isGameStarted = action.payload
        },
        setPlayerSymbol(state, action: PayloadAction<"x" | "o">) {
            state.playerSymbol = action.payload
        },
        setAppError(state, action: PayloadAction<boolean>) {
            state.appError = action.payload
        },
        setNewGame(state) {
            state.matrix = [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ]
            state.appMessage=""
            state.isPlayerTurn= true
            state.isGameStarted=true
        },
        setAppMessage(state, action: PayloadAction<string>) {
            state.appMessage = action.payload
        },
    }
})

export const appReducer = slice.reducer
export const {
    setPlayerName,
    setAppError,
    setInRoom,
    setIsLoading,
    setMatrix,
    setPlayerTurn,
    setGameStarted,
    setPlayerSymbol,
    setAppMessage,
    setNewGame
} = slice.actions