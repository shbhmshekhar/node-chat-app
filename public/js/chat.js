const socket = io();

const $messageForm = document.querySelector('#chatForm');
const $msgFormInput = $messageForm.querySelector('input');
const $msgFormButton = $messageForm.querySelector('button');
const $sendLocationBtn = document.querySelector('#sendLocation');
const $messages = document.querySelector('#messages');

const $mesageTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate =
  document.querySelector('#location-template').innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on('message', (message) => {
  console.log('message', message);
  const html = Mustache.render($mesageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

// const chatMessage = document.querySelector('#msg');

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $msgFormButton.setAttribute('disabled', 'disabled');

  const chatMessage = e.target.elements.message;
  //   console.log('msg', chatMessage.value);

  socket.emit('sendMessage', chatMessage.value, (error) => {
    $msgFormButton.removeAttribute('disabled');
    $msgFormInput.value = '';
    $msgFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log('Message delivered');
  });
  chatMessage.value = '';
});

socket.on('sendLocationMessage', (location) => {
  const html = Mustache.render($locationTemplate, {
    username: location.username,
    location: location.url,
    createdAt: moment(location.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
  console.log(location);
});

$sendLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Sharing location is not supported on this browser');
  }
  $sendLocationBtn.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $sendLocationBtn.removeAttribute('disabled');
        console.log('Location shared sucessfully');
      }
    );
  });
});

console.log({ username, room });
socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
