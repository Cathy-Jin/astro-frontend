import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";

const ProfileOverview = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState(null);
  const [errors, setErrors] = useState({}); // To track errors for each profile

  const navigate = useNavigate();

  // Handle profile deletion
  const deleteProfile = async (id) => {
    try {
      const response = await fetch(
        "https://astro-notebook.onrender.com/profile",
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            user_id: localStorage.getItem("user_id"),
          }),
          credentials: "include",
        }
      );

      if (response.status === 201) {
        // Remove the deleted profile from the list
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile.id !== id)
        );
        setErrors((prevError) => ({ ...prevError, [id]: null })); // Clear error for the profile
      } else {
        setErrors((prevError) => ({
          ...prevError,
          [id]: <div className="error">删除失败，请刷新或重试。</div>,
        }));
      }
    } catch (error) {
      setErrors((prevError) => ({
        ...prevError,
        [id]: <div className="error">删除失败，请刷新或重试。</div>,
      }));
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://astro-notebook.onrender.com/profile?user_id=" +
            localStorage.getItem("user_id"),
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            credentials: "include", // Include cookies in the request
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setUser({ email: localStorage.getItem("email") });
          setProfiles(data.profiles);
        } else {
          localStorage.clear();
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div>
        <p>正在获取档案，请稍后。。。</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-overview">
        <NavBar />
        <div className="main-content">
          <p>
            未登录，请重新<Link to="/signin">登录</Link>或
            <Link to="/signup">注册</Link>。
          </p>
          <button className="auth-button" onClick={() => navigate("/")}>
            返回首页
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // TODO: improve UI.
  return (
    <div className="user-profile-overview">
      <NavBar />
      <div className="main-content">
        <h1>我的档案</h1>
        <h4>
          <Link to="/create-profile">+ 创建档案</Link>
        </h4>
        <div className="result">
          {profiles.map((profile) => (
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
                className="profile-button"
                onClick={() => navigate("/life-theme?name=" + profile.name)}
              >
                人生主题解读
              </button>
              <button
                name="profile-button"
                onClick={() => deleteProfile(profile.id, errors)}
              >
                删除档案
              </button>
              {errors[profile.id]}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  ); //TODO: reservation link
};

export default ProfileOverview;
