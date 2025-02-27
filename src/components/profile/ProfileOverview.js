import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";

const ProfileOverview = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState(null);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState({}); // To track errors for each profile

  const navigate = useNavigate();

  // Handle profile deletion
  const deleteProfile = async (id) => {
    if (isDeleteDisabled[id]) return;

    setIsDeleteDisabled((prev) => ({
      ...prev,
      [id]: true,
    }));
    // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate API delay
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
    setIsDeleteDisabled((prev) => ({
      ...prev,
      [id]: false,
    }));
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
        } else if (response.status === 403 || response.status === 401) {
          localStorage.clear();
        } else {
          setUser({ email: localStorage.getItem("email") });
          setGeneralError(
            <div className="error">无法找到档案信息，请重试。</div>
          );
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

  return (
    <div className="user-profile-overview">
      <NavBar />
      <div className="main-content">
        <h1>我的档案</h1>
        <h4>
          <Link to="/create-profile">+ 创建档案</Link>
        </h4>
        <div className="result">
          {generalError}
          {profiles?.map((profile) => (
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
                onClick={() =>
                  navigate("/profile-detail?id=" + profile.id, {
                    state: { profile },
                  })
                }
              >
                查看档案
              </button>
              <button
                className="profile-button-2"
                onClick={() => deleteProfile(profile.id, errors)}
                disabled={isDeleteDisabled[profile.id]}
              >
                {isDeleteDisabled[profile.id] ? "正在删除……" : "删除档案"}
              </button>
              {errors[profile.id]}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileOverview;
