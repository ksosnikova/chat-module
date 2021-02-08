import React from 'react';
import userpic from '../../assets/images/user1.png'

export const User = ({ name, isCurrentUser, onClick }) => {

  return (
    <li
      className={isCurrentUser ? 'chatSingleMember active' : 'chatSingleMember'}
      onClick={onClick}>
      <img src={userpic} alt='user' />
      {name}
    </li>
  )
}