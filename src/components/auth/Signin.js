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
    <div>
      <h2>用户登录</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-row">
          <p>
            {error}
            <br />
            邮箱：
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            密码：
            <input
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
            记住我
            <br />
            <Link to="/forget-password">忘记密码？</Link>
          </p>
        </div>
        <button className="auth-button" type="submit" disabled={isDisabled}>
          {isDisabled ? "正在登录……" : "登录"}
        </button>
      </form>
    </div>
  );
};

export default Signin;
