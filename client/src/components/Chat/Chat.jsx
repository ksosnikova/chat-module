import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import SocketIOFileUpload from 'socketio-file-upload';

import './Chat.css';
import Input from '../Input/Input';
import Message from '../Message/Message';
import { User } from '../User/User';

let socket;

const Chat = ({ location }) => {

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([]);

  const ENDPOINT = 'localhost:5000';

  useEffect(() => {

    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    const loginHandler = async () => {
      try {
        console.log('room name', room, name)
        //const data = await request('/chat', 'POST', { name, room });
        const response = await fetch('/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({ room, name })
        });
        const data = await response.json();
        // const historyMessages = data.forEach(elem => {
        //   elem.
        // });
        console.log('data from server', data)
      } catch (e) {
        console.log(e);
      }
    }
    //loginHandler();


    socket.emit('join', { name, room }, (error) => {
      if (error) alert(error);
    });

    socket.on('roomData', dataRoom => {
      let users = [];
      const allUsers = dataRoom.users.forEach(item => {
        users = [...users, item]
      });
      setUsersInRoom(users);
    })

    return () => {
      socket.disconnect();
    }
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    
    socket.on('messageHistory', messagesHistory => {
      const messagesFormatted = messagesHistory.map(({ name, message }) => {
      return { text: message, user: name }
    });
    setMessageList([...messageList, ...messagesFormatted]);
    });

    socket.on('message', (message) => {
      setMessageList([...messageList, message])
    });

    socket.on('private', (message) => {
      setMessageList([...messageList, message])
    });

  }, [messageList]);

  const sendMessage = async (e) => {

    e.preventDefault();

    socket.emit('sendMessage', message, () => {
      setMessage('');
    });
  }

  const sendPrivateMsg = (user) => {
    socket.emit('private', { message: message, socketId: user.id });
    setMessage('');
  };

  return (

    <div className='chatWrapper'>
      <h1 className='chatHeading'>{room}</h1>
      <div className='chatContainer'>
        <ul className='chatMembers'>members:
          {usersInRoom.map((item, i) =>
          <User
            onClick={() => sendPrivateMsg(item)}
            name={item.name}
            key={i}
          />
        )}
        </ul>
        <div className='chatInnerContainer'>
          <Message messageList={messageList} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} name={name} />
        </div>
      </div>
    </div>
  )
};

export default Chat;