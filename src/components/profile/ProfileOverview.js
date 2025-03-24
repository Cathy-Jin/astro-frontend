import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { convertToCardinal, toTwoDigits } from "../Util";

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

  if (!user) {
    return (
      <div className="user-profile-overview">
        <NavBar />
        <div className="main-content">
          {loading ? (
            <p>正在获取档案，请稍后。。。</p>
          ) : (
            <p>
              请重新<Link to="/signin">登录</Link>或
              <Link to="/signup">注册</Link>。
            </p>
          )}

          <button className="profile-button" onClick={() => navigate("/")}>
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
        {loading && (
          <div>
            <p>正在获取档案，请稍后。。。</p>
          </div>
        )}
        {generalError}
        <div className="result">
          {profiles?.map((profile) => (
            <div className="user-profile-item" key={profile.id}>
              <h2>
                {profile.name}{" "}
                <button
                  className="profile-button"
                  onClick={() =>
                    navigate("/profile-detail?id=" + profile.id, {
                      state: { profile },
                    })
                  }
                >
                  查看
                </button>
              </h2>
              <div className="user-profile-details-container">
                <div className="user-profile-details">
                  <p>
                    {profile.year}-{toTwoDigits(profile.month)}-
                    {toTwoDigits(profile.day)} {toTwoDigits(profile.hour)}:
                    {toTwoDigits(profile.minute)}
                  </p>
                  <p>{profile.location}</p>
                  <p>{convertToCardinal(profile.lat, profile.lng)}</p>
                </div>
                <button
                  className="deletion-button"
                  onClick={() => deleteProfile(profile.id, errors)}
                  disabled={isDeleteDisabled[profile.id]}
                >
                  <img
                    src="icon/trash.png"
                    alt="删除"
                    className="deletion-button-image"
                  />
                </button>
              </div>
              {errors[profile.id]}
            </div>
          ))}
          {profiles && (<div className="user-profile-item-dash">
            <h2>
              <Link to="/create-profile" className="no-underline">+ 创建档案</Link>
            </h2>
          </div>)}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileOverview;
