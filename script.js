const firebaseConfig = {
  apiKey: "AIzaSyCUlBCx4rDQNku1y3rV_Kf9sCG9Xf326NI",
  authDomain: "suit-b1584.firebaseapp.com",
  databaseURL: "https://suit-b1584-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "suit-b1584",
  storageBucket: "suit-b1584.appspot.com",
  messagingSenderId: "963137675385",
  appId: "1:963137675385:web:10344f05352001afbd34a8"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let board = Array(9).fill("");
let player = prompt("Masukkan nama kamu (X atau O):");
let currentPlayer = "X";
let gameRef = db.ref("game");
let chatRef = db.ref("chat");

// Sync game state
gameRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (data) {
    board = data.board;
    currentPlayer = data.currentPlayer;
    updateBoard();
    document.getElementById("status").innerText = "Giliran: " + currentPlayer;
  }
});

function updateBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  board.forEach((val, idx) => {
    const cell = document.createElement("div");
    cell.innerText = val;
    cell.onclick = () => makeMove(idx);
    boardDiv.appendChild(cell);
  });
}

function makeMove(i) {
  if (board[i] === "" && player === currentPlayer) {
    board[i] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameRef.set({ board, currentPlayer });
    checkWin();
  }
}

function checkWin() {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  wins.forEach(combo => {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      alert("Pemenang: " + board[a]);
      board = Array(9).fill("");
      gameRef.set({ board, currentPlayer: "X" });
    }
  });
}

// Chat
chatRef.on("child_added", (data) => {
  const msg = document.createElement("div");
  msg.innerText = data.val();
  document.getElementById("chat-messages").appendChild(msg);
});

function sendMessage() {
  const input = document.getElementById("chat-input");
  if (input.value.trim()) {
    chatRef.push(player + ": " + input.value);
    input.value = "";
  }
}

updateBoard();