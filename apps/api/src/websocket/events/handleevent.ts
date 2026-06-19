import { mountJointChatEvent, mountTypingChatEvent, mountTypingStopEvent } from "./register-chat-event";


export const handleEvents = ( socket : any) => {
    // mounting chat events 
    mountJointChatEvent(socket);
    mountTypingChatEvent(socket);
    mountTypingStopEvent(socket);

    // mounting user event
   
}

