const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const fs = require('fs');
const http = require('http');
const config = require('config');
const mongoose = require('mongoose');
const router = express.Router();
const siofu = require('socketio-file-upload');
const mime = require('mime-types');

const Room = require('./models/Room');
const { addUser, removeUser, getUser, getUsersInRoom, getUserByName } = require('./users.js');

const app = express()
  .use(express.json({ extended: true })) 
  .use(siofu.router)
  .use(express.static(path.join(__dirname + './public')));

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
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room), user });
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    cb();
  });


  const uploader = new siofu();
  uploader.dir = __dirname + '/public';
  uploader.listen(socket);

  // uploader.on('start', (event) => {
  //   console.log('BECK UPLOAD START')
  // });

  uploader.on('saved', async (event) => {

    fs.readFile(event.file.pathName, {
      flag: 'r'
    }, async (err, data) => {
      const { name, room, id } = getUser(socket.id);
      const mimeType = mime.lookup(path.extname(event.file.pathName));
      const encoded = data.toString('base64');
      const url = `data:${mimeType};base64,${encoded}`;

      io.to(room).emit('message', { user: name, text: event.file.name, url });

      const roomData = new Room({ name, room, message: event.file.name, url });
      await roomData.save();
    });

    fs.unlink(event.file.pathName, () => { });

    uploader.on('error', (event) => {
      console.log("Error from uploader", event);
    });
  });

  socket.on('sendMessage', async (message, cb) => {
    const user = getUser(socket.id);
    const { name, room, id } = user;
    const roomData = new Room({ name, room, message });
    await roomData.save();

    io.to(user.room).emit('message', { user: name, text: message });
    cb();
  });

  socket.on('private', ({ message, name, nameToPrivate }) => {
    console.log('messagem name nametoPtr', message, name, nameToPrivate)
    const { id }  = getUserByName(nameToPrivate);
    io.to(id).emit('private', { user: `sent in private from ${name}`, text: message });
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
