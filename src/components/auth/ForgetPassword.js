import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setIsDisabled(true);
    try {
      const response = await fetch(
        "https://astro-notebook.onrender.com/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
          credentials: "include",
        }
      );

      if (response.status === 200) {
        setMessage(
          <p>若该用户存在，重置密码邮件已发送，请前往您的邮箱查看。</p>
        );
        setError("");
      } else {
        setMessage("");
        setError(<div className="error">重置密码邮件发送未成功，请重试。</div>);
      }
    } catch (error) {
      setMessage("");
      setError(<div className="error">重置密码邮件发送未成功，请重试。</div>);
    }
    setIsDisabled(false);
  };

  return (
    <div className="forget-password">
      <div className="main-content">
        <Link to="/" className="no-underline">
          <h1 className="navbar-title">星迹档案</h1>
        </Link>
        <br />
        <br />
        <div className="info_collector">
          <form className="auth-form" onSubmit={handleForgetPassword}>
            <h2>忘记密码？</h2>
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
              </p>
            </div>
            <button className="auth-button" type="submit" disabled={isDisabled}>
              {isDisabled ? "正在验证……" : "验证邮箱"}
            </button>
          </form>
          <br />
          {message}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
