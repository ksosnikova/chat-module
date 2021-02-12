import React from 'react';
import './Message.css';
import pic from '../../assets/images/file.png';

export const Message = ({ message: { text, user, url = null }, name }) => {

  let isSentByCurrentUser = false;

  if ((user === name) || (user.includes('private'))) {
    isSentByCurrentUser = true;
  }

  const isImage = (f) => f.type.indexOf('image') > -1;

  let file = null;

  if (url) {
    const arr = url.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    file = (mime.indexOf('image') > -1) ?
      new Blob([u8arr], { type: mime }) :
      new File([u8arr], text, { type: mime });
  }

  return (
    <div className={isSentByCurrentUser ? 'messageContainer reverse' : 'messageContainer'}>
      <p className='sentMessage'>{user}</p>
      <div className={isSentByCurrentUser ? 'messageSentBy colored' : 'messageSentBy'}>
        {!url && <div className='messageBox'>{text}</div>}
        {url &&
          (isImage(file) ?
            <div className='messageBox'>
              <img className='messageImg' src={url} alt={text} />
              <a href={url} download={text}>{text}</a>
            </div>
            :
            <div className='messageBox'>
              <img className='messageFile' src={pic} alt={text} />
              <a href={URL.createObjectURL(file)} download={text}>{text}</a>
            </div>
          )
        }
      </div>
    </div>
  )
}