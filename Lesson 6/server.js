import { createServer } from "http";
import { Server } from "socket.io";
import * as path from "path";
import * as fs from "fs";

const port = 3000;
const host = 'localhost';

const httpServer = createServer((req, res)=>{
    switch (req.method) {
        case 'GET':
        case 'POST':
        case 'PUT':
        default:
            const filePath = path.join(process.cwd(), "./index.html");
            const rs = fs.createReadStream(filePath);
            rs.pipe(res);
            break;
    }
});
const io = new Server(httpServer);
let messages = [];
let statistic = {};
let client_count = 0;
io.on("connect", (socket) => {
    console.log('Socket is emitted');
    // Плюсы в начале, чтобы добавилось количество мгновенно
    ++client_count;
    console.log(client_count)
    if(statistic[`${socket.conn.remoteAddress}`]) {
        statistic[`${socket.conn.remoteAddress}`] = `Переподключился клиент с ip адреса: ${socket.conn.remoteAddress}`;
    } else {
        statistic[`${socket.conn.remoteAddress}`] = `Подключился клиент с ip адреса: ${socket.conn.remoteAddress}`;
    }
    socket.broadcast.emit('client_connected', [statistic[`${socket.conn.remoteAddress}`],client_count])
    socket.emit('client_connected',[statistic[`${socket.conn.remoteAddress}`],client_count])
    socket.emit('firstLoad', {messages,statistic});
    socket.on('disconnect', ()=>{
        console.log('Socket is disconnect')
        statistic[`${socket.conn.remoteAddress}`] = `Отключился клиент с ip адреса: ${socket.conn.remoteAddress}`;
        client_count--;
        console.log(client_count)
    })

    socket.on('client_msg', data => {
        socket.broadcast.emit('server_msg', {
            name: data.name,
            msg: data.msg
        })
        messages.push({
            name: data.name,
            msg: data.msg
        })
        socket.emit('server_msg', {
            name: data.name,
            msg: data.msg
        })
    })

});

httpServer.listen(port, host,()=>{
    console.log(`Server running at http://${host}:${port}`)
});