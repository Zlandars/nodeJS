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
io.on("connect", (socket) => {
    console.log('Socket is emitted')
    socket.emit('firstLoad',messages)
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