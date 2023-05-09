import express from 'express'
import cors from 'cors'
import http from 'http'
import {Server as webServer} from 'socket.io'
import socket from './socket/socket.js'

const app=express()
const server=http.createServer(app)
const io = new webServer(server, {
    cors: {
      origin: "*",
    },
  });
  app.use(cors());
app.use(express.json());

socket(io)

server.listen(3000)
console.log("servidor corriendo en el servidor 3000 ")