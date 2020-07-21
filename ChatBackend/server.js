const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const socket = require("socket.io");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

const io = socket.listen(server, { log: false, origins: '*:*' });
const db = require("./config/dbProvider");

// {
//     FromUserId:this.common.loggedUser.userId,
//     RoomName:this.roomName,
//     RoomId:this.roomId,
//     ToUserId:this.toUser,
//     FullName:this.common.loggedUser.firstName+' '+this.common.loggedUser.lastName
// }
io.on("connection", (socket) => {
  console.log("User Connected");
  socket.on("init", (msg) => {
    /* 
    * LOGIC FOR EXECUTING QUERIES FROM DATABASE
    */
  });

  ////Gets  Chat Message and stores in SocketMessages table
  socket.on("chatMessage", (msg) => {
    debugger;
    console.log(msg);
    if (msg.ToUserId == "0") {
      io.to(msg.RoomId).emit("new-message", msg); //boradcast message to each user even the user itself
    } else {
      socket.to(msg.ToUserId).emit("new-message", msg); //sends message only to a single user
    }
    columns = "";
    values = "";
    for (let j in msg) {
      if (j == "ChatMessage")
        msg[j] = msg[j].toString().replace(/'/g, "''").replace("'", '"');
      columns += j + ",";
      values += "'" + msg[j] + "'" + ",";
    }
    columns = columns.slice(0, -1);
    values = values.slice(0, -1);
    db.executeSql(
      "INSERT INTO SocketMessages(" +
      columns +
      ") " +
      "VALUES(" +
      values +
      ");",
      (rowResults, err) => {
        if (err) socket.emit("error", "Error while inserting Chat messages");
        else {
          console.log("Message Inserted Succesfully");
        }
      }
    );
  });

  //Join Chat Room
  socket.on("joinRoom", (rooms) => {
    debugger;
    console.log(rooms);
    console.log("Joining Room ", rooms.RoomName);
    socket.join(rooms.RoomName);
  });
});

const PORT = 3800 || process.env.PORT;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
