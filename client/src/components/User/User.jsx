import React from 'react';
import userpic from '../../assets/images/user1.png';
import envelope from '../../assets/images/env5.png';

export const User = ({ name, isCurrentUser, onClick }) => {

  return (
    <li
      className={isCurrentUser ? 'chatSingleMember active' : 'chatSingleMember'}>
      <img src={userpic} alt='user' />
      {name}
      <img src={envelope} onClick={onClick} alt='envelope' />
    </li>
  )
}