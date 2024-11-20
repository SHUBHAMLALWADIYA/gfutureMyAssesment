const express=require('express')
const app=express()
const http=require('http')
const cors=require('cors')
const {Server}=require('socket.io')

const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:'*'
    },
})

let users=[]

io.on('connection',(socket)=>{
console.log("user connected with server of io ",socket.id)

socket.on('join',(username)=>{
    users.push({id:socket.id,username})
    io.emit('users',users)
})
socket.on('send_message',(data)=>{
    io.emit('receive_message',data)
})

socket.on('disconnect',()=>{
    users=users.filter((user)=>user.id!=socket.id)
    io.emit('users',users)
})
})


let PORT=8010
server.listen(PORT,()=>{
    console.log('server is running on port ',PORT)
})