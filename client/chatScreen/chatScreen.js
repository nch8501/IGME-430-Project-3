
const handleMessage = (e) =>{
  console.dir("Handling Message");
  e.preventDefault();
  
  sendAjax('POST', $("#messageForm").attr("action"), $("#messageForm").serialize(), function(){ 
    loadMessagesFromServer();
  });
  
  return false; 
};


const ChatHeader = (props) =>{
  return(
  <div>{props.title}</div>
  );
};


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


const MessageForm = (props) =>{
  return(
  <form id="messageForm" name="messageForm"
        onSubmit={handleMessage}
        //change action later
        action="/postMessage"
        method='POST'
        //change class later
        className="domoForm"
    >
    <label htmlFor="message">Message: </label>
    <input id="message" type="text" name="message" placeholder="Message" />
    <input id="csrfToken" type="hidden" name="_csrf" value={props.csrf} />
    
    <input className="maheDomoSubmit" type="submit" value="Post Message" />  
  </form>
  );
};


const loadMessagesFromServer = () =>{
  //need to also send the chat's ID
  sendAjax('GET', '/getMessages', null, (data) =>{
    ReactDOM.render(
      <MessageList messages={data.messages} />,
      document.querySelector("#messageSection")
    );
  });
};


const setup = function(csrf){
  //chat header
  ReactDOM.render(
    <ChatHeader />,
    document.querySelector("#chatHeader"),
  );
  
  //message section
  ReactDOM.render(
    <MessageList messages={[]} />,
    document.querySelector("#messageSection"),
  );
  
  //message creator
  ReactDOM.render(
    <MessageForm csrf={csrf} />,
    document.querySelector("#messageForm"),
  );
  
  //load messages
  loadMessagesFromServer();
};

const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result) =>{
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});