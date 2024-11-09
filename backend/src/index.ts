import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("server is working fine!");
});

io.on("connection", (socket) => {
  socket.emit("connected", "you are connected to server using websocket")
  socket.on("message", (data)=>{
    handelFunction(data);
  })
});

const handelFunction = async(data: {
    type: string,
    userId: string,
    status: "Admin" | "Client",
    question?: {
        id: string,
        ansId: string,
        value: string
    },
    ans?: {
        id: string,
        value: string,
    }[]
})=>{
    if(data.type == "create_room"){

    }else if(data.type == "init_room"){

    }else if(data.type == "add_ques"){

    }else if(data.type == "delete_ques"){

    }else if(data.type == "submit_ans"){

    }else if(data.type == "rating_dashboard"){

    }else if(data.type == "add_reaction"){

    }else {
            
    }
}

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
