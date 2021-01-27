import React from 'react';

export const User = ({ name, onClick }) => {
  return (
    <li 
      className='chatSingleMember' 
      onClick={onClick}> 
      {name}</li>
  )
}