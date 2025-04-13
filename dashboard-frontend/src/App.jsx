import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./components/LoginSignup";
import Dashboard from "./components/Dashboard"; // Import the Dashboard component
import Items from "./Items";
import UserList from "./UserList";
import Payment from "./Payment";
import Home from "./Home";
import About from "./About";
import Inter from "./Intermediate";
import Login from "./components/Login";
import Signup from "./components/Register";
import ImageScope from "./components/ImageScope";
import GisAnalysis from "./components/GisAnalysis";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/items" element={<Items />}></Route>
        <Route path="/login-signup" element={<LoginSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rent" element={<UserList />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/intermediate" element={<Inter />}></Route>
        <Route path="/image-scope" element={<ImageScope />}></Route>
        <Route path="/gis-analysis" element={<GisAnalysis />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
