const models = require('../models');
const url = require('url');

const Chat = models.Chat;
const Account = models.Account;

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

  // get username
  return Account.AccountModel.findUsernameById(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred while posting message' });
    }

    // make message data
    const messageData = {
      message: req.body.message,
      createdBy: req.session.account._id,
      username: docs.username,
    };

    return Chat.ChatModel.addMessage(req.body.chatId, messageData, () =>
      // re-render chat screen
       res.json({ message: 'added' }));
  });
};

// gets the messages of the chat
const getMessages = (request, response) => {
  const req = request;
  const res = response;

  const params = url.parse(req.url, true).query;

  // return all messages for this chat
  return Chat.ChatModel.findById(params.chatId, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred while retrieving messages' });
    }
    return res.json({ chat: docs.messages });
  });
};

module.exports.chatScreenPage = chatScreenPage;
module.exports.addMessage = addMessage;
module.exports.getMessages = getMessages;
