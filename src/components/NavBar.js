import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUser({ email: email });
    }
  }, []);

  const handleLogout = async () => {
    try {
      setUser(null);
      localStorage.clear();
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar-default">
      <div className="navbar-left">
        <Link to="/" className="no-underline">
          <img
            src="logo_en.png"
            alt="Astro Archive"
            className="navbar-img"
          />
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <div className="navbar-links">
            <button
              className="navbar-button-profile"
              onClick={() => navigate("/dashboard")}
            >
              我的
            </button>
            <button className="navbar-button" onClick={handleLogout}>
              登出
            </button>
          </div>
        ) : (
          <div className="navbar-links">
            <button
              className="navbar-button"
              onClick={() => navigate("/signin")}
            >
              登录
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/signup")}
            >
              注册
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
