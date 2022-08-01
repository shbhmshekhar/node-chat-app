const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

// const chatMessage = document.querySelector('#msg');

document.querySelector('#chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = e.target.elements.message;
  //   console.log('msg', chatMessage.value);
  socket.emit('sendMessage', chatMessage.value, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message delivered');
  });
  chatMessage.value = '';
});

document.querySelector('#sendLocation').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Sharing location is not supported on this browser');
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log('Location shared sucessfully');
      }
    );
  });
});

// socket.on('countUpdated', (count) => {
//   console.log('Count updated', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//   socket.emit('increment');
// });
