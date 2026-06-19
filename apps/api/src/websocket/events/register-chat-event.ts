import { chatEventEnums } from "@repo/types"



export const mountJointChatEvent = (socket : any) => {
    socket.on(chatEventEnums.DISCONNECT_EVENT, (chatId : string) => {
        socket.join(chatId);
    })
}

export const mountTypingChatEvent = (socket : any) => {
    socket.on(chatEventEnums.TYPING_EVENT, (chatId : string) => {
        socket.in(chatId).emit(chatEventEnums.TYPING_EVENT, chatId);
    })
}

export const mountTypingStopEvent = (socket : any) => {
    socket.on(chatEventEnums.STOP_TYPING_EVENT, (chatId : string) => {
        socket.in(chatId).emit(chatEventEnums.STOP_TYPING_EVENT, chatId);
    })
}
