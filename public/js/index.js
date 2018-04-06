const socket = io();

const messageInput = $('[name=message]');
const locationButton = $('#send-location');

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
  e.preventDefault();

  const newMessage = {
    from: 'User',
    text: messageInput.val()
  }

  socket.emit('createMessage', newMessage, (data) => {
    messageInput.val("");
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

locationButton.on('click', function(e) {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }
  locationButton.attr('disabled', 'disabled');
  locationButton.text('Sending Location...');
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
    locationButton.text('Send Location');
    locationButton.removeAttr('disabled');
    messageInput.focus();
  }, (e) => {
    alert('Unable to fetch location');
    locationButton.removeAttr('disabled');
  })
})
