import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    if (isDisabled) return;

    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError(<div className="error">两次密码输入不一致，请重试。</div>);
      return;
    }

    setIsDisabled(true);
    // TODO: validate password
    try {
      // Create a new user with email and password
      const response = await fetch(
        "https://astro-notebook.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
          credentials: "include",
        }
      );

      if (response.status === 201) {
        setSuccess(
          <p>
            注册成功，正在跳转至<Link to="/signin">登录</Link>页面……
          </p>
        );
        setError("");
        setTimeout(() => navigate("/signin"), 3000); // Redirect after success
      } else if (response.status === 409) {
        setError(
          <div className="error">
            该邮箱已被注册。请<Link to="/signin">登录</Link>或尝试新的邮箱。
          </div>
        );
      } else {
        setError(<div className="error">注册未成功，请重试。</div>);
      }
    } catch (err) {
      setError(<div className="error">注册未成功，请重试。{err.message}</div>);
    }
    setIsDisabled(false);
  };

  return (
    <div>
      <h2>用户注册</h2>
      <form className="auth-form" onSubmit={handleSignUp}>
        <div className="auth-row">
          <p>
            {error}
            <br />
            &ensp;&ensp;&ensp;&ensp;邮箱：
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            &ensp;&ensp;&ensp;&ensp;密码：
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            确认密码：
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </p>
        </div>
        <p>点击“注册”即表示您同意我们的<Link to="/terms-of-service">服务条款</Link>及<Link to="/privacy-policy">隐私政策</Link>。</p>
        <button className="auth-button" type="submit" disabled={isDisabled}>
          {isDisabled ? "正在注册……" : "注册"}
        </button>
      </form>
      <br />
      {success}
    </div>
  );
};

export default Signup;
