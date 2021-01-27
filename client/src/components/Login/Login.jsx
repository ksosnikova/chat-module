import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Login.css';

const Login = () => {

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  // const loginHandler = async () => {
  //   try {
  //     const response = await fetch('/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json;charset=utf-8'
  //       },
  //       body: JSON.stringify({ room, name })
  //     });
  //     const data = await response.json();
  //     console.log('data from server', data)
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  return (
    <div className='loginContainer'>
      <div className='loginInnerContaier'>
        <h1 className='heading'>Login</h1>
        <div><input type='text' placeholder='name' className='loginInput' onChange={(e) => setName(e.target.value)} /></div>
        <div><input type='text' placeholder='room' className='loginInput' onChange={(e) => setRoom(e.target.value)} /></div>
        <Link onClick={e => (!name || !room) ? e.preventDefault() : null} to={`/chat?name=${name}&room=${room}`} >
          <button className='button' type='submit'>Sign in</button>
        </Link>
      </div>
    </div>
  )
};

export default Login;