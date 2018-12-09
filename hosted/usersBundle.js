"use strict";

var UserSection = function UserSection(props) {
  console.dir(undefined.props);
  console.dir(props);

  return React.createElement(
    "div",
    null,
    "Hello"
  );
};

//sets up the account page
var setup = function setup() {
  //User section
  ReactDOM.render(React.createElement(UserSection, null), document.querySelector("#userSection"));

  //loadUserFromServer();
};

$(document).ready(function () {
  setup();
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