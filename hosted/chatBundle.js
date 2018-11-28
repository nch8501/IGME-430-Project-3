"use strict";

//handles the submission of a new chat
var handleChat = function handleChat(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#chatTitle").val() == '' || $("#chatDescription").val() == '') {
    console.dir('ERROR');
    handleError("Title and Description required to create chat");
    return false;
  }

  //send the chat data to ajax
  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function () {
    //re-load the chat list
    loadChatsFromServer();
  });

  return false;
};

//goes to the selected chat screen
var goToChat = function goToChat(e) {
  e.preventDefault();

  //get the chatId of the selected chat
  var children = e.target.childNodes;
  var chatId = children[1].value;

  //send ajax request
  sendAjax('GET', e.target.getAttribute('action'), $("#" + chatId).serialize(), redirect);

  return false;
};

//creates the chat form to create a new chat
var ChatForm = function ChatForm(props) {
  return React.createElement(
    "div",
    { className: "chatForm" },
    React.createElement(
      "h3",
      null,
      "Create New Chat"
    ),
    React.createElement(
      "form",
      { id: "chatForm", name: "chatForm",
        onSubmit: handleChat
        //change action later
        , action: "/makeChat",
        method: "POST"
      },
      React.createElement(
        "label",
        { htmlFor: "title" },
        "Title: "
      ),
      React.createElement("div", null),
      React.createElement("input", { id: "chatTitle", type: "text", name: "title", placeholder: "Chat Title" }),
      React.createElement("div", null),
      React.createElement(
        "label",
        { htmlFor: "description" },
        "Description: "
      ),
      React.createElement("div", null),
      React.createElement("textarea", { id: "chatDescription", rows: "4", cols: "50", name: "description", placeholder: "Description" }),
      React.createElement("input", { id: "csrfToken", type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("div", null),
      React.createElement("input", { className: "chatFormSubmit", type: "submit", value: "Create Chat" })
    )
  );
};

//creates the list of chats
var ChatList = function ChatList(props) {
  if (props.chats.length === 0) {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h3",
        { className: "emptyChat" },
        "No Chats Yet"
      )
    );
  }

  var chatNodes = props.chats.map(function (chat) {
    return React.createElement(
      "div",
      { key: chat._id, className: "domo" },
      React.createElement(
        "h3",
        { className: "chatTitle" },
        chat.title
      ),
      React.createElement(
        "h4",
        { className: "chatDescription" },
        chat.description
      ),
      React.createElement(
        "form",
        { className: "goToChatForm", name: "goToChatForm",
          onSubmit: goToChat,
          action: "/goToChatScreen",
          method: "GET",
          id: chat._id
        },
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { type: "hidden", name: "chatId", value: chat._id }),
        React.createElement("input", { type: "submit", value: "Enter Chat" })
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
var loadChatsFromServer = function loadChatsFromServer(csrf) {
  //send ajax request
  sendAjax('GET', '/getChats', null, function (data) {
    ReactDOM.render(React.createElement(ChatList, { csrf: csrf, chats: data.chats }), document.querySelector("#chats"));
  });
};

//sets up the chat page
var setup = function setup(csrf) {
  //chat creator
  ReactDOM.render(React.createElement(ChatForm, { csrf: csrf }), document.querySelector("#makeChat"));

  //list of chats
  ReactDOM.render(React.createElement(ChatList, { csrf: csrf, chats: [] }), document.querySelector("#chats"));

  //load chats from the server
  loadChatsFromServer(csrf);
};

//gets the csrf token
var getToken = function getToken() {
  //send ajax request
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
      console.dir(_error);
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};