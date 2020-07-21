import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  socket;
  constructor() {}
  ngOnInit() {
    this.socket = io.connect(environment.SOCKET_ENDPOINT);
    this.socket.emit('message',{name:'ritesh ramchandani'});
  }
  

}
