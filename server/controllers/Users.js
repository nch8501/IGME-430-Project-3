const models = require('../models');

const Account = models.Account;

// renders the user page
const userPage = (req, res) => {
  res.render('users');
};

// gets the user's profile info
const getUserProfileInfo = (req, res) => {
  Account.AccountModel.getUserProfileInfo(req.query.username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json(
      { error: 'An error occurred while retrieving the user profile info' });
    }

    // return profile info
    return res.json({ profileInfo: docs });
  });
};


module.exports.userPage = userPage;
module.exports.getUserProfileInfo = getUserProfileInfo;
