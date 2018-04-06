const expect = require('chai').expect;
const {generateMessage, generateLocationMessage} = require('./message.js');

describe('generateMessage', () => {
  it('Returns a message', () => {
    const from = 'Will';
    const text = 'Hi, this is Will.'
    const newMessage = generateMessage(from, text);
    expect(newMessage.from).to.equal(from);
    expect(newMessage.text).to.equal(text);
    expect(newMessage.createdAt).to.be.a('number');
  })
})

describe('generateLocationMessage', () => {
  it('Returns a location message', () => {
    const from = 'Will';
    const lat = 37.786036599999996;
    const lng = -122.39373140000001;
    const newMessage = generateLocationMessage(from, lat, lng);
    expect(newMessage.from).to.equal(from);
    expect(newMessage.url).to.equal(`https://www.google.com/maps?q=${lat},${lng}`)
    expect(newMessage.createdAt).to.be.a('number');
  })
})
