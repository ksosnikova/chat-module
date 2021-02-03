const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const fs = require('fs');
const http = require('http');
const config = require('config');
const mongoose = require('mongoose');
//const router = express.Router();
const SocketIOFileUpload = require('socketio-file-upload');

const Room = require('./models/Room');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const app = express()
  .use(SocketIOFileUpload.router)
  .use(express.json({ extended: true })) //middleware
  .use(express.static(__dirname + '/public'));

//app.use('/chat', require('./routes/chat.routes'));

const PORT = config.get('port') || 5000;

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*'
  }
});



server.listen(PORT, async () => {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log(`Server has started on port ${PORT}`);
  } catch (error) {
    console.log('Server error', error.message);
    process.exit(1);
  }
});


io.on('connect', (socket) => {
  console.log(`We have a new ${socket.id} connection!`);

  socket.on('join', async ({ name, room }, cb) => {

    const messagesHistory = await Room.find({ room });
    if (messagesHistory) {
      socket.emit('messageHistory', messagesHistory);
    }

    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return cb(error);

    socket.join(user.room);
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    cb();
  });


  const uploader = new SocketIOFileUpload();
  uploader.dir = './public';
  uploader.listen(socket);

  uploader.on('start', (event) => {
    console.log('BECK UPLOAD START')
  });

  uploader.on('saved', async (event) => {

    const url = event.file.pathName;
   // console.log('file:', event.file);

    fs.readFile(event.file.pathName, async (err, data) => {
      const { name, room, id } = getUser(socket.id);
      const url = `data:${event.file.name}/png;base64,` + data.toString('base64');
      io.to(room).emit('message', { user: name, text: event.file.name, url: url });

      const roomData = new Room({ name, room, message: event.file.name, url });
      await roomData.save();
    });

    fs.unlink(event.file.pathName, () => { });

    uploader.on('error', (event) => {
      console.log("Error from uploader", event);
    });

  })

  socket.on('sendMessage', async (message, cb) => {
    console.log('SENT MESSAGE')
    const user = getUser(socket.id);
    const { name, room, id } = user;
    const roomData = new Room({ name, room, message });
    await roomData.save();

    io.to(user.room).emit('message', { user: name, text: message });
    console.log('message', message)
    cb();
  });

  socket.on('private', ({ message, socketId }) => {
    console.log('In private', message, socketId)
    io.to(socketId).emit('private', { user: 'sent in private', text: message });
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.name).emit('message', { user: 'admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  })
})



//  async function start() {
//    try {
//      await mongoose.connect(config.get('mongoUri'), {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true
//      })
//      server.listen(PORT, () => {
//       console.log(`Server has started on port ${PORT}`)
//     });
//    } catch (e) {
//      console.log('Server error', e.message)
//      process.exit(1)
//    }
//  }
// start()
