//handles the submission of a new chat
const handleChat = (e) =>{
  e.preventDefault();
  
  $("#domoMessage").animate({width: 'hide'}, 350);
  
  if($("#chatTitle").val() == '' || $("#chatDescription").val() == ''){
    console.dir('ERROR');
    handleError("Title and Description required to create chat");
    return false;
  }
  
  //send the chat data to ajax
  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function(){ 
    //re-load the chat list
    loadChatsFromServer();
  });
  
  return false; 
};

//goes to the selected chat screen
const goToChat = (e) =>{
  e.preventDefault();
  
  //get the chatId of the selected chat
  const children = e.target.childNodes;
  const chatId = children[1].value;
    
  //send ajax request
  sendAjax('GET', e.target.getAttribute('action'), $("#" + chatId).serialize(), redirect);  
  
  return false;
};

//creates the chat form to create a new chat
const ChatForm = (props) =>{
  return(
    <div className="chatForm">
      <h3>Create New Chat</h3>
      <form id="chatForm" name="chatForm"
        onSubmit={handleChat}
        //change action later
        action="/makeChat"
        method='POST'
        >
        <label htmlFor="title">Title: </label>
        <div></div>
        <input id="chatTitle" type="text" name="title" placeholder="Chat Title" />
        <div></div>
        <label htmlFor="description">Description: </label>
        <div></div>
        <textarea id="chatDescription" rows="4" cols="50" name="description" placeholder="Description"></textarea>
        <input id="csrfToken" type="hidden" name="_csrf" value={props.csrf} />
        <div></div>
        <input className="chatFormSubmit" type="submit" value="Create Chat" />  
      </form>
    </div>
  );
};

//creates the list of chats
const ChatList = function(props){
  if(props.chats.length === 0){
    return(
      <div>
        <h3 className="emptyChat">No Chats Yet</h3>
      </div>
    );
  }
  
  const chatNodes = props.chats.map(function(chat){
    return(
      <div key={chat._id} className="domo">
        <h3 className="chatTitle">{chat.title}</h3>
        <h4 className="chatDescription">{chat.description}</h4>
        <form className="goToChatForm" name="goToChatForm"
              onSubmit={goToChat}
              action="/goToChatScreen"
              method='GET'
              id={chat._id}
          >
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input type="hidden" name="chatId" value={chat._id} />
          <input type="submit" value="Enter Chat" />
        </form>
      </div>
    );
  });
  
  return(
    <div className="domoList">
      {chatNodes}
    </div>
  );
};

//loads the chats from the server
const loadChatsFromServer = (csrf) =>{
  //send ajax request
  sendAjax('GET', '/getChats', null, (data) =>{
    ReactDOM.render(
      <ChatList csrf={csrf} chats={data.chats} />,
      document.querySelector("#chats")
    );
  });
};

//sets up the chat page
const setup = function(csrf){
  //chat creator
  ReactDOM.render(
    <ChatForm csrf={csrf} />,
    document.querySelector("#makeChat"),
  );
  
  //list of chats
  ReactDOM.render(
    <ChatList csrf={csrf} chats={[]} />,
    document.querySelector("#chats"),
  );
  
  //load chats from the server
  loadChatsFromServer(csrf);
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