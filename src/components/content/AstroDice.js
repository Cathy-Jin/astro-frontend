import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { getSeededRNG, displayAstroDiceRolls } from "../Util";

const AstroDice = () => {
  const [isFaqExpanded, setIsFaqExpanded] = useState(false);
  const [isInstructionExpanded, setIsInstructionExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noteError, setNoteError] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [rolls, setRolls] = useState([]);
  const textareaRef = useRef(null);

  const navigate = useNavigate();
  const toggleFaqExpand = () => {
    setIsFaqExpanded((prevState) => !prevState);
  };
  const toggleInstructionExpand = () => {
    setIsInstructionExpanded((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setQuestion(e.target.value);
    textareaRef.current.style.height = "auto"; // Reset height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
  };

  const userId = localStorage.getItem("user_id");

  const rollDice = (times) => {
    setResult(null);
    setError("");
    setNoteError("");
    setLoading(false);

    if (!question) {
      setError(<div className="error">请输入问题。</div>);
      return;
    }
    let rolls = [];
    let timestamp = Date.now();

    for (let i = 0; i < times; i++) {
      let p_roll = getSeededRNG(12, question, userId, timestamp);
      let z_roll = getSeededRNG(12, question, userId, timestamp);
      let h_roll = getSeededRNG(12, question, userId, timestamp);
      rolls[i] = p_roll + "x" + z_roll + "x" + h_roll;
    }

    setRolls(rolls);
  };

  const fetchAndSave = async (reading) => {
    try {
      setLoading(true);
      setNoteError("");
      setResult(null);
      setError("");

      if (!question) {
        setNoteError(<div className="error">请输入问题。</div>);
        return;
      }
      const response = await fetch(
        "https://astro-notebook.onrender.com/astro-dice",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            question: question,
            rolls: rolls,
            reading: reading,
          }),
          credentials: "include",
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setResult(data);
      } else if (
        response.status === 403 ||
        response.status === 401 ||
        response.status === 422
      ) {
        localStorage.clear();
        setNoteError(
          <div className="error">
            请重新<Link to="/signin">登录</Link>或<Link to="/signup">注册</Link>
            。
          </div>
        );
        setResult(null);
      } else if (response.status === 429) {
        setNoteError(
          <p>
            今日的免费解读次数已用完。请明天来试试哦~
            <br />
            若要保存骰子结果以便日后复盘，请点击保存至笔记。
          </p>
        );
        setResult(null);
      } else if (response.status === 409) {
        setNoteError(
          <div className="error">
            正在努力生成解读，<b>请勿刷新页面</b>。谢谢你的耐心等待！
          </div>
        );
        setResult(null);
      } else {
        setNoteError(
          <div className="error">哎呀，出现了一些问题。请稍后再试。</div>
        );
        setResult(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="astro-dice">
        <NavBar />
        <div className="main-content">
          <p>
            未登录，请先<Link to="/signin">登录</Link>或
            <Link to="/signup">注册</Link>。
          </p>
          <button className="profile-button" onClick={() => navigate("/")}>
            返回首页
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="astro-dice">
      <NavBar />
      <div className="main-content">
        <h1>占星骰子</h1>
        <div className="background">
          <h4
            onClick={toggleFaqExpand}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            什么是占星骰子？
          </h4>
          {isFaqExpanded && (
            <>
              <p>
                <b>什么是占星骰子？</b>
                <br />
                占星骰子是一种简单快捷的占卜工具，通过一次投掷三个骰子（分别代表星体、星座、宫位）获得组合，从中解读启示。它不同于传统命理预测，更像一种<b>启发式工具</b>，帮助提问者从新角度思考问题。
              </p>
              <p>
                <b>如何向骰子提问？</b>
                <br />
                1. 问题需具体明确。
                <br />
                避免模糊运势类提问：如“下个月财运如何？”应改为事件导向问题，例如“做某项目对我的影响如何？”。
                <br />
                拆分选择类问题：可分别投掷“选择A的结果”与“选择B的结果”对比利弊（如“如果我买包，会有什么影响”
                vs “如果不买包，会有什么影响”）。
                <br />
                2. 一事一卜，忌重复提问。
                <br />
                同一事件不同角度提问会降低结果准确性，且反映了提问者的焦虑心态。建议首次解读后先行动起来。
                <br />
                3. 多提开放性问题。
                <br />
                骰子擅长揭示当前状态与潜在问题，而非最终结果。
                <br />
                4. 限定合理时间范围。
                <br />
                骰子适用于短期，长期问题（如“三年后事业”）需结合本命盘分析。
              </p>
              <p>
                <b>不义不占、不疑不占、不诚不占。</b>
              </p>
            </>
          )}
        </div>
        <div className="note-input-collector">
          <textarea
            ref={textareaRef}
            className="general-reading-input"
            type="text"
            name="question"
            maxLength="500"
            placeholder="请输入一个与自己相关的开放式问题，并简要说明背景。若涉及未来时间，建议限定在1个月内。"
            value={question}
            onChange={handleChange}
            required
          />
          <div className="general-reading-button-container">
            <p>
              <button onClick={() => rollDice(1)}>掷一次</button>
              &nbsp;&nbsp;&nbsp;&nbsp;<span>或</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <button onClick={() => rollDice(3)}>掷三次</button>
            </p>
          </div>
        </div>

        {error}
        {rolls.length > 0 && (
          <>
            <div className="result">
              <div className="note-comment">
                <h2>骰子结果</h2>
                <p
                  onClick={toggleInstructionExpand}
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    textAlign: "left",
                  }}
                >
                  怎么解读结果？
                </p>
                {isInstructionExpanded && (<>
                  <p>
                    “星体”代表“对象”—— What
                    <br />
                    “星座”代表“形式”—— How
                    <br />
                    “宫位”代表“地点/领域”—— Where
                    <br />
                  </p>
                  <p>每位用户每天可以使用2次免费解读。解读生成后会自动保存到“我的笔记”。用户也可以选择直接将骰子结果保存至笔记，以便日后复盘。</p></>
                )}
                {displayAstroDiceRolls(rolls)}
                <div className="general-reading-button-container">
                  <p>
                    <button
                      className="general-reading-button"
                      onClick={() => fetchAndSave(false)}
                    >
                      保存至笔记
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span>或</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                      className="general-reading-button"
                      onClick={() => fetchAndSave(true)}
                    >
                      解读并保存
                    </button>
                  </p>
                </div>
                <br />
                <div style={{ textAlign: "center" }}>
                  {loading && (
                    <p>
                      正在努力加载，<b>请勿刷新页面</b>。谢谢你的耐心等待！
                    </p>
                  )}
                  {noteError}
                  {result?.message && (
                    <>
                      <p>
                        成功保存至<Link to="/notebook">我的笔记</Link>。
                      </p>
                    </>
                  )}
                </div>
              </div>

              {result?.reading && displayResult(result)}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

function displayResult(result) {
  return (
    <>
      <div className="note-comment">
        <h2>解读（仅供参考）</h2>
        <p>
          {result?.reading}（解读已自动保存至
          <Link to="/notebook">我的笔记</Link>）
        </p>
      </div>
    </>
  );
}

export default AstroDice;
