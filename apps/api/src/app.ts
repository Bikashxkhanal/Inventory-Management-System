import express from "express"
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { Server} from "socket.io";
import { createServer } from "node:http";

import dotenv from 'dotenv'
import path from 'node:path'

import { getSocketIOConnection } from "./websocket";


dotenv.config({
    path : path.resolve(__dirname, "./../../../.env")
})

const app = express();

// creating http server
const httpServer =  createServer(app);
console.log('Inside app', process.env.CORS_ORIGIN);
    
const io = new Server(httpServer, {
    cors : {
        origin : "http://localhost:5173",
        methods : ['GET', 'POST'],
        credentials : true
    }
});

// socket connection 
getSocketIOConnection(io);
   


// cookie parser setup
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(cookieParser());

import { authRouter } from "./modules/auth/auth.route";

app.use("/api/v1/auth", authRouter);


export {httpServer}



