



const UserSection = (props) =>{
  console.dir(this.props);
  console.dir(props);
  
  return(
    <div>
      Hello
    </div>
  );
};




//sets up the account page
const setup = function(){  
  //User section
  ReactDOM.render(
    <UserSection  />,
    document.querySelector("#userSection"),
  );

  //loadUserFromServer();
};

$(document).ready(function(){
  setup();
});