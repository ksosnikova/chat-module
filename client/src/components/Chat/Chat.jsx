import React, { useState, useEffect, useRef } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import SocketIOFileUpload from 'socketio-file-upload';

import './Chat.css';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import { User } from '../User/User';

let socket;

const Chat = ({ location }) => {

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [userInPrivate, setUserInPrivate] = useState('');

  //const ENDPOINT = 'localhost:5000';

  const handleEsc = (e) => {
    if (e.code === 'Escape' || e.code === 'Esc') {
      setUserInPrivate('');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEsc);

    const { name, room } = queryString.parse(location.search);

    socket = io('https://chat-app-module.herokuapp.com:80' || 'http://localhost:8080');

    setName(name);
    setRoom(room);

    // const loginHandler = async () => {
    //   try {
    //     console.log('room name', room, name)
    //     //const data = await request('/chat', 'POST', { name, room });
    //     const response = await fetch('/chat', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json;charset=utf-8'
    //       },
    //       body: JSON.stringify({ room, name })
    //     });
    //     const data = await response.json();
    //     // const historyMessages = data.forEach(elem => {
    //     //   elem.
    //     // });
    //     console.log('data from server', data)
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    //loginHandler();

    socket.emit('join', { name, room }, (error) => {
      if (error) alert(error);
    });

    socket.on('roomData', dataRoom => {
      let users = [];
      dataRoom.users.forEach(item => { users = [...users, item] });
      setUsersInRoom(users);
    })

    return () => {
      socket.disconnect();
      document.removeEventListener('keydown', handleEsc);
    }
  }, [ENDPOINT, location.search]);


  const fileRef = useRef(null);
  const InputAddon = () => {
    fileRef.current.click();
  }

  useEffect(() => {
    const siofu = new SocketIOFileUpload(socket);
    siofu.listenOnInput(fileRef.current);
  }, []);

  useEffect(() => {

    socket.on('messageHistory', messagesHistory => {
      const messagesFormatted = messagesHistory.map(({ name, message, url }) => {
        return { text: message, user: name, url }
      });
      setMessageList([...messageList, ...messagesFormatted]);
    });


    socket.on('message', ({ user, text, url }) => {
      setMessageList([...messageList, { text, user, url }])
    });

    socket.on('private', (message) => {
      setMessageList([...messageList, message])
    });

  }, [messageList]);

  const sendMessage = async (e) => {

    e.preventDefault();

    if (userInPrivate) {
      socket.emit('private', { message, name, nameToPrivate: userInPrivate });
      setMessage('');
      setUserInPrivate('');
    } else {
      socket.emit('sendMessage', message, () => {
        setMessage('');
      });
    }
  }

  return (
    <div className='chatWrapper'>
      <div className='chatContainer'>
        <h1 className='chatHeading'>{room}</h1>
        <div className='chatMembers'>
          <h2 className='chatMembersTitle'>Members:</h2>
          <ul className='chatMembersList'>
            {usersInRoom.map((item, i) =>
              <User
                onClick={() => setUserInPrivate(item.name)}
                name={item.name}
                isCurrentUser={(name === item.name)}
                key={i}
              />
            )}
          </ul>
        </div>
        <div className='chatInnerContainer'>
          <Messages
            messageList={messageList}
            name={name}
          />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            name={name}
            inputAddon={InputAddon}
            userInPrivate={userInPrivate}
          />
          <input
            ref={fileRef}
            label='file-picker'
            type='file'
            className='inputFile'
          />
        </div>
      </div>
    </div>
  )
};

export default Chat;