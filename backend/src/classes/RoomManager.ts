import { Socket } from "socket.io";
import Room from "./Room";
import { v4 as uuidv4 } from "uuid";

class RoomManager {
  rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map();
  }

  createRoom(data: {
    adminId: string;
    adminName: string;
    adminSocket: Socket;
  }) {
    const roomId = uuidv4();
    const room = new Room({
      id: roomId,
      adminId: data.adminId,
      adminName: data.adminName,
      adminSocket: data.adminSocket,
    });
    this.rooms.set(roomId, room);
  }

  handelRoomFunction(data: { roomId: string; type: string }) {
    const room = this.rooms.get(data.roomId);
    if (!room) return;

    if (data.type == "init_room") {
      room.addClient(data);
    } else if (data.type == "add_ques") {
      room.addQuestion(data);
    } else if (data.type == "delete_ques") {
      room.deleteQuestion();
    } else if (data.type == "submit_ans") {
      room.submitAnswer(data);
    } else if (data.type == "rating_dashboard") {
      room.showLeaderboard();
    } else if (data.type == "add_reaction") {
    } else {
      room.leaveRoom(data);
    }
  }
}

export default RoomManager;
