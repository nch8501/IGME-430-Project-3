const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let ChatModel = {};

const convertId = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  messages: [messageSchema],

  createdBy: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ChatSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  description: doc.description,
  messages: doc.messages,
  createdBy: doc.createdBy,
  createdDate: doc.createdDate,
});

ChatSchema.statics.findByCreatedBy = (creatorId, callback) => {
  const search = {
    createdBy: convertId(creatorId),
  };

  return ChatModel.find(search).select('title description').exec(callback);
};

ChatSchema.statics.deleteChat = (chatId, callback) => {
  // delete chat using its id
  ChatModel.deleteOne({ _id: convertId(chatId) }).exec(callback);
};


ChatModel = mongoose.model('Chat', ChatSchema);

module.exports.ChatModel = ChatModel;
module.exports.ChatSchema = ChatSchema;
