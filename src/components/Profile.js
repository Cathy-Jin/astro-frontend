import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Profile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleHomePage = async () => {
    try {
      navigate('/');  // Redirect to the login page
    } catch (err) {
      console.error("Error logging out:", err.message);
    }
  };

  if (!user) {
    return <div><p>未登录，请<Link to="/signin">登录</Link>或<Link to="/signup">注册</Link>。</p></div>; 
  }

  return (
    <div className="user-profile">
      <p>你好，{user.email}</p>
      <p>专属于你的人生主题解读正在开发中，敬请期待。</p>
      <button className="auth-button" onClick={handleHomePage}>返回首页</button>
    </div>
  );  //TODO: reservation link
};

export default Profile;