import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LifeThemeReading = ({ profile_id, onDataLoaded }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reading, setReading] = useState({});

  useEffect(() => {
    const fetchLifeTheme = async () => {
      try {
        setLoading(true);
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
        onDataLoaded();
      }
    };

    fetchLifeTheme();
  }, [profile_id, onDataLoaded]);

  return (
    <div className="life-theme-reading">
      <div className="result">
        {loading && (
          <p>
            正在努力生成专属于你的个性化解读，可能需要几分钟的时间，
            <b>请勿刷新页面</b>。谢谢你的耐心等待！
          </p>
        )}
        {error}

        {reading.life_themes?.map((life_theme, index) => (
          <LifeThemeItemReading key={index} life_theme={life_theme} />
        ))}
      </div>
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
