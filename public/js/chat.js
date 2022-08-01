const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

// const chatMessage = document.querySelector('#msg');

document.querySelector('#chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = e.target.elements.message;
  //   console.log('msg', chatMessage.value);
  socket.emit('sendMessage', chatMessage.value, (message) => {
    console.log('Message delivered', message);
  });
  chatMessage.value = '';
});

document.querySelector('#sendLocation').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Sharing location is not supported on this browser');
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
});

// socket.on('countUpdated', (count) => {
//   console.log('Count updated', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//   socket.emit('increment');
// });
