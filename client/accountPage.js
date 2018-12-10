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
  
  //check for something to update
  if($("#firstName").val() == '' && $("#lastName").val() == ''){
    handleError("First or Last Name required");
    return false;
  }
  
  //send ajax request
  sendAjax('POST', $("#profileForm").attr("action"), $("#profileForm").serialize(), function(){
    handleError("Profile Updated");  
    
    //reload personal section
    loadProfileFromServer();
    
    //show personal section form button again
    ReactDOM.render(
      <PersonalSectionFormButton />,
      document.querySelector("#personalSectionForm"),
    );
  });
  
  return false;
};

//creates the personal section
const PersonalSection = (props) =>{
  //check for names
  if(!props.fName || props.fName == ''){
    props.fName = 'N/A';
  }
  if(!props.lName || props.lName == ''){
    props.lName = 'N/A';
  }
  
  return(
    <div className="personalSection">
      <h2>Personal Section</h2>
      <h3>First Name: {props.fName}</h3>
      <h3>Last Name: {props.lName}</h3>    
    </div>
  );
};

//shows the personal section form
const showPersonalSectionForm = (e) =>{
  //get csrf token
  const csrf = document.querySelector("#csrfToken").getAttribute("value");
  
  //show personal section form
  ReactDOM.render(
    <PersonalSectionForm csrf={csrf}/>,
    document.querySelector("#personalSectionForm"),
  );
};

//creates the personal section form
const PersonalSectionForm = (props) =>{
  return(
    <form id="profileForm" name="profileForm"
            onSubmit={handleUpdateProfile}
            action="/updateProfile"
            method="POST"
            className="personalSectionForm"
        >
        <label htmlFor="firstName">First Name: </label>
        <input id="firstName" type="text" name="firstName" placeholder="first name"></input>
        <label htmlFor="lastName">Last Name: </label>
        <input id="lastName" type="text" name="lastName" placeholder="last name"></input>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="Update Profile" />
    </form>
  );
};

//creates the button to show the personal section form
const PersonalSectionFormButton = (props) =>{
  return(
    <div>
      <button onClick={showPersonalSectionForm} className="formSubmit">Change Personal Info</button>
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
      <button onClick={showPasswordForm} className="formSubmit">Change Password</button>
    </div>
  );
};

//loads the user's profile information
const loadProfileFromServer = () =>{
  sendAjax('GET', '/getProfile', null, (data) =>{    
    //declare first and last names
    let firstName = '';
    let lastName = '';
    
    //see if profile exists
    const profile = data.accountInfo.profile;

    if(profile){
      //see if first and last name exist
      if(profile.firstName){
        firstName = data.accountInfo.profile.firstName;
      }
      
      if(profile.lastName){
        lastName = data.accountInfo.profile.lastName;
      }
    }

    //re-render personal section
    ReactDOM.render(
      <PersonalSection fName={firstName} lName={lastName} />,
      document.querySelector("#personalSection"),
    );
  });
};

//sets up the account page
const setup = function(csrf){  
  //personal section
  ReactDOM.render(
    <PersonalSection csrf={csrf} />,
    document.querySelector("#personalSection"),
  );
  
  //personal section form section
  ReactDOM.render(
    <PersonalSectionFormButton />,
    document.querySelector("#personalSectionForm"),
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