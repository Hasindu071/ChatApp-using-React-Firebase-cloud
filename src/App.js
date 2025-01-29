import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/signUpForm";
import Signin from "./components/signInForm";
import Chat from "./components/ChatPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
