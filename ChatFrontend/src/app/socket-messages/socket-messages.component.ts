import { Component, OnInit, ViewChild } from "@angular/core";
import { AppConfig } from "services/app.config";
import * as io from "socket.io-client";
import { Common } from "services/common";
import { ToasterComponent } from "src/app/popups/toaster/toaster.component";
import { Observable } from "rxjs";

@Component({
  selector: "app-socket-messages",
  templateUrl: "./socket-messages.component.html",
  styleUrls: ["./socket-messages.component.css"],
})
export class SocketMessagesComponent implements OnInit {
  constructor(public common: Common, private toaster: ToasterComponent) {
    this.socket = io.connect(AppConfig.settings.Socket_Server_Endpoint.server);
  }
  socket;
  message;
  users = "";
  roomName;
  chatTitle = "";
  roomId;
  toUser;
  UserData;
  RoomData;
  ProjectData;
  ChatData;
  ChatInfo = [];
  messageList = [];
  UserChats = {};
  distinct = [];
  // @ViewChild('users',{static:false}) public users='';
  ngOnInit() {
    //RoomId generate according Click event in the Chat open
    //toUser will be updated accoding to the open chat
    // Show user list and generate click events and set RoomId to UserId of that user
    // So for user the RoomId will not be updated until the user selects that particular User Name
    this.getMessages().subscribe((msg) => {
      console.log(msg);
      this.UserChats[JSON.stringify(msg.RoomId)].push(msg);
      console.log(this.messageList);
    });
    this.getError().subscribe((err: string) => {
      console.log(err);
    });
    if (localStorage && localStorage["UserDetails"]) {
      this.socket.emit("init", {
        UserId: this.common.loggedUser.userId,
      });
      this.socket.on("initalize", (data) => {
        console.log(data);
        this.UserData = data.UserData;
        this.ProjectData = data.ProjectName;
        this.ChatData = data.ChatData;
        if (this.ProjectData.length > 0) {
          for (
            let chatInfo = 0;
            chatInfo < this.ProjectData.length;
            chatInfo++
          ) {
            console.log(this.ProjectData);
            //One more for loop for getting the last message Of a Particular Chat
            this.ChatInfo.push({
              id: this.ProjectData[chatInfo].ProjectId,
              name: this.ProjectData[chatInfo].Title,
              lastMessage: "This is a Trial Message",
            });
          }
        }
        if (this.ChatData.length > 0) {
          for (let chat = 0; chat < this.ChatData.length; chat++) {
            if (!(this.ChatData[chat].RoomId in this.UserChats))
              this.UserChats[this.ChatData[chat].RoomId] = this.ChatData.filter(
                (obj) => obj.RoomId == this.ChatData[chat].RoomId
              );
            console.log(
              this.ChatData.filter(
                (obj) => obj.RoomId == this.ChatData[chat].RoomId
              )
            );
            console.log(this.UserChats);
          }
        }
        this.distinct = []; // stores the Data of different project Ids of which the user is part of
        for (let i = 0; i < data.UserData.length; i++) {
          if (!this.distinct.includes(data.UserData[i].ProjectId))
            this.distinct.push(data.UserData[i].ProjectId);
        }
        for (let room = 0; room < this.distinct.length; room++) {
          this.socket.emit("joinRoom", {
            RoomName: this.distinct[room],
          });
        }
      });
    } else
      this.toaster.showWarning("Cannot Access Messages in logged Out state");
    //In else condition show either the Modal box or route to login URL for login user
  }

  getMessages() {
    return Observable.create((observer) => {
      this.socket.on("new-message", (msg) => {
        observer.next(msg);
      });
    });
  }

  getError() {
    return Observable.create((observer) => {
      this.socket.on("error", (msg) => {
        observer.next(msg);
      });
    });
  }

  validateSubmit() {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date + " " + time;
    if (this.message != "\n" || this.message != "") {
      this.socket.emit("chatMessage", {
        FromUserId: this.common.loggedUser.userId,
        RoomName: this.roomName,
        RoomId: this.roomId,
        ToUserId: this.toUser,
        FullName: this.common.loggedUser.firstName,
        ChatMessage: this.message,
        DateSent: dateTime,
      });
      this.message = "";
    }
  }

  EnterRoom(ProjectId) {
    this.chatTitle = this.ChatInfo.find((obj) => obj.id == ProjectId).name;
    this.RoomData = this.UserData.filter((obj) => obj.ProjectId == ProjectId);
    let user = "";
    for (let i = 0; i < this.RoomData.length; i++) {
      user +=
        this.RoomData[i].FirstName + " " + this.RoomData[i].LastName + ", ";
    }
    user = user.slice(0, -1);
    console.log(user);
    console.log(this.RoomData);
    this.users = user;
    this.messageList = [];
    this.roomId = ProjectId;
    this.toUser = "0";
    this.roomName = ProjectId;
    console.log("Entered Room please load the chat", ProjectId);
  }
}
