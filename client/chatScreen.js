//handles the submission of a message
const handleMessage = (e) =>{
  e.preventDefault();
  
  $("#domoMessage").animate({width: 'hide'}, 350);
  
  if($("#messageArea").val() == ''){
    handleError("Message Required");
    return false;
  }
  
  //send ajax request
  sendAjax('POST', $("#messageForm").attr("action"), $("#messageForm").serialize(), function(){ 
    const chatId ={
      chatId: document.getElementById("chatId").innerHTML,
    };
    
    document.querySelector('#messageArea').value = '';
    
    loadMessagesFromServer(chatId);
  });
  
  return false; 
};

//creates the list of messages
const MessageList = function(props){
  if(props.messages.length === 0){
    return(
      <div>
        <h3 className="emptyMessage">No Messages Yet</h3>
      </div>
    );
  }
  
  const messageNodes = props.messages.map(function(message){
    return(
      //change class later
      <div key={message._id} className="message">
        <h3 className="messageCreator">{message.username}</h3>
        <h4 className="messageContent">{message.message}</h4>
      </div>
    );
  });
  
  return(
    <div>
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
        className="messageForm"
    >
    <label htmlFor="message">Add Message: </label>
    <input id="messageArea" type="text" name="message" placeholder="Message" />
    <input id="csrfToken" type="hidden" name="_csrf" value={props.csrf} />   
    <input id="chatIdForMessage" type="hidden" name="chatId" value={chatId} />
    <input className="messageSubmit" type="submit" value="Post Message" />  
  </form>
  );
};

//loads the list of messages
const loadMessagesFromServer = (chatId) =>{
  sendAjax('GET', '/getMessages', chatId, (data) =>{
    ReactDOM.render(
      <MessageList messages={data.chat} />,
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
  
  //load messages
  const chatId ={
      chatId: document.getElementById("chatId").innerHTML,
    };

  loadMessagesFromServer(chatId);
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