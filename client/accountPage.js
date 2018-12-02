//handles the password update
const handleUpdatePassword = (e) =>{
  e.preventDefault();
  
  $("#domoMessage").animate({width: 'hide'}, 350);
  
  if($("#pass").val() == '' || $("#pass2").val() == ''){
    handleError("All fields are required");
    return false;
  }
  
  if($("#pass").val() !== $("#pass2").val()){
    handleError("Passwords do not match");
    return false;
  }
  
  //send the ajax request
  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), function(){ 
    handleError("Password successfully changed");
  });
  
  return false; 
};

//handles the profile update
const handleUpdateProfile = (e) =>{
  e.preventDefault();
  
  $("#domoMessage").animate({width: 'hide'}, 350);
  
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

const PersonalSection = (props) =>{
  return(
    <div>
      <h3>Personal Section</h3>
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




//loads the user's profile information
const loadProfileFromServer = () =>{
  sendAjax('GET', '/getProfile', null, (data) =>{
    //re-render account section
    ReactDOM.render(
      <AccountSection account={data.accountInfo} />,
      document.querySelector("#accountSection"),
    );
    
    //re-render personal section
    
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
    <PasswordForm csrf={csrf} />,
    document.querySelector("#passwordForm"),
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