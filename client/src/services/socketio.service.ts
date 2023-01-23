import { io } from 'socket.io-client'

class SocketioService {
    socket;
    constructor() {}
  
    setupSocketConnection() { 
      this.socket = io('https://domautonomy.one:3100')
      this.socket.on('temperature', (data) => {
        console.log(data);
      })
      this.socket.on('humidity', (data) => {
        console.log(data);
      })
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
    
  }
  
  export default new SocketioService();
  