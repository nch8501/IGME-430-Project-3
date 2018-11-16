const models = require('../models');
const url = require('url');

const Chat = models.Chat;

// renders the chat screen page
const chatScreenPage = (req, res) => {
  // get the url parameters
  const params = url.parse(req.url, true).query;

  // get chat from server
  Chat.ChatModel.findById(params.chatId, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('chatScreen', { csrfToken: req.csrfToken(), chat: docs });
  });
};

// adds a message to the chat
const addMessage = (req, res) => {
  // check for necessary inputs
  if (!req.body.message) {
    return res.status(400).json({ error: 'Message required' });
  }

  // make message data
  const messageData = {
    message: req.body.message,
    createdBy: req.session.account._id,
  };


  // get specific chat id
  Chat.ChatModel.addMessage(req.body.chatId, messageData, () => {
    console.dir('Made message');
    //
    // re-render chat screen
    return res.json({ x: 'x' });
  });
};

// gets the messages of the chat
const getMessages = (request, response) => {
  console.dir('In GetMessages');
  const req = request;
  const res = response;

  // return all messages for this chat
  //
  //
};

module.exports.chatScreenPage = chatScreenPage;
module.exports.addMessage = addMessage;
module.exports.getMessages = getMessages;
