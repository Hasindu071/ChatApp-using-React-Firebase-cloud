import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./components/signUpForm";
import Signin from "./components/signInForm";
import Chat from "./components/ChatPage";
import Dashboard from "./components/dashboard";
import UserList from "./components/UserList";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path = "/userlist" element = {<UserList />} />

      </Routes>
    </Router>
  );
}

export default App;
