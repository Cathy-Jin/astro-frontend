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
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import Feedback from "./components/Feedback";
import NatalChat from "./components/content/NatalChart";

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
          <Route path="/life-theme" element={<LifeThemeReading />} />
          <Route path="/profile-detail" element={<NatalChat />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
