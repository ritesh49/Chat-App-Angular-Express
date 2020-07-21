import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() {    
   }
   public socket;
  setUpSocketConnection(){
    this.socket= io.connect(environment.SOCKET_ENDPOINT);
  }
  sendMessage(object){
    this.socket.emit('send message',object);
  }
  joinRoom(object){
    this.socket.emit('join chat',object);
  }

  receiveMessage():any{
    this.socket.on('receive message',(msg)=>{
      return msg;
    });
  }

}
 