import React, { useEffect, useState } from "react";
import {
  useLocation,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import CircleGraph from "./LifeThemeDiagram";
import { toTwoDigits, convertToCardinal } from "../Util";

const LifeThemeReading = () => {
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rateLimiting, setRateLimiting] = useState(false);
  const [error, setError] = useState("");
  const [reading, setReading] = useState({});

  const [searchParams] = useSearchParams();
  const profile_id = searchParams.get("id") || "";
  const location = useLocation();
  const profile = location.state?.profile; // Get from router state

  const navigate = useNavigate();
  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

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
        <div className="user-profile-expansion-item" key={profile.id}>
          <div className="user-profile-expansion-details-container">
            <div className="user-profile-details">
              <h2>{profile.name}</h2>
              <p>
                {profile.year}-{toTwoDigits(profile.month)}-
                {toTwoDigits(profile.day)} {toTwoDigits(profile.hour)}:
                {toTwoDigits(profile.minute)}
              </p>
              <p>{profile.location}</p>
              <p>{convertToCardinal(profile.lat, profile.lng)}</p>
              <p>Placidus宫位制</p>
              <h1>人生主题</h1>
              <p
                onClick={toggleExpand}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                什么是人生主题？
              </p>
              {isExpanded && (
                <>
                  <p>
                    在占星学中，星盘以星座、宫位、行星三大元素构成。这三者互相交织，形成了独特的占星符号体系。
                  </p>
                  <p>
                    “人生主题”指在本命盘中，某些特定的占星规则以三种或多种形式出现时所形成的强大动力。
                  </p>
                  <p>
                    比如，土星落在天秤座、金星落在摩羯座、或者七宫与十宫之间的相位互动，这些都构成了7-10这一人生主题。
                  </p>
                  <p>
                    <b>
                      每个人的人生主题不尽相同，数量多少也并无好坏之分。我们都是独一无二的自己。
                    </b>
                  </p>
                </>
              )}
            </div>
            {reading && (
              <CircleGraph
                relationships={getRelationships(reading.life_themes)}
              />
            )}
          </div>
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

        <div className="result">
          <p><b>解读按人生主题能量从高到低排序，内容仅供参考。</b></p>
          {reading.life_themes?.map((life_theme, index) => (
            <LifeThemeItemReading key={index} life_theme={life_theme} />
          ))}
        </div>

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

function getRelationships(life_themes) {
  const relationships = [];
  life_themes?.map((item) => {
    const matches = item.theme.match(/\d+/g);
    if (matches) {
      if (matches.length === 1) {
        relationships.push([parseInt(matches[0]), parseInt(matches[0])]);
      } else {
        relationships.push([parseInt(matches[0]), parseInt(matches[1])]);
      }
    }
  }); 
  return relationships;
}

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
