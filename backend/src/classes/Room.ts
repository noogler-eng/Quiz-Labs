import { Socket } from "socket.io";

class Room {
  roomId: string;
  adminId: string;
  adminName: string;
  adminSocket: Socket;
  clients: {
    clientId: string;
    userName: string;
    socket: Socket;
    points: number;
  }[];
  questions: {
    id: string;
    value: string;
    ansId: string;
    answer: {
      id: string;
      value: string;
    }[];
  }[];

  constructor({
    id,
    adminId,
    adminName,
    adminSocket,
  }: {
    id: string;
    adminId: string;
    adminName: string;
    adminSocket: Socket;
  }) {
    this.roomId = id;
    this.adminId = adminId;
    this.adminName = adminName;
    this.adminSocket = adminSocket;
    this.clients = [];
    this.questions = [];
  }

  addClient(data: { clientId: string; userName: string; socket: Socket }) {
    this.clients.push({
      clientId: data.clientId,
      userName: data.userName,
      socket: data.socket,
      points: 0,
    });

    data.socket.emit("added", `hey ${data.userName}!, you have been added`);
    this.broadcastToClients();
  }

  addQuestion(data: {
    value: string;
    answerId: string;
    answer: {
      id: string;
      value: string;
    }[];
  }) {
    this.questions.push({
      id: (this.questions.length + 1).toString(),
      value: data.value,
      ansId: data.answerId,
      answer: data.answer,
    });

    this.adminSocket.emit("question_added", "question has been added");
    this.broadcastToClients();
  }

  // deleting question from front and make sure there is question at 0 instead of 1 index
  // Destructuring with rest to skip the first element
  // Assign the remaining elements back to questions array
  deleteQuestion() {
    if(this.questions.length == 0) return;
    const [, ...rest] = this.questions;
    this.questions = rest;
    this.broadcastToClients();
  }

  submitAnswer(data: { userId: string; questionId: string; answerId: string }) {
    const question = this.questions[Number(data.questionId) - 1];
    const user = this.clients.filter((client) => {
      return client.clientId == data.userId;
    });
    if (question.ansId != data.answerId) {
      user[0].socket.emit("submit", "your answer is wrong");
    } else {
      user[0].points += Number(question.id) * 100;
      user[0].socket.emit("submit", "your answer is right");
    }
  }

  showLeaderboard() {
    this.clients.forEach((client) => {
      client.socket.emit("leadboard", this.clients);
    });
  }

  leaveRoom(data: { userId: string }) {
    this.clients = this.clients.filter(
      (client) => client.clientId !== data.userId
    );
  }

  broadcastToClients() {
    this.clients.forEach((client) => {
      client.socket.emit("questions", {
        currentQuestion: {
          id: this.questions[0].id,
          value: this.questions[0].value,
          options: this.questions[0].answer,
        },
      });
    });
  }
}

export default Room;
