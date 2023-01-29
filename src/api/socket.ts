import socketIo from "socket.io-client";


export const gameAPI = {
    socket: null as null | any,
    connect() {
        this.socket = socketIo("http://localhost:9000", {
        });
    },
    joinGameRoom(roomId: string) {
        this.socket.emit("join_game", {roomId});
        this.socket.on("room_joined",()=>{});
    },
    updateGame(gameMatrix: IPlayMatrix) {
        this.socket.emit("update_game", { matrix: gameMatrix });
    },
    onGameUpdate(listener: (matrix: IPlayMatrix) => void) {

        this.socket.on("on_game_update", ({ matrix }:any) => listener(matrix));
    },
    onStartGame(listener: (options: IStartGame) => void) {
        this.socket.on("start_game", listener);
    },
    gameWin(message: string) {
        this.socket.emit("game_win", { message });
    },
    onGameWin(listener: (message: string) => void) {
        this.socket.on("on_game_win", ({ message }:any) => listener(message));
    },
    disconnect() {
        this.socket.disconnect();
        this.socket = null;
    },
}

export type IPlayMatrix = Array<Array<string | null>>;
export type IStartGame= {
    start: boolean;
    symbol: "x" | "o";
}