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
}

export default RoomManager;
