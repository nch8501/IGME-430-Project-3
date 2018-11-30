const crypto = require('crypto');
const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
const convertId = mongoose.Types.ObjectId;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;


const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },

  lastName: {
    type: String,
    trim: true,
  },

  emailAddress: {
    type: String,
    trim: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  profile: {
    type: profileSchema,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
  profile: doc.profile,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.findUsernameById = (id, callback) => {
  const search = {
    _id: id,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) =>
    callback(salt, hash.toString('hex'))
  );
};

AccountSchema.statics.updatePassword = (userId, password, salt, callback) => {
  // create search query
  const query = {
    _id: convertId(userId),
  };

  // update password and salt
  return AccountModel.findOneAndUpdate(query, { $set: { password, salt } }).exec(callback);
};

AccountSchema.statics.authenticate = (username, password, callback) =>
AccountModel.findByUsername(username, (err, doc) => {
  if (err) {
    return callback(err);
  }

  if (!doc) {
    return callback();
  }

  return validatePassword(doc, password, (result) => {
    if (result === true) {
      return callback(null, doc);
    }

    return callback();
  });
});

// finds account by id
AccountSchema.statics.findById = (id, callback) => {
  // create search query
  const query = {
    _id: id,
  };

  return AccountModel.findOne(query).select('username profile').exec(callback);
};


// updates the profile information
AccountSchema.statics.updateProfile = (id, profileData, callback) => {
  // create search query
  const query = {
    _id: convertId(id),
  };

  // update profile object
  return AccountModel.findOneAndUpdate(query, { $set: { profile: profileData } }).exec(callback);
};


AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
