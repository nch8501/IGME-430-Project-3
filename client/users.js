//creates the user section
const UserSection = (props) =>{
  //check for username
  if(!props.username){
    return(
      <div className="userSection">
        <h2>Invalid User</h2>
      </div>
    );
  }
  
  //check if personal info is empty
  if(props.fName == ''){
    props.fName = 'N/A';
  }
  
  if(props.lName == ''){
    props.lName = 'N/A';
  }
  
  return(
    <div className="userSection">
      <h2>User Profile</h2>
      <h3>Username: {props.username}</h3>
      <h3>First Name: {props.fName}</h3>
      <h3>Last Name: {props.lName}</h3>
    </div>
  );
};

//loads the selected user's profile info
const loadUserFromServer = () =>{
  //get the url params
  let urlParams = new URLSearchParams(window.location.search);
  
  //check for username
  if(urlParams.has('username')){
    //get username
    const query = {
      username: urlParams.get('username'),
    };

    //send ajax request
    sendAjax('GET', '/getUserProfile', query, (data) =>{    
      //declare profile info
      let username = '';
      let firstName = '';
      let lastName = '';
            
      //check for profile info
      if(data.profileInfo.username){
        username = data.profileInfo.username;
        
        if(data.profileInfo.profile){
          if(data.profileInfo.profile.firstName){
            firstName = data.profileInfo.profile.firstName;
          }

          if(data.profileInfo.profile.lastName){
            lastName = data.profileInfo.profile.lastName;
          }
        }
      }

      //re-render user section
      ReactDOM.render(
        <UserSection  fName={firstName} lName={lastName} username={username}/>,
        document.querySelector("#userSection"),
      );
    });
  }
};

//sets up the account page
const setup = function(){  
  //User section
  ReactDOM.render(
    <UserSection  />,
    document.querySelector("#userSection"),
  );

  //load user profile from server
  loadUserFromServer();
};

$(document).ready(function(){
  setup();
});