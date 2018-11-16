const controllers = require('./controllers');
const mid = require('./middleware');

// routes to go to
const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  // app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  // app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);


  app.get('/chat', mid.requiresLogin, controllers.Chat.chatPage);
  app.get('/getChats', mid.requiresLogin, controllers.Chat.getChatByCreatedBy);
  app.post('/makeChat', mid.requiresLogin, controllers.Chat.makeChat);

  app.get('/chatScreen', mid.requiresLogin, controllers.ChatScreen.chatScreenPage);

  app.post('/addMessage', mid.requiresLogin, controllers.ChatScreen.addMessage);


  // app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  // app.delete('/deleteDomo', mid.requiresLogin, controllers.Domo.delete);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
