const models = require('../models');

const Account = models.Account;

// renders the account page
const accountPage = (req, res) => {
  res.render('account', { csrfToken: req.csrfToken() });
};

// updates account password
const updatePassword = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) =>
    // update password
     Account.AccountModel.updatePassword(req.session.account._id, hash, salt, () => {
      //
       res.json({ message: 'password changed' });
     }));
};

// gets the user's profile
const getProfile = (req, res) =>
  Account.AccountModel.findById(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json(
        { error: 'An error occurred while retrieving profile information' });
    }

    // return profile information
    return res.json({ accountInfo: docs });
  });


// updates the user's profile
const updateProfile = (req, res) =>
  Account.AccountModel.updateProfile(req.session.account._id, req.body, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json(
        { error: 'An error occurred while updating your profile' });
    }
    // return updated profile information
    return res.json({ accountInfo: docs });
  });


const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};


module.exports.accountPage = accountPage;
module.exports.getToken = getToken;
module.exports.updatePassword = updatePassword;
module.exports.getProfile = getProfile;
module.exports.updateProfile = updateProfile;
