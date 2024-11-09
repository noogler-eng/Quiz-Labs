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
  }

  submitAnswer(data: {}) {}
}

export default Room;
