import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import RegisterPage from "./pages/registerpage";
import DashboardPage from "./pages/dashboard";
import IndexPage from "./pages/indexpage";
import ChatroomPage from "./pages/chatroompage";
import makeToast from "./Toaster";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = React.useState(null)
  const setupSocket =()=>{
    const token = localStorage.getItem("CC_Token");
    if(token && !socket){
      const newSocket = io("http://localhost:4000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newSocket.on("disconnect", () =>{
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Connected")
      })

      newSocket.on("connect", ()=>{
        makeToast("success", "Socket Connected!")
      })

      setSocket(newSocket);
    }
  };

  React.useEffect(()=>{
    setupSocket();
    // eslint-disable-next-line
  },[]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={IndexPage} exact />
        <Route path="/login" render={()=><LoginPage setupSocket={setupSocket}/>} exact />
        <Route path="/register" component={RegisterPage} exact />
        <Route path="/dashboard" render={()=><DashboardPage socket={socket}/>} exact />
        <Route path="/chatroom/:id" render={()=><ChatroomPage socket={socket}/>} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;