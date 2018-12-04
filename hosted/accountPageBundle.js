"use strict";

//handles the password update
var handleUpdatePassword = function handleUpdatePassword(e) {
  e.preventDefault();

  //remove message box
  $("#domoMessage").animate({ width: 'hide' }, 350);

  //check for both passwords
  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  //check that passwords match
  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  //send the ajax request
  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), function () {
    handleError("Password successfully changed");
    //show password button again
    ReactDOM.render(React.createElement(PasswordFormButton, null), document.querySelector("#passwordSection"));
  });

  return false;
};

//handles the profile update
var handleUpdateProfile = function handleUpdateProfile(e) {
  e.preventDefault();

  //remove message box
  $("#domoMessage").animate({ width: 'hide' }, 350);

  //check for first and last name
  //
  //will later change to not require both
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

//creates the account section
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

//creates the personal section
var PersonalSection = function PersonalSection(props) {
  console.dir(props.fName);
  console.dir(props.lName);
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h3",
      null,
      "Personal Section"
    ),
    React.createElement(
      "h3",
      null,
      props.account
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

var Csrf = function Csrf(props) {
  return React.createElement("div", { id: "csrfToken", hidden: true, value: props.csrf });
};

//shows Password form
var showPasswordForm = function showPasswordForm(e) {
  //get csrf token
  var csrf = document.querySelector("#csrfToken").getAttribute("value");

  //show password form
  ReactDOM.render(React.createElement(PasswordForm, { csrf: csrf }), document.querySelector("#passwordSection"));
};

//creates the password form
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

//creates the button to show the password form
var PasswordFormButton = function PasswordFormButton(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "button",
      { onClick: showPasswordForm },
      "Change Password"
    )
  );
};

//loads the user's profile information
var loadProfileFromServer = function loadProfileFromServer() {
  sendAjax('GET', '/getProfile', null, function (data) {
    //re-render account section
    ReactDOM.render(React.createElement(AccountSection, { account: data.accountInfo }), document.querySelector("#accountSection"));

    //re-render personal section
    var firstName = data.accountInfo.profile.firstName;
    var lastName = data.accountInfo.profile.lastName;

    ReactDOM.render(React.createElement(PersonalSection, { fName: firstName, lName: lastName }), document.querySelector("#personalSection"));
  });
};

//sets up the account page
var setup = function setup(csrf) {
  //Account section
  ReactDOM.render(React.createElement(AccountSection, null), document.querySelector("#accountSection"));

  //personal section
  ReactDOM.render(React.createElement(PersonalSection, { csrf: csrf }), document.querySelector("#personalSection"));

  //password change section
  ReactDOM.render(React.createElement(PasswordFormButton, null), document.querySelector("#passwordSection"));

  //csrf section
  ReactDOM.render(React.createElement(Csrf, { csrf: csrf }), document.querySelector("#csrf"));

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