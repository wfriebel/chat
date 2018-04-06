const socket = io();
socket.on('connect', () => {
  console.log('connected to server');
})

socket.on('disconnect', () => {
  console.log('disconnected from server');
})

socket.on('newMessage', (message) => {
  const li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  $('#messages').append(li);
})

$('#message-form').on('submit', function(e) {
  const messageInput = $('[name=message]');
  e.preventDefault();

  const newMessage = {
    from: 'User',
    text: messageInput.val()
  }

  socket.emit('createMessage', newMessage, (data) => {
    messageInput.val("");
  })
})

const locationButton = $('#send-location');
locationButton.on('click', function(e) {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }, (e) => {
    alert('Unable to fetch location');
  })
})

socket.on('newLocationMessage', (locationMessage) => {
  const li = $('<li></li>');
  li.text(`${locationMessage.from}: `)
  const a = $('<a target="_blank"></a>');
  a.attr('href', locationMessage.url);
  a.text(`My current location`);
  li.append(a);
  $('#messages').append(li);
})
