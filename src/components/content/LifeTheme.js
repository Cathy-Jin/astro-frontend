import React, { useEffect, useState } from "react";
import {
  useLocation,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";

const LifeThemeReading = () => {
  const [loading, setLoading] = useState(true);
  const [rateLimiting, setRateLimiting] = useState(false);
  const [error, setError] = useState("");
  const [reading, setReading] = useState({});

  const [searchParams] = useSearchParams();
  const profile_id = searchParams.get("id") || "";
  const location = useLocation();
  const profile = location.state?.profile; // Get from router state

  const navigate = useNavigate();

  const RATE_LIMIT_MS = 5000; // 5 seconds

  useEffect(() => {
    const fetchLifeTheme = async () => {
      try {
        setLoading(true);
        setRateLimiting(false);
        const response = await fetch(
          "https://astro-notebook.onrender.com/life-theme",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: localStorage.getItem("user_id"),
              profile_id: profile_id,
            }),
            credentials: "include",
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setReading(data);
        } else if (response.status === 403 || response.status === 401) {
          localStorage.clear();
          setError(
            <div className="error">
              未登录，请重新<Link to="/signin">登录</Link>或
              <Link to="/signup">注册</Link>。
            </div>
          );
        } else if (response.status === 429) {
          setError(
            <div className="error">
              今日的解读名额已满，感谢您的支持与关注。北京时间每天8AM准时刷新名额，记得到时候来试试哦~
            </div>
          );
        } else if (response.status === 409) {
          setError(
            <div className="error">
              正在努力生成专属于{profile.name}
              的个性化解读，可能需要几分钟的时间。谢谢你的耐心等待！
            </div>
          );
        } else {
          setError(
            <div className="error">
              哎呀，解读生成出现了一些问题。请稍后再试。
            </div>
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
        setRateLimiting(false);
      }
    };

    const lastFetch = sessionStorage.getItem("lastFetchTime");
    const now = Date.now();

    if (lastFetch && now - lastFetch <= RATE_LIMIT_MS) {
      setLoading(false);
      setRateLimiting(true);
    } else {
      // Allow API call if no timestamp or enough time has passed
      setRateLimiting(false);
      fetchLifeTheme();
    }
    sessionStorage.setItem("lastFetchTime", now);
  }, [profile_id]);

  if (!profile || profile.id !== profile_id) {
    return (
      <div className="life-theme-reading">
        <NavBar />
        <div className="main-content">
          <p>无法找到档案信息，请重试。</p>
          <button className="auth-button" onClick={() => navigate("/profile")}>
            返回我的档案
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="life-theme-reading">
      <NavBar />
      <div className="main-content">
        <h1>人生主题解读（仅供参考）</h1>
        <div className="result">
          <div className="user-profile-item" key={profile.id}>
            <h3>{profile.name}</h3>
            <p>
              <b>出生时间：</b>
              {profile.year}年{profile.month}月{profile.day}日{profile.hour}时
              {profile.minute}分
            </p>
            <p>
              <b>出生地点：</b>
              {profile.location}
            </p>
          </div>
          {loading && (
            <p textAlign="center">
              正在努力生成专属于{profile.name}
              的个性化解读，第一次可能需要几分钟的时间，<b>请勿刷新页面</b>
              。谢谢你的耐心等待！
            </p>
          )}
          {rateLimiting && (
            <div className="error">请勿频繁刷新页面。10秒后再试哦~</div>
          )}
          {error}
        </div>

        {reading.life_themes?.map((life_theme, index) => (
          <LifeThemeItemReading key={index} life_theme={life_theme} />
        ))}

        <button
          className="profile-button"
          onClick={() =>
            navigate("/profile-detail?id=" + profile.id, {
              state: { profile },
            })
          }
        >
          返回档案详情
        </button>
      </div>
      <Footer />
    </div>
  );
};

function LifeThemeItemReading({ life_theme }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="life_theme_item">
        <h2>
          {life_theme.theme}{" "}
          <button
            className="life_theme_item_collapse_btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "-" : "+"}
          </button>
        </h2>
        <div className="life_theme_item_summary">
          <p>{life_theme.reading.summary}</p>
        </div>
        <div className="life_theme_item_detail">
          {isOpen && (
            <>
              <h3>💡</h3>
              <ul>
                <li>
                  <b>生活</b> {life_theme.reading.suggestions.life}
                </li>
                <li>
                  <b>学习</b> {life_theme.reading.suggestions.study}
                </li>
                <li>
                  <b>工作</b> {life_theme.reading.suggestions.work}
                </li>
                <li>
                  <b>人际</b> {life_theme.reading.suggestions.relationship}
                </li>
              </ul>
              <h3>星盘中表现形式</h3>
              <ul>
                {life_theme.reading.details?.map((detail) => (
                  <li>
                    <p>
                      <b>{detail.pattern}</b> {detail.interpretation}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default LifeThemeReading;
