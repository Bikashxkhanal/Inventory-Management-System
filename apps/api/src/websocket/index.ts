// setup the connection for socket io
import { ApiError } from "../utils";
import { handleEvents } from "./events/handleevent";
import jwt from 'jsonwebtoken'
import { userModel } from "@repo/db-nosql";
import { JwtPayload } from "jsonwebtoken";
import { chatEventEnums } from "@repo/types";



interface jwtpayload extends JwtPayload{
    _id : string
}


const getSocketIOConnection = (io : any) => {
   return io.on("connection", async (socket : any) => {
            console.log(`Socket connected ${socket.id}`);

    try {
              const token = socket.handshake.auth.accessToken;
              if(!token) throw new ApiError(401, "Unauthorized access, access token missing");
    
              const decodedToken  = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwtpayload;
    
              if(!decodedToken) throw new ApiError(401, "Unauthorized access, invalid access token");
    
              const user = await userModel.findById(decodedToken?._id).select("-hashed_password -refresh_token")
              if(!user) throw new ApiError(401, "Unauthorized request, token expired");
    
              socket.user = user;
    
            // addding in the personal room for the user , Use case :: when the same uesr login from different devices it need to listen the events in all those devices , it will be easeir to emit those events in the room then emiting them one by one by making the map...
    
            socket.join(user?._id.toString());
            socket.emit(chatEventEnums.CONNECTED_EVENT);
            console.log(`user connected successfully ${socket.id}`);
            
    
            // mounting some events during initialization (user and chat events)
            handleEvents(socket);
    
    
              socket.on(chatEventEnums.DISCONNECT_EVENT, () => {
                console.log(`socket disconnected!`);
                if(socket.user._id){
                    socket.leave(socket.user._id);
                }
                
              })

               socket.on(chatEventEnums.DISCONNECT_EVENT, () => {
                console.log(`Socket disconnected!`);
            
            })
    } catch (error) {
            socket.emit(
                chatEventEnums.SOCKET_ERROR_EVENT, "something went wrong while connectiong socket"
            )
    }

     
           
    })

    
}


const emitSocketEvents = (req : any, roomId : any,ioevent : any,  payload : any ) => {
    req.app.get("io").in(roomId).emit(ioevent, payload)
}

export {
    getSocketIOConnection, 
    emitSocketEvents
}

