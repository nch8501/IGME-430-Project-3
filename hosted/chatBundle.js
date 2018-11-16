"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//handles the submission of a new chat
var handleChat = function handleChat(e) {
  console.dir("Handling Chat");
  e.preventDefault();

  var temp = $("#chatForm").serialize();
  console.dir(typeof temp === "undefined" ? "undefined" : _typeof(temp));

  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function () {
    loadChatsFromServer();
  });

  return false;
};

//shows the database id of the chat
var test = function test(e) {

  var chatId = e.target.getAttribute("id");

  /*
  sendAjax('POST', '/addMessage', $("#chatForm").serialize(), function(){ 
    console.dir('Added Message');
  });
    
  
  console.dir(chatId);
  */

  var temp = {
    chat: chatId
  };

  var tempJson = JSON.stringify(temp);
  console.dir(tempJson);

  sendAjax('GET', '/chatScreen', tempJson, function () {
    console.dir('Added Message');
  });
};

//creates the chat form to create a new chat
var ChatForm = function ChatForm(props) {
  return React.createElement(
    "form",
    { id: "chatForm", name: "chatForm",
      onSubmit: handleChat
      //change action later
      , action: "/makeChat",
      method: "POST"
      //change class later
      , className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "title" },
      "Title: "
    ),
    React.createElement("input", { id: "chatTitle", type: "text", name: "title", placeholder: "Chat Title" }),
    React.createElement(
      "label",
      { htmlFor: "description" },
      "Description: "
    ),
    React.createElement("input", { id: "chatDescription", type: "text", name: "description", placeholder: "Description" }),
    React.createElement("input", { id: "csrfToken", type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "maheDomoSubmit", type: "submit", value: "Create Chat" })
  );
};

var ChatList = function ChatList(props) {
  if (props.chats.length === 0) {
    return (
      //change classes later
      React.createElement(
        "div",
        { className: "domoList" },
        React.createElement(
          "h3",
          { className: "emptyDomo" },
          "No Chats Yet"
        )
      )
    );
  }

  var chatNodes = props.chats.map(function (chat) {
    console.dir(chat._id);
    return (
      //change class later
      React.createElement(
        "div",
        { key: chat._id, id: chat._id, className: "domo", onClick: test },
        React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
        React.createElement(
          "h3",
          { className: "domoName" },
          "Title: ",
          chat.title
        ),
        React.createElement(
          "h3",
          { className: "domoAge" },
          "Description: ",
          chat.description
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: "domoList" },
    chatNodes
  );
};

//loads the chats from the server
var loadChatsFromServer = function loadChatsFromServer() {
  sendAjax('GET', '/getChats', null, function (data) {
    ReactDOM.render(React.createElement(ChatList, { chats: data.chats }), document.querySelector("#chats"));
  });
};

var setup = function setup(csrf) {

  //chat creator
  ReactDOM.render(React.createElement(ChatForm, { csrf: csrf }), document.querySelector("#makeChat"));

  //list of chats
  ReactDOM.render(React.createElement(ChatList, { chats: [] }), document.querySelector("#chats"));

  //load chats from the server
  loadChatsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      console.dir(messageObj);
      handleError(messageObj.error);
    }
  });
};
