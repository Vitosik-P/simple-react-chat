const ws = require('ws');

const wss = new ws.Server(
  {
    port: 5000
  },
  () => console.log('server started')
);

wss.on('connection', function connection(ws){
  ws.on('message', function (message){
    message = JSON.parse(message);
    switch(message.event){
      case 'message':
        brodcastMessage(message);
        break;
      case 'connection':
        brodcastMessage(message);
        break;

    }
  })
});

function brodcastMessage(message){
  wss.clients.forEach( client => {
    client.send(JSON.stringify(message))
  })
}

/*const message = {
  event: 'message/connection',
  id: 123,
  date: '12.04.2021',
  username: 'Vitos',
  message: 'Some text'
}*/
