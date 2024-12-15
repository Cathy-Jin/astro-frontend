import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = sessionStorage.getItem('email'); 
        if (email) {
            setUser({email: email})
        }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('https://astro-notebook.onrender.com/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      setUser(null);
      sessionStorage.clear(); // clear session storage
      navigate('/'); // Redirect to home after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar-default">
      <div className="navbar-left">
        <h1 className="navbar-title">星迹档案</h1>
      </div>
      <div className="navbar-right">
        {user ? (
          <div className="navbar-links">
            <button className="navbar-button" onClick={() => navigate("/profile")}>我的档案</button>
            <button className="navbar-button" onClick={handleLogout}>登出</button>
          </div>
        ) : (
          <div className="navbar-links">
            <button className="navbar-button" onClick={() => navigate("/signin")}>登录</button>
            <button className="navbar-button" onClick={() => navigate("/signup")}>注册</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
