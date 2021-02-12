import React, { useState } from 'react';
import { Picker } from 'emoji-mart';
import './Input.css';
import 'emoji-mart/css/emoji-mart.css';

const Input = ({ message, setMessage, sendMessage, inputAddon, userInPrivate }) => {

  const [emojiPickerVisible, setShowEmojiPicker] = useState(false);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!emojiPickerVisible);
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    setMessage(message => message + emoji);
    toggleEmojiPicker();
  };

  return (
    <>
      <form className='formMessages' onSubmit={(e) => e.preventDefault()}>
        <input
          type='text'
          placeholder={ userInPrivate? `type a private message to ${userInPrivate}` : 'Type a message'}
          className='inputMessage'
          value={message}
          onChange={ e => setMessage(e.target.value)}
          onKeyPress={ e => e.key === 'Enter' && !(message.trim() === "") && sendMessage(e)}
         />
        <button className='sentFilesBtn' onClick={inputAddon} id='InputAddon'></button>
        <button className='emojiBtn' onClick={toggleEmojiPicker}>&#128578;</button>
        <button className='sendMessageBtn' 
        onClick={(e) => !(message.trim() === "") && sendMessage(e)}>Send</button>
      </form>
      {emojiPickerVisible && <span className='emoji'><Picker onSelect={addEmoji} /></span>}
    </>
  )
}

export default Input;