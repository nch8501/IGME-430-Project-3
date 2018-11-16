//handles the submission of a message
const handleMessage = (e) =>{
  e.preventDefault();
  
  console.dir($("#messageForm").serialize());
  
  //send ajax request
  sendAjax('POST', $("#messageForm").attr("action"), $("#messageForm").serialize(), function(){ 
    console.dir('Message Made');
    
    //loadMessagesFromServer();
    //
    //
  });
  
  return false; 
};

//creates the list of messages
const MessageList = function(props){
  if(props.messages.length === 0){
    return(
      <div className="domoList">
        <h3 className="emptyDomo">No Messages Yet</h3>
      </div>
    );
  }
  
  const messageNodes = props.messages.map(function(message){
    return(
      //change class later
      <div key={message._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName">{message.createdBy}</h3>
        <h4 className="domoAge">{message.message}</h4>
      </div>
    );
  });
  
  return(
    <div className="domoList">
      {messageNodes}
    </div>
  );
};

//creates message form
const MessageForm = (props) =>{  
  //get the id of the chat
  const chatId = document.getElementById("chatId").innerHTML;
  
  return(
  <form id="messageForm" name="messageForm"
        onSubmit={handleMessage}
        //change action later
        action="/addMessage"
        method='POST'
        //change class later
        className="domoForm"
    >
    <label htmlFor="message">Message: </label>
    <input id="message" type="text" name="message" placeholder="Message" />
    <input id="csrfToken" type="hidden" name="_csrf" value={props.csrf} />   
    <input id="chatIdForMessage" type="hidden" name="chatId" value={chatId} />
    <input className="maheDomoSubmit" type="submit" value="Post Message" />  
  </form>
  );
};

//loads the list of messages
const loadMessagesFromServer = () =>{
  //
  //
  //need to also send the chat's ID
  sendAjax('GET', '/getMessages', null, (data) =>{
    ReactDOM.render(
      <MessageList messages={data.messages} />,
      document.querySelector("#messageSection")
    );
  });
};

//sets up the chat screen
const setup = function(csrf){
  
  //message section
  ReactDOM.render(
    <MessageList messages={[]} />,
    document.querySelector("#messageSection"),
  );
  
  //message creator
  ReactDOM.render(
    <MessageForm csrf={csrf} />,
    document.querySelector("#message"),
  );
  
  //
  //
  //load messages
  //loadMessagesFromServer();
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