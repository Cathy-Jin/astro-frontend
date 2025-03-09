import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (isDisabled) return;

    setIsDisabled(true);
    e.preventDefault();
    try {
      const response = await fetch(
        "https://astro-notebook.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            delta: rememberMe ? 24 : 1,
          }),
          credentials: "include",
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("email", data.email);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("access_token", data.access_token);
        navigate("/profile");
      } else {
        setError(
          <div className="error">
            邮箱或密码不正确，请重试或
            <Link to="/signup">注册</Link>
            新用户。
          </div>
        );
      }
    } catch (error) {
      setError(
        <div className="error">
          登录失败，请重试或
          <Link to="/signup">注册</Link>
          新用户。
        </div>
      );
    }
    setIsDisabled(false);
  };

  return (
    <div className="signin">
      <div className="main-content">
        <Link to="/" className="no-underline">
          <h1 className="navbar-title">星迹档案</h1>
        </Link>
        <br />
        <br />
        <div className="info_collector">
          
          <form className="auth-form" onSubmit={handleLogin}>
          <h2>欢迎登录</h2>
            <div className="auth-row">
              <p>
                {error}
                邮箱：
                <br />
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <br />
                密码：
                <br />
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <br />
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>记住我</span>
                <span style={{ float: "right" }}>
                  <Link to="/forget-password">忘记密码？</Link>
                </span>
              </p>
            </div>
            <button className="auth-button" type="submit" disabled={isDisabled}>
              {isDisabled ? "正在登录……" : "登录"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
