const models = require('../models');
const url = require('url');

const Chat = models.Chat;

// renders the chat page
const chatPage = (req, res) => {
  // get all chats from server
  Chat.ChatModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('chat', { csrfToken: req.csrfToken(), chats: docs });
  });
};

// redirects to the selected chat screen
const goToChatScreen = (req, res) => {
  // get the url parameters
  const params = url.parse(req.url, true).query;

  // check for chatId
  if (!params.chatId) {
    return res.status(400).json({ error: 'An error occurred' });
  }

  // redirect to chat screen page
  return res.json({ redirect: `/chatScreen?chatId=${params.chatId}` });
};

// creates a new chat
const makeChat = (req, res) => {
  console.dir('Testing');
  // check for all necessary inputs
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ error: 'Title and Description required to create chat' });
  }

  // make chat data
  const chatData = {
    title: req.body.title,
    description: req.body.description,
    messages: [],
    createdBy: req.session.account._id,
  };

  // save new chat to database
  const newChat = new Chat.ChatModel(chatData);
  const chatPromise = newChat.save();

  chatPromise.then(() => res.json({ redirect: '/chat' }));

  // catch any errors
  chatPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Chat already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  // return the promise
  return chatPromise;
};

// get chats from server
const getChats = (request, response) => {
  const res = response;

  // return all chats made by the user
  return Chat.ChatModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred when retrieving chats' });
    }

    // return the list of chats
    return res.json({ chats: docs });
  });
};

module.exports.chatPage = chatPage;
module.exports.goToChatScreen = goToChatScreen;
module.exports.makeChat = makeChat;
module.exports.getChats = getChats;
