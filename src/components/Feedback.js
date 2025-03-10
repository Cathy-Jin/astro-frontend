import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Feedback = () => {
  const [formData, setFormData] = useState({
    feedback: "",
    email: localStorage.getItem("email") || "",
    wechat: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDisabled) return;

    // Check feedback length
    if (formData.feedback.length > 500) {
      setError(
        <div className="error">
          留言字数为{formData.feedback.length}。超过500字啦！
        </div>
      );
      return;
    }

    setIsDisabled(true);

    try {
      // Create a new user with email and password
      const response = await fetch(
        "https://astro-notebook.onrender.com/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (response.ok) {
        setSuccess(<p>留言提交成功！谢谢你的反馈~</p>);
        setError("");
        // Clear form data after submission
        setFormData({
          feedback: "",
          email: localStorage.getItem("email") || "",
          wechat: "",
        });
      } else {
        setError(<div className="error">提交未成功，请重试。</div>);
      }
    } catch (err) {
      setError(<div className="error">提交未成功，请重试。</div>);
    }
    setIsDisabled(false);
  };

  return (
    <div className="feedback">
      <NavBar />
      <div className="main-content">
        <h1>意见反馈</h1>
        <div className="info_collector">
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-row">
              <p><b>
                欢迎在这里留下你的想法！
                <br />
                如果你愿意的话也可以留个联系方式，方便我们和你聊聊～
                <br />
                我们不会主动把你的信息透露给第三方🔒
                <br /> 
                如有疑问，欢迎发送邮件至<a href="mailto:astro.archive.contact@gmail.com">astro.archive.contact@gmail.com</a>。
                </b></p>
            </div>
            <div className="profile-row">
              <p>
                留言 （500字以内）
                <br />
                <textarea
                    className="textbox"
                  type="text"
                  name="feedback"
                  maxLength="500"
                  wrap="soft" rows="20" cols="60"
                  placeholder="请在这里写下你的留言~"
                  value={formData.feedback}
                  onChange={handleChange}
                  required
                />
              </p>
            </div>
            <div className="profile-row">
              <p>
                邮箱（选填）
                <br />
                <input className="profile-input"
                  type="text"
                  name="email"
                  placeholder="你的邮箱"
                  value={formData.email}
                  onChange={handleChange}
                />
              </p>
            </div>
            <div className="profile-row">
              <p>
                微信（选填）
                <br />
                <input className="profile-input"
                  type="text"
                  name="wechat"
                  placeholder="你的微信"
                  value={formData.wechat}
                  onChange={handleChange}
                />
              </p>
            </div>
            <div>
            <p>提交即表示您理解并同意我们的<Link to="/terms-of-service">服务条款</Link>及<Link to="/privacy-policy">隐私政策</Link>。</p>
            <button type="submit" disabled={isDisabled}>
              {isDisabled? "提交中……" : "提交"}
            </button>
            </div>
          </form>
          <br />
          {error}
          {success}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Feedback;
