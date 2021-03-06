const socket = io();

const messageInput = $('[name=message]');
const locationButton = $('#send-location');

const scrollToBottom = () => {
  // Selectors
  const messages = $('#messages');
  const newMessage = messages.children('li:last-child');

  // Heights
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', () => {
  console.log('connected to server');
})

socket.on('disconnect', () => {
  console.log('disconnected from server');
})

socket.on('newMessage', (message) => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = $('#message-template').html();
  const rendered = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(rendered);
  scrollToBottom();

  // Creating elements manually
  // const li = $('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  //
  // $('#messages').append(li);
})

socket.on('newLocationMessage', (locationMessage) => {
  const formattedTime = moment(locationMessage.createdAt).format('h:mm a');
  const template = $('#location-message-template').html();
  const rendered = Mustache.render(template, {
    url: locationMessage.url,
    from: locationMessage.from,
    createdAt: formattedTime
  });
  $('#messages').append(rendered);
  scrollToBottom();
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

locationButton.on('click', function(e) {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }
  locationButton.prop('disabled', true);
  locationButton.text('Sending Location...');
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
    locationButton.text('Send Location');
    locationButton.prop('disabled', false);
    messageInput.focus();
  }, (e) => {
    alert('Unable to fetch location');
    locationButton.prop('disabled', false);
  })
})
