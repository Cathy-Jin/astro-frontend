import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setIsDisabled(true);
    const token = searchParams.get("token");

    if (!token) {
      setError(
        <div className="error">
          网址有误，请重试或返回<Link to="/signin">登录</Link>页面。
        </div>
      );
      return;
    }
    if (password !== confirmPassword) {
      setError(<div className="error">两次密码输入不一致，请重试。</div>);
      return;
    }

    try {
      const response = await fetch(
        "https://astro-notebook.onrender.com/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token, password: password }),
          credentials: "include",
        }
      );

      if (response.status === 201) {
        setSuccess(
          <p>
            密码重置成功，正在跳转至<Link to="/signin">登录</Link>页面……
          </p>
        );
        setError("");
        setTimeout(() => navigate("/signin"), 3000); // Redirect after success
      } else if (response.status === 400) {
        setSuccess("");
        setError(
          <div className="error">
            网址有误或已过期，请重试或返回<Link to="/signin">登录</Link>页面。
          </div>
        );
      } else {
        setSuccess("");
        setError(
          <div className="error">
            密码重置不成功，请重试或返回<Link to="/signin">登录</Link>页面。
          </div>
        );
      }
    } catch (error) {
      setSuccess("");
      setError(
        <div className="error">
          密码重置不成功，请重试或返回<Link to="/signin">登录</Link>页面。
        </div>
      );
    }
    setIsDisabled(false);
  };

  return (
    <div className="reset-password">
      <div className="main-content">
        <Link to="/" className="no-underline">
          <h1 className="navbar-title">星迹档案</h1>
        </Link>
        <br />
        <br />
        <div className="info_collector">
          <form className="auth-form" onSubmit={handlePasswordReset}>
            <h2>重置密码</h2>
            <div className="auth-row">
              <p>
                {error}
                新的密码：
                <br />
                <input
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <br />
                确认密码：
                <br />
                <input
                  className="auth-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </p>
            </div>
            <button className="auth-button" type="submit" disabled={isDisabled}>
              {isDisabled ? "正在重置……" : "重置密码"}
            </button>
          </form>
          <br />
          {success}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
