"use strict";

//handles the submission of a message
var handleMessage = function handleMessage(e) {
  e.preventDefault();

  //send ajax request
  sendAjax('POST', $("#messageForm").attr("action"), $("#messageForm").serialize(), function () {
    var chatId = {
      chatId: document.getElementById("chatId").innerHTML
    };

    document.querySelector('#messageArea').value = '';

    loadMessagesFromServer(chatId);
  });

  return false;
};

//creates the list of messages
var MessageList = function MessageList(props) {
  if (props.messages.length === 0) {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h3",
        { className: "emptyMessage" },
        "No Messages Yet"
      )
    );
  }

  var messageNodes = props.messages.map(function (message) {
    return (
      //change class later
      React.createElement(
        "div",
        { key: message._id, className: "message" },
        React.createElement(
          "h3",
          { className: "messageCreator" },
          message.username
        ),
        React.createElement(
          "h4",
          { className: "messageContent" },
          message.message
        )
      )
    );
  });

  return React.createElement(
    "div",
    null,
    messageNodes
  );
};

//creates message form
var MessageForm = function MessageForm(props) {
  //get the id of the chat
  var chatId = document.getElementById("chatId").innerHTML;

  return React.createElement(
    "form",
    { id: "messageForm", name: "messageForm",
      onSubmit: handleMessage
      //change action later
      , action: "/addMessage",
      method: "POST"
      //change class later
      , className: "messageForm"
    },
    React.createElement(
      "label",
      { htmlFor: "message" },
      "Add Message: "
    ),
    React.createElement("input", { id: "messageArea", type: "text", name: "message", placeholder: "Message" }),
    React.createElement("input", { id: "csrfToken", type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { id: "chatIdForMessage", type: "hidden", name: "chatId", value: chatId }),
    React.createElement("input", { className: "messageSubmit", type: "submit", value: "Post Message" })
  );
};

//loads the list of messages
var loadMessagesFromServer = function loadMessagesFromServer(chatId) {
  sendAjax('GET', '/getMessages', chatId, function (data) {
    ReactDOM.render(React.createElement(MessageList, { messages: data.chat }), document.querySelector("#messageSection"));
  });
};

//sets up the chat screen
var setup = function setup(csrf) {
  //message section
  ReactDOM.render(React.createElement(MessageList, { messages: [] }), document.querySelector("#messageSection"));

  //message creator
  ReactDOM.render(React.createElement(MessageForm, { csrf: csrf }), document.querySelector("#message"));

  //load messages
  var chatId = {
    chatId: document.getElementById("chatId").innerHTML
  };

  loadMessagesFromServer(chatId);
};

//gets the csrf token
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
      console.dir(_error);
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
