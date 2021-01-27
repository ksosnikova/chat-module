import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Message.css';

const Message = ({ messageList }) => {

  return (
    <ScrollToBottom className='messages'>
      {messageList.map(({text, user }, i) => (<div key={i}>
        <div className='messageContainer'>
          <div className='messageBox'>
            <p className='messageText'>{text}</p>
          </div>
          <p className='sentMessage'>{user}</p>
        </div>
      </div>))}
      </ScrollToBottom>
  )
}

export default Message;