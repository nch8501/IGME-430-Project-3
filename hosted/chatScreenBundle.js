"use strict";

//handles the submission of a message
var handleMessage = function handleMessage(e) {
  console.dir("Handling Message");
  e.preventDefault();

  sendAjax('POST', $("#messageForm").attr("action"), $("#messageForm").serialize(), function () {
    //loadMessagesFromServer();
  });

  return false;
};

var ChatHeader = function ChatHeader(props) {
  return React.createElement(
    "div",
    null,
    props.title
  );
};

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

var MessageForm = function MessageForm(props) {
  return React.createElement(
    "form",
    { id: "messageForm", name: "messageForm",
      onSubmit: handleMessage
      //change action later
      , action: "/postMessage",
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
    React.createElement("input", { className: "maheDomoSubmit", type: "submit", value: "Post Message" })
  );
};

var loadMessagesFromServer = function loadMessagesFromServer() {
  //need to also send the chat's ID
  sendAjax('GET', '/getMessages', null, function (data) {
    ReactDOM.render(React.createElement(MessageList, { messages: data.messages }), document.querySelector("#messageSection"));
  });
};

var setup = function setup(csrf) {
  //chat header
  ReactDOM.render(React.createElement(ChatHeader, null), document.querySelector("#chatHeader"));

  //message section
  ReactDOM.render(React.createElement(MessageList, { messages: [] }), document.querySelector("#messageSection"));

  //message creator
  ReactDOM.render(React.createElement(MessageForm, { csrf: csrf }), document.querySelector("#messageForm"));

  //load messages
  //loadMessagesFromServer();
};

var getToken = function getToken() {
  console.dir('Getting Token on Chat Screen');
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  console.dir('Chat Screen Ready');
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
