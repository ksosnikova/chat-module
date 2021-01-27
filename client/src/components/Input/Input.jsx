import React, { useState } from 'react';
import './Input.css';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const Input = ({ message, setMessage, sendMessage }) => {

  const [emojiPickerVisible, setShowEmojiPicker] = useState(false);

  // handleChange = (e) => {
  //   setMessage(prev => { prev + e.target.value })
  // }

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
          placeholder='Type a message'
          className='inputMessage'
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
        />

        <button className='emojiBtn' onClick={toggleEmojiPicker}>&#128578;</button>

        <button className='sendMessageBtn' onClick={(e) => sendMessage(e)}>Send</button>
      </form>
      {emojiPickerVisible && <span className='emoji'><Picker onSelect={addEmoji} /></span>}
    </>
  )
}

export default Input;