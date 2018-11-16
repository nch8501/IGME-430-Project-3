const models = require('../models');

const Chat = models.Chat;

// renders the chat screen page
const chatScreenPage = (req, res) => {
  console.dir('On Chat Screen');
  console.dir(req.body);
  //
  //
  //

  // change to proper id later
  //
  Chat.ChatModel.findById('5bec7804575c0c1f6c6a2d5a', (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('chatScreen', { csrfToken: req.csrfToken(), chat: docs });
  });
};

// adds a message to the chat
const addMessage = (req, res) => {
  console.dir('Making Message');
/*
  // check for necessary inputs
  if (!req.body.message) {
    return res.status(400).json({ error: 'Message required' });
  }

  // make message data
  const messageData = {
    message: req.body.message,
    createdBy: req.session.account._id,
  };
*/

  // example message data
  const messageData = {
    message: 'Hello Everyone',
    createdBy: req.session.account._id,
  };

  const temp = Chat.ChatModel.findById('5bec7804575c0c1f6c6a2d5a', () => {


  });


  // get specific chat id
  //
  /* Chat.ChatModel.addMessage('5bec7804575c0c1f6c6a2d5a', messageData, ()=>{
    console.dir('Made message');
    //
    //re-render chat screen
  });
  */
  return false;
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
