import socketIOClient, { Socket } from "socket.io-client";

export default class SocketClass {
  socket: Socket;

  constructor(host: string, port: number) {
    this.socket = socketIOClient(`${host}:${port}`);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  emit(event: string, payload: any, identity: string ) {
    this.socket.emit(event, { payload, identity });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
