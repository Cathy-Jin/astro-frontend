import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
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
