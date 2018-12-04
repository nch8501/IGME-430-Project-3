//handles the password update
const handleUpdatePassword = (e) =>{
  e.preventDefault();
  
  //remove message box
  $("#domoMessage").animate({width: 'hide'}, 350);
  
  //check for both passwords
  if($("#pass").val() == '' || $("#pass2").val() == ''){
    handleError("All fields are required");
    return false;
  }
  
  //check that passwords match
  if($("#pass").val() !== $("#pass2").val()){
    handleError("Passwords do not match");
    return false;
  }
  
  //send the ajax request
  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), function(){ 
    handleError("Password successfully changed");
    //show password button again
    ReactDOM.render(
      <PasswordFormButton />,
      document.querySelector("#passwordSection"),
    );
  });
  
  return false; 
};

//handles the profile update
const handleUpdateProfile = (e) =>{
  e.preventDefault();
  
  //remove message box
  $("#domoMessage").animate({width: 'hide'}, 350);
  
  //check for first and last name
  //
  //will later change to not require both
  if($("#firstName").val() == '' || $("#lastName").val() == ''){
    handleError("First and Last Name required");
    return false;
  }
  
  //send ajax request
  sendAjax('POST', $("#profileForm").attr("action"), $("#profileForm").serialize(), function(){
    handleError("Profile Updated");  
  });
  
  return false;
};

//creates the account section
const AccountSection = (props) =>{
  if(!props.account){
    return(
      <div>
        <h3>Unloaded</h3>
      </div>
    );
  }
  
  return(
    <div>
      <h3>Loaded</h3>
      <h4>{props.account.username}</h4>
    </div>
  );
};

//creates the personal section
const PersonalSection = (props) =>{
  console.dir(props.fName);
  console.dir(props.lName);
  return(
    <div>
      <h3>Personal Section</h3>
      <h3>{props.account}</h3>
      <form id="profileForm" name="profileForm"
            onSubmit={handleUpdateProfile}
            action="/updateProfile"
            method="POST"
            className="profileForm"
        >
        <label htmlFor="firstName">First Name: </label>
        <input id="firstName" type="text" name="firstName" placeholder="first name"></input>
        <label htmlFor="lastName">Last Name: </label>
        <input id="lastName" type="text" name="lastName" placeholder="last name"></input>
      
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="Update Profile" />
      </form>
    </div>
  );
};

const Csrf = (props) =>{
  return(
    <div id="csrfToken" hidden value={props.csrf}>   
    </div>
  );
};

//shows Password form
const showPasswordForm = (e) =>{
  //get csrf token
  const csrf = document.querySelector("#csrfToken").getAttribute("value");
  
  //show password form
  ReactDOM.render(
    <PasswordForm csrf={csrf}/>,
    document.querySelector("#passwordSection"),
  );
};

//creates the password form
const PasswordForm = (props) =>{
  return(
    <form id="passwordForm" name="passwordForm"
          onSubmit={handleUpdatePassword}
          action="/updatePassword"
          method='POST'
          className="mainForm"
      >
      <label htmlFor="pass">New Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass2">Retype New Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />    
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Update Password" />
    </form>
  );
};

//creates the button to show the password form
const PasswordFormButton = (props) =>{
  return(
    <div>
      <button onClick={showPasswordForm}>Change Password</button>
    </div>
  );
};

//loads the user's profile information
const loadProfileFromServer = () =>{
  sendAjax('GET', '/getProfile', null, (data) =>{
    //re-render account section
    ReactDOM.render(
      <AccountSection account={data.accountInfo} />,
      document.querySelector("#accountSection"),
    );
    
    //re-render personal section
    const firstName = data.accountInfo.profile.firstName;
    const lastName = data.accountInfo.profile.lastName;
    
    ReactDOM.render(
      <PersonalSection fName={firstName} lName={lastName} />,
      document.querySelector("#personalSection"),
    );
  });
};

//sets up the account page
const setup = function(csrf){  
  //Account section
  ReactDOM.render(
    <AccountSection  />,
    document.querySelector("#accountSection"),
  );
  
  //personal section
  ReactDOM.render(
    <PersonalSection csrf={csrf} />,
    document.querySelector("#personalSection"),
  );
  
  //password change section
  ReactDOM.render(
    <PasswordFormButton />,
    document.querySelector("#passwordSection"),
  );
  
  //csrf section
  ReactDOM.render(
    <Csrf csrf={csrf}/>,
    document.querySelector("#csrf"),
  );

  loadProfileFromServer();
};


//gets the csrf token
const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result) =>{
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});