'use strict';

//creates the user section
var UserSection = function UserSection(props) {
  //check for username
  if (!props.username) {
    return React.createElement(
      'div',
      { className: 'userSection' },
      React.createElement(
        'h2',
        null,
        'Invalid User'
      )
    );
  }

  //check if personal info is empty
  if (props.fName == '') {
    props.fName = 'N/A';
  }

  if (props.lName == '') {
    props.lName = 'N/A';
  }

  return React.createElement(
    'div',
    { className: 'userSection' },
    React.createElement(
      'h2',
      null,
      'User Profile'
    ),
    React.createElement(
      'h3',
      null,
      'Username: ',
      props.username
    ),
    React.createElement(
      'h3',
      null,
      'First Name: ',
      props.fName
    ),
    React.createElement(
      'h3',
      null,
      'Last Name: ',
      props.lName
    )
  );
};

//loads the selected user's profile info
var loadUserFromServer = function loadUserFromServer() {
  //get the url params
  var urlParams = new URLSearchParams(window.location.search);

  //check for username
  if (urlParams.has('username')) {
    //get username
    var query = {
      username: urlParams.get('username')
    };

    //send ajax request
    sendAjax('GET', '/getUserProfile', query, function (data) {
      //declare profile info
      var username = '';
      var firstName = '';
      var lastName = '';

      //check for profile info
      if (data.profileInfo.username) {
        username = data.profileInfo.username;

        if (data.profileInfo.profile.firstName) {
          firstName = data.profileInfo.profile.firstName;
        }

        if (data.profileInfo.profile.lastName) {
          lastName = data.profileInfo.profile.lastName;
        }
      }

      //re-render user section
      ReactDOM.render(React.createElement(UserSection, { fName: firstName, lName: lastName, username: username }), document.querySelector("#userSection"));
    });
  }
};

//sets up the account page
var setup = function setup() {
  //User section
  ReactDOM.render(React.createElement(UserSection, null), document.querySelector("#userSection"));

  //load user profile from server
  loadUserFromServer();
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