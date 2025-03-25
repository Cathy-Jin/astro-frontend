import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Dashboard = () => {
  const email = localStorage.getItem("email");

  const navigate = useNavigate();

  if (!email) {
    return (
      <div className="dashboard">
        <NavBar />
        <div className="main-content">
          <p>
            请重新<Link to="/signin">登录</Link>或<Link to="/signup">注册</Link>
            。
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <NavBar />
      <div className="main-content">
        <div className="dashboard-header">
          <h2>你好，{email}</h2>
        </div>
        <div className="dashboard-feature-horizontal-container">
          <button
            className="dashboard-feature-button"
            onClick={() => navigate("/astro-dice")}
          >
            <img
              src="icon/astro-dice.png"
              alt="astro-dice"
              className="dashboard-feature-button-image"
            />
            <p className="button-text">占星骰子</p>
          </button>
          <button
            className="dashboard-feature-button"
            onClick={() => navigate("/notebook")}
          >
            <img
              src="icon/notebook.png"
              alt="my-notebook"
              className="dashboard-feature-button-image"
            />
            <p className="button-text">我的笔记</p>
          </button>
          <button
            className="dashboard-feature-button"
            onClick={() => navigate("/profile")}
          >
            <img
              src="icon/archive.png"
              alt="my-archive"
              className="dashboard-feature-button-image"
            />
            <p className="button-text">我的档案</p>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
