"use strict";

//handles the submission of a new chat
var handleChat = function handleChat(e) {
  e.preventDefault();

  //send the chat data to ajax
  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function () {
    //re-load the chat list
    //
    //need to send token
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

//creates the list of chats
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
    return (
      //change class later
      React.createElement(
        "div",
        { key: chat._id, className: "domo" },
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
        ),
        React.createElement(
          "form",
          { name: "goToChatForm",
            onSubmit: goToChat,
            action: "/goToChatScreen",
            method: "GET",
            id: chat._id
          },
          React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
          React.createElement("input", { type: "hidden", name: "chatId", value: chat._id }),
          React.createElement("input", { type: "submit", value: "Got to Chat" })
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
