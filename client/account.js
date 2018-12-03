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
  });
  
  return false; 
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

//sets up the account page
const setup = function(csrf){
  //password form
  ReactDOM.render(
    <PasswordForm csrf={csrf} />,
    document.querySelector("#content"),
  );
};


//gets the csrf token
const getToken = () =>{
  //send ajax request
  sendAjax('GET', '/getToken', null, (result) =>{
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});