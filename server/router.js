const controllers = require('./controllers');
const mid = require('./middleware');

// routes to go to
const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/chat', mid.requiresLogin, controllers.Chat.chatPage);
  app.get('/goToChatScreen', mid.requiresLogin, controllers.Chat.goToChatScreen);

  app.get('/getChats', mid.requiresLogin, controllers.Chat.getChats);
  app.post('/makeChat', mid.requiresLogin, controllers.Chat.makeChat);

  app.get('/chatScreen', mid.requiresLogin, controllers.ChatScreen.chatScreenPage);
  app.post('/addMessage', mid.requiresLogin, controllers.ChatScreen.addMessage);
  app.get('/getMessages', mid.requiresLogin, controllers.ChatScreen.getMessages);

  app.get('/account', mid.requiresLogin, controllers.Account.updatePasswordPage);
  app.post('/updatePassword', mid.requiresLogin, controllers.Account.updatePassword);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
