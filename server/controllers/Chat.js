const models = require('../models');

const Chat = models.Chat;

// renders the chat page
const chatPage = (req, res) => {
  // change to get all chats
  //
  Chat.ChatModel.findByCreatedBy(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('chat', { csrfToken: req.csrfToken(), chats: docs });
  });
};

// creates a new chat
const makeChat = (req, res) => {
  // check for all necessary inputs
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ error: 'Title and Desc. required to create chat' });
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

  // redirect to newly made chat page
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

const getChatByCreatedBy = (request, response) => {
  console.dir('In GetChatByCreatedBy');
  const req = request;
  const res = response;

  // return all chats made by the user
  return Chat.ChatModel.findByCreatedBy(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred when retrieving chats' });
    }

    // return the list of chats
    return res.json({ chats: docs });
  });
};

module.exports.chatPage = chatPage;
module.exports.makeChat = makeChat;
module.exports.getChatByCreatedBy = getChatByCreatedBy;
