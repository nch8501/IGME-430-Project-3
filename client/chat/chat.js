//handles the submission of a new chat
const handleChat = (e) =>{
  console.dir("Handling Chat");
  e.preventDefault();
  
  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function(){ 
    loadChatsFromServer();
  });
  
  return false;
  
};



//creates the chat form to create a new chat
const ChatForm = (props) =>{
  return(
  <form id="chatForm" name="chatForm"
        onSubmit={handleChat}
        //change action later
        action="/makeChat"
        method='POST'
        //change class later
        className="domoForm"
    >
    <label htmlFor="title">Title: </label>
    <input id="chatTitle" type="text" name="title" placeholder="Chat Title" />
    <label htmlFor="description">Description: </label>
    <input id="chatDescription" type="text" name="description" placeholder="Description" />
    <input id="csrfToken" type="hidden" name="_csrf" value={props.csrf} />
    
    <input className="maheDomoSubmit" type="submit" value="Create Chat" />  
  </form>
  );
};


const ChatList = function(props){
  if(props.chats.length === 0){
    return(
      //change classes later
      <div className="domoList">
        <h3 className="emptyDomo">No Chats Yet</h3>
      </div>
    );
  }
  
  const chatNodes = props.chats.map(function(chat){
    return(
      //change class later
      <div key={chat._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        <h3 className="domoName">Title: {chat.title}</h3>
        <h3 className="domoAge">Description: {chat.description}</h3>
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
const loadChatsFromServer = () =>{
  sendAjax('GET', '/getChats', null, (data) =>{
    ReactDOM.render(
      <ChatList chats={data.chats} />,
      document.querySelector("#chats")
    );
  });
  
};


const setup = function(csrf){
  
  //chat creator
  ReactDOM.render(
    <ChatForm csrf={csrf} />,
    document.querySelector("#makeChat"),
  );
  
  //list of chats
  ReactDOM.render(
    <ChatList chats={[]} />,
    document.querySelector("#chats"),
  );
  
  //load chats from the server
  loadChatsFromServer();
};

const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result) =>{
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});