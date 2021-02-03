import React from 'react';
import './Message.css';

export const Message = ({ message: { text, user, url = null }, name }) => {

  let isSentByCurrentUser = false;

  if (user === name) {
     isSentByCurrentUser = true;
  }

  return (
      isSentByCurrentUser ? (<div className='messageContainer justifyReverse'>
        <div className='messageBox colored'>
          {!url && <p className='messageText pl-10'>{text}</p>}
          {url &&  <p className='messageText pl-10'>
          <a className='messageImg' href={url} download>
          <img src={url} alt='file'/><br/>
            {text}
            </a>
          </p>}
        </div>
        <p className='sentMessage'>{user}</p>
      </div>) :
      (<div className='messageContainer justifyStart'>
        <div className='messageBox'>
          {!url && <p className='messageText pl-10'>{text}</p>}
          {url &&  <p className='messageText pl-10'>
          <a className='messageImg' href={url} download>
              <img src={url} alt='file'/><br/>
                  {text}
            </a>
          </p>}
        </div>
        <p className='sentMessage'>{user}</p>
      </div>)
  )
}