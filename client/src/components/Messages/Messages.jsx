import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Message } from '../Message/Message';
import './Messages.css';

const Messages = ({ messageList, name }) => {

  return (
    <ScrollToBottom className='messages'>
      {messageList.map((message, i) =>
        (<div key={i}>
          <Message
            message={message}
            name={name}
          />
        </div>))}
    </ScrollToBottom>
  )
}

export default Messages;