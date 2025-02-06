import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import ForgetPassword from "./components/auth/ForgetPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ProfileOverview from "./components/profile/ProfileOverview";
import CreateProfile from "./components/profile/CreateProfile";
import LifeThemeReading from "./components/content/LifeTheme";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<ProfileOverview />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/life-theme" element={<LifeThemeReading/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
