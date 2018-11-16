"use strict";

//handles the submission of a message
var handleMessage = function handleMessage(e) {
  e.preventDefault();

  console.dir($("#messageForm").serialize());

  //send ajax request
  sendAjax('POST', $("#messageForm").attr("action"), $("#messageForm").serialize(), function () {
    console.dir('Message Made');

    //loadMessagesFromServer();
    //
    //
  });

  return false;
};

//creates the list of messages
var MessageList = function MessageList(props) {
  if (props.messages.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        "No Messages Yet"
      )
    );
  }

  var messageNodes = props.messages.map(function (message) {
    return (
      //change class later
      React.createElement(
        "div",
        { key: message._id, className: "domo" },
        React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
        React.createElement(
          "h3",
          { className: "domoName" },
          message.createdBy
        ),
        React.createElement(
          "h4",
          { className: "domoAge" },
          message.message
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: "domoList" },
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
      , className: "domoForm"
    },
    React.createElement(
      "label",
      { htmlFor: "message" },
      "Message: "
    ),
    React.createElement("input", { id: "message", type: "text", name: "message", placeholder: "Message" }),
    React.createElement("input", { id: "csrfToken", type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { id: "chatIdForMessage", type: "hidden", name: "chatId", value: chatId }),
    React.createElement("input", { className: "maheDomoSubmit", type: "submit", value: "Post Message" })
  );
};

//loads the list of messages
var loadMessagesFromServer = function loadMessagesFromServer() {
  //
  //
  //need to also send the chat's ID
  sendAjax('GET', '/getMessages', null, function (data) {
    ReactDOM.render(React.createElement(MessageList, { messages: data.messages }), document.querySelector("#messageSection"));
  });
};

//sets up the chat screen
var setup = function setup(csrf) {

  //message section
  ReactDOM.render(React.createElement(MessageList, { messages: [] }), document.querySelector("#messageSection"));

  //message creator
  ReactDOM.render(React.createElement(MessageForm, { csrf: csrf }), document.querySelector("#message"));

  //
  //
  //load messages
  //loadMessagesFromServer();
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
