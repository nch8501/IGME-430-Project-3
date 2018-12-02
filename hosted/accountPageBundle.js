"use strict";

//handles the password update
var handleUpdatePassword = function handleUpdatePassword(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  //send the ajax request
  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), function () {
    handleError("Password successfully changed");
  });

  return false;
};

//handles the profile update
var handleUpdateProfile = function handleUpdateProfile(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#firstName").val() == '' || $("#lastName").val() == '') {
    handleError("First and Last Name required");
    return false;
  }

  //send ajax request
  sendAjax('POST', $("#profileForm").attr("action"), $("#profileForm").serialize(), function () {
    handleError("Profile Updated");
  });

  return false;
};

var AccountSection = function AccountSection(props) {
  if (!props.account) {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h3",
        null,
        "Unloaded"
      )
    );
  }

  return React.createElement(
    "div",
    null,
    React.createElement(
      "h3",
      null,
      "Loaded"
    ),
    React.createElement(
      "h4",
      null,
      props.account.username
    )
  );
};

var PersonalSection = function PersonalSection(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h3",
      null,
      "Personal Section"
    ),
    React.createElement(
      "form",
      { id: "profileForm", name: "profileForm",
        onSubmit: handleUpdateProfile,
        action: "/updateProfile",
        method: "POST",
        className: "profileForm"
      },
      React.createElement(
        "label",
        { htmlFor: "firstName" },
        "First Name: "
      ),
      React.createElement("input", { id: "firstName", type: "text", name: "firstName", placeholder: "first name" }),
      React.createElement(
        "label",
        { htmlFor: "lastName" },
        "Last Name: "
      ),
      React.createElement("input", { id: "lastName", type: "text", name: "lastName", placeholder: "last name" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Update Profile" })
    )
  );
};

var PasswordForm = function PasswordForm(props) {
  return React.createElement(
    "form",
    { id: "passwordForm", name: "passwordForm",
      onSubmit: handleUpdatePassword,
      action: "/updatePassword",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "New Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "Retype New Password: "
    ),
    React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Update Password" })
  );
};

//loads the user's profile information
var loadProfileFromServer = function loadProfileFromServer() {
  sendAjax('GET', '/getProfile', null, function (data) {
    //re-render account section
    ReactDOM.render(React.createElement(AccountSection, { account: data.accountInfo }), document.querySelector("#accountSection"));

    //re-render personal section
  });
};

//sets up the account page
var setup = function setup(csrf) {
  //Account section
  ReactDOM.render(React.createElement(AccountSection, null), document.querySelector("#accountSection"));

  //personal section
  ReactDOM.render(React.createElement(PersonalSection, { csrf: csrf }), document.querySelector("#personalSection"));

  //password change section
  ReactDOM.render(React.createElement(PasswordForm, { csrf: csrf }), document.querySelector("#passwordForm"));

  loadProfileFromServer();
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