const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName, nickName;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  input.value = input.value === "" ? "Anonymous" : input.value;
  //input.setAttribute("placeholder", value);
  socket.emit("nickname", input.value);
  ChangeNickName(input.value);
  input.value = "";
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message.toString("utf8");
  ul.appendChild(li);
}

function ChangeNickName(applynickname) {
  span = room.querySelector("span");
  span.innerText = `Your nickname is ${applynickname}`;
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Welcome to ${roomName}`;
  ChangeNickName(nickName);
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");

  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input_roomname = form.querySelector("#input_roomname");
  const input_nickname = form.querySelector("#input_nickname");

  roomName =
    input_roomname.value === "" ? "Defalut Room" : input_roomname.value;
  nickName = input_nickname.value === "" ? "Anonymous" : input_nickname.value;

  socket.emit("enter_room", roomName, nickName, showRoom);

  input_roomname.value = "";
  input_nickname.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} joined the room`);
});

socket.on("goodbye", (left) => {
  addMessage(`${left} left the room`);
});

socket.on("new_message", (message) => {
  addMessage(message);
});

// const messageList = document.querySelector("ul");
// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");
// const socket = new WebSocket(`ws://${window.location.host}`);

// function makeMessage(type, payload) {
//   const msg = { type, payload };
//   return JSON.stringify(msg);
// }

// socket.addEventListener("open", () => {
//   console.log("Connected to Server ✅");
// });

// socket.addEventListener("message", (message) => {
//   const li = document.createElement("li");
//   li.innerText = message.data;
//   messageList.append(li);
// });

// socket.addEventListener("close", () => {
//   console.log("Disconnected from Server ❌");
// });

// function handleSubmit(event) {
//   event.preventDefault();
//   const input = messageForm.querySelector("input");
//   socket.send(makeMessage("new_message", input.value));
//   input.value = "";
// }

// function handleNickSubmit(event) {
//   event.preventDefault();
//   const input = nickForm.querySelector("input");
//   socket.send(makeMessage("nickname", input.value));
//   input.value = "";
// }

// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);
