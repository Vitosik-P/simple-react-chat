import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'

const WebSock = () => {
  const [messages, setMassages] = useState([]);
  const [value, setValue] = useState('');
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = ()=>{
      setConnected(true);
      const message = {
        event: 'connection',
        username,
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message));
      console.log('socket open');
    }
    socket.current.onmessage = (event)=>{
      const message = JSON.parse(event.data);
      setMassages( prev => [message, ...prev])
      console.log('socket message')
    }
    socket.current.onclose = ()=>{
      console.log('socket close')
    }
    socket.current.onerror = ()=>{
      console.log('socket error')
    }
    
  }


  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message'
    }
    socket.current.send(JSON.stringify(message));
    setValue('')
  }

  if(!connected){
    return(
      <div className="center">
        <div className="form">
          <input 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          type="text" 
          placeholder="Введите ваше имя"
          />
          <button onClick={connect}>Войти</button>
        </div>
      </div>
    )
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input type="text" value={value} onChange={e => setValue(e.target.value)} />
          <button onClick={sendMessage}>Отправить</button>
        </div>
        <div className="massages">
          {messages.map(mess =>
            <div key={mess.id}>
              {mess.event === 'connection'
              ? <div className="connection_message">Пользователь {mess.username} подключился</div>
              : <div className="message">{mess.username}. {mess.message}</div>}
            </div>
          )}
        </div>
      </div>


    </div>
  );
}

export default WebSock;