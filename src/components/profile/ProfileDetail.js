import React, { useState } from "react";
import {
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import LifeThemeReading from "../content/LifeTheme";

const ProfileDetail = () => {
  const [isLifeThemeReadingLoading, setIsLifeThemeReadingLoading] = useState(false);
  const [showLifeTheme, setShowLifeTheme] = useState(false);

  const [searchParams] = useSearchParams();
  const profile_id = searchParams.get("id") || "";
  const location = useLocation();
  const profile = location.state?.profile; // Get from router state

  const navigate = useNavigate();

  const loadLifeThemeReading = () => {
    setIsLifeThemeReadingLoading(true);
    setShowLifeTheme(true);
  };

  const handleLifeThemeReadingLoaded = () => {
    setIsLifeThemeReadingLoading(false); 
  };

  if (!profile || profile_id !== profile.id) {
    return (
      <div className="profile-detail">
        <NavBar />
        <div className="main-content">
          <p>无法找到档案信息，请重试。</p>
          <button className="auth-button" onClick={() => navigate("/profile")}>
            返回我的档案
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-detail">
      <NavBar />
      <div className="main-content">
        <h1>{profile.name}的档案</h1>
        <div className="result">
          <div className="user-profile-item" key={profile.id}>
            <h3>{profile.name}</h3>
            <p>
              <b>出生时间：</b>
              {profile.year}年{profile.month}月{profile.day}日{profile.hour}时
              {profile.minute}分
            </p>
            <p>
              <b>出生地点：</b>
              {profile.location}
            </p>
            <button
            name="profile-button"
            onClick={() => loadLifeThemeReading()}
            disabled={isLifeThemeReadingLoading}
          >
            {isLifeThemeReadingLoading ? "正在加载……" : "人生主题解读"}
          </button>
          </div>
          
          {showLifeTheme && <LifeThemeReading profile_id={profile.id} onDataLoaded={handleLifeThemeReadingLoaded}/>}
        </div>

        <button className="auth-button" onClick={() => navigate("/profile")}>
          返回我的档案
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileDetail;
