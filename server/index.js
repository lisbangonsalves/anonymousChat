const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
