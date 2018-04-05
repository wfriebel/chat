const expect = require('chai').expect;
const message = require('./message.js');

describe('generateMessage', () => {
  it('Returns a message', () => {
    const from = 'Will';
    const text = 'Hi, this is Will.'
    const newMessage = message.generateMessage(from, text);
    expect(newMessage.from).to.equal(from);
    expect(newMessage.text).to.equal(text);
    expect(newMessage.createdAt).to.be.a('number');
  })
})
