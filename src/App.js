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
import AstroDice from "./components/content/AstroDice";
import Notebook from "./components/notebook/Notebook";
import Note from "./components/notebook/Note";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Home />} />
          {/* AuthN/Z */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Profile */}
          <Route path="/profile" element={<ProfileOverview />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/profile-detail" element={<NatalChat />} />
          {/* Notebook */}
          <Route path="/notebook" element={<Notebook />} />
          <Route path="/note" element={<Note />} />
          {/* Feature */}
          <Route path="/astro-dice" element={<AstroDice />} />
          <Route path="/life-theme" element={<LifeThemeReading />} />
          {/* Others */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
