import React, { useEffect, useState } from "react";
import {
  useLocation,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import CircleGraph from "./LifeThemeDiagram";

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
        // setRateLimiting(false);
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
        // setRateLimiting(false);
      }
    };

    fetchLifeTheme();

    // const lastFetch = sessionStorage.getItem("lastFetchTime");
    // const now = Date.now();

    // if (lastFetch && now - lastFetch <= RATE_LIMIT_MS) {
    //   setLoading(false);
    //   setRateLimiting(true);
    // } else {
    //   // Allow API call if no timestamp or enough time has passed
    //   // setRateLimiting(false);
    //   fetchLifeTheme();
    // }
    // sessionStorage.setItem("lastFetchTime", now);
  }, [profile_id, profile]);

  if (!profile || profile.id !== profile_id) {
    return (
      <div className="life-theme-header">
        <p>无法找到档案信息，请重试。</p>
      </div>
    );
  }

  return (
    <>
      <div className="life-theme-header">
        {loading && (
          <p>
            正在努力生成专属于{profile.name}
            的个性化解读，第一次可能需要几分钟的时间，<b>请勿刷新页面</b>
            。谢谢你的耐心等待！
          </p>
        )}
        {/* {rateLimiting && (
          <div className="error">请勿频繁刷新页面。10秒后再试哦~</div>
        )} */}
        {error}
        {reading && (
          <CircleGraph relationships={getRelationships(reading.life_themes)} />
        )}
        <div className="life-theme-faq">
          <h4
            onClick={toggleExpand}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            什么是人生主题？
          </h4>
          {isExpanded && (
            <>
              <p>
                在占星学中，星盘以星座、宫位、行星三大元素构成。这三者互相交织，形成了独特的占星符号体系。
              </p>
              <p>
                人生主题指在本命盘上出现三次及以上的占星规则交互。
                举个例子——金星、天秤座及七宫都代表了7的占星规则。土星、魔羯座及十宫都代表了10的占星规则。那么，土星落在天秤座、金星落在摩羯座、金星在十宫、或者七宫与十宫行星之间形成的主要相位，这些都构成了7-10这一占星规则的交互。如果7-10的能量在本命盘上出现三次及以上，那么它就成为了人生主题。
              </p>
              <p>
                <b>
                  每个人的人生主题不尽相同，数量多少也并无好坏之分。我们都是独一无二的自己。解读仅供参考。
                </b>
              </p>
            </>
          )}
        </div>
      </div>
      {reading.life_themes?.map((life_theme, index) => (
        <LifeThemeItemReading key={index} life_theme={life_theme} />
      ))}
    </>
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
    return [];
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
        <hr />
        <div className="life_theme_item_detail">
          {isOpen && (
            <>
              <div className="life_theme_item_summary">
                <p>{life_theme.reading.summary}</p>
              </div>
              <br />
              <h3>💡</h3>
              <p>
                <b>生活：</b>
                {life_theme.reading.suggestions.life}
              </p>
              <p>
                <b>学习：</b> {life_theme.reading.suggestions.study}
              </p>
              <p>
                <b>工作：</b> {life_theme.reading.suggestions.work}
              </p>
              <p>
                <b>人际：</b> {life_theme.reading.suggestions.relationship}
              </p>
              <br />
              <h3>星盘中表现形式</h3>
                {life_theme.reading.details?.map((detail) => (
                    <p>
                      <b>{detail.pattern}：</b> {detail.interpretation}
                    </p>
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default LifeThemeReading;
