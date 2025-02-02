import React, { useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const Home = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [isDominantPlanetResultOpen, setIsDominantPlanetResultOpen] =
    useState(false);
  const [isLifeThemeResultOpen, setIsLifeThemeResultOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    city: "",
    state: "",
    country: "中国",
    // excluding DST at the moment isDst: false
  });

  const [result, setResult] = useState(null);

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDominantPlanetResultCollapse = () => {
    setIsDominantPlanetResultOpen(!isDominantPlanetResultOpen);
  };

  const toggleLifeThemeResultCollapse = () => {
    setIsLifeThemeResultOpen(!isLifeThemeResultOpen);
  };

  // Handler for checkbox change (DST)
  // const handleDSTChange = (e) => {
  //   setFormData({ ...formData, isDst: e.target.checked });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDominantPlanetResultOpen(false);
    setIsLifeThemeResultOpen(false);
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        "https://astro-notebook.onrender.com/report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading when request completes
    }
  };

  // Generate lists for each dropdown
  const years = Array.from(
    { length: currentYear - 1920 + 1 },
    (_, i) => currentYear - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="home">
      <NavBar />
      <div className="main-content">
        <h1>人生主题计算器</h1>
        <div className="background">
          <h4 onClick={toggleExpand} style={{ cursor: "pointer" }}>
            常见问题及解答
          </h4>
          {isExpanded && (
            <p>
              <b>什么是人生主题？</b>
              <br />
              相信许多占星爱好者都知道，星盘由三个基本元素组成：星座、宫位和行星。这三者的独特排列形成了占星学中的一种整体性，而每个元素都可以看作是占星符号的十二个规则的表现形式。这十二个规则之间的互动可以通过行星的位置、它们所在的宫位以及行星之间的相位（即相互关系）来体现。
              <br />
              举个例子，下述皆说明了7与10的交替作用：土星落在天秤座；土星落在七宫；金星落在魔羯座；金星落在十宫；金星与土星的所有相位；七宫所在行星与十宫所在行星的所有相位；以及天秤座所在行星与魔羯座所在行星的所有相位。
              <br />
              史蒂芬·阿若优（Stephen
              Arroyo）在他的《生命的轨迹》中说道：“一个人的本命盘若是有某种类型的交替法则以三种或多种情况呈现出来，那么这股动力就会构成所谓的生命重要主题。”
              <br />
              <br />
              <b>如何使用这个网站？</b>
              <br />
              如果你是一名现代占星爱好者，这个网站可以快速总结出占星规则之间的互动及其出现频率（由高到低），帮助你更轻松地解读星盘。
              如果你对自我认知感兴趣，这个网站可以提供一个新的视角，帮助你更深入地理解自身的能量和潜能。
              <br />
              <br />
              <b>是否支持夏令时？</b>
              <br />
              支持，且支持自动换算。
              <br />
              <br />
              <b>出生地如果在中国以外怎么办？</b>
              <br />
              网站支持外国出生地查询，且支持英文。只需将国家/地区一栏的中国改成出生地的国家/地区即可。
              <br />
              <br />
              <b>计算结果出现了好多主题，应该怎么看呢？</b>
              <br />
              计算结果是按照主题在星盘上出现的频率由高到低排的。理论上，出现频率越高的主题越重要。
              <br />
              <br />
              <b>关键词和解读似乎过于抽象了？</b>
              <br />
              网站主要用途为计算人生主题，关键词和解读仅供参考。个性化解读目前只对注册用户开放。对解读内容有具体改进建议的话，欢迎随时联系我。
              <br />
              <br />
              <b>数字能量是否等于宫位？</b>
              <br />
              宫位为数字能量的展现形式之一，但并不是等价的关系。举个例子，第十宫、魔羯座、和土星都展现了10的能量，但10的能量不仅仅只是第十宫。
            </p>
          )}
        </div>
        <br />
        <div className="info_collector">
          <form onSubmit={handleSubmit}>
            <div className="info_collector_header">
              <h3>
                <b>输入你的基本信息</b>
              </h3>
            </div>
            <div className="birth-time-row">
              <p>
                <b>出生日期</b>
                <br />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                年
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                月
                <select name="day" value={formData.day} onChange={handleChange}>
                  <option value=""></option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                日
                <br />
                <select
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
                时
                <select
                  name="minute"
                  value={formData.minute}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  {minutes.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>
                分
                {/* <br />  
              <input type="checkbox" checked={formData.isDst} onChange={handleDSTChange} />是否是夏令时 */}
              </p>
            </div>
            <div className="birth-location-row">
              <p>
                <b>出生地点</b>
                <br />
                国家/地区：
                <input
                  type="text"
                  name="country"
                  size="10"
                  placeholder="中国"
                  value={formData.country}
                  onChange={handleChange}
                />
                <br />
                省份：
                <input
                  type="text"
                  name="state"
                  size="10"
                  placeholder="江苏省"
                  value={formData.state}
                  onChange={handleChange}
                />
                <br />
                城市：
                <input
                  type="text"
                  name="city"
                  size="10"
                  placeholder="苏州市"
                  value={formData.city}
                  onChange={handleChange}
                />
              </p>
            </div>
            <button type="submit">生成结果</button>
          </form>
        </div>
        {loading && (
          <div>
            <p>正在努力计算，请稍后。。。</p>
          </div>
        )}
        {result && (
          <div className="result">
            {renderResult(
              result,
              isDominantPlanetResultOpen,
              toggleDominantPlanetResultCollapse,
              isLifeThemeResultOpen,
              toggleLifeThemeResultCollapse
            )}
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

function renderResult(
  result,
  isDominantPlanetResultOpen,
  toggleDominantPlanetResultCollapse,
  isLifeThemeResultOpen,
  toggleLifeThemeResultCollapse
) {
  // Handle errors first
  if (
    typeof result === "object" &&
    result !== null &&
    result.hasOwnProperty("error")
  ) {
    if (result.error.includes("Invalid input")) {
      return (
        <>
          <div className="error">请确保所有时间都已正确填写。</div>
        </>
      );
    } else if (result.error.includes("Unable to find the coordinates")) {
      return (
        <>
          <div className="error">
            无法找到地点，请确保地点信息都已正确填写。
          </div>
        </>
      );
    } else if (result.error.includes("Unable to find the timezone")) {
      return (
        <>
          <div className="error">无法找到出生地时区，请刷新或重试。</div>
        </>
      );
    } else {
      return (
        <>
          <div className="error">似乎没有找到结果，请刷新或重试。</div>
        </>
      );
    }
  }

  // Handle report results
  if (
    typeof result === "object" &&
    result !== null &&
    result.hasOwnProperty("themes") &&
    result.hasOwnProperty("planet_focalizers")
  ) {
    return (
      <>
        {renderPlanetaryFocalizers(
          result.planet_focalizers,
          isDominantPlanetResultOpen,
          toggleDominantPlanetResultCollapse
        )}
        <br />
        {renderThemes(
          result.themes,
          isLifeThemeResultOpen,
          toggleLifeThemeResultCollapse
        )}
      </>
    );
  } else {
    return (
      <>
        <div className="error">似乎没有找到结果，请刷新或重试。</div>
      </>
    );
  }
}

function renderThemes(
  themes,
  isLifeThemeResultOpen,
  toggleLifeThemeResultOpen
) {
  if (themes.length === 0) {
    return (
      <>
        <div className="report_item">
          <h2>人生主题</h2>
          <p>似乎没有找到结果，请刷新或重试。</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="report_item">
          <h2>
            人生主题{" "}
            <button
              className="collapse-btn"
              onClick={toggleLifeThemeResultOpen}
            >
              {isLifeThemeResultOpen ? "-" : "+"}
            </button>
          </h2>
          <div className="report_item_summary">
            <p>
              <b>
                如果你需要更细致更个性化的解读，请<Link to="/signup">注册</Link>
                并创建你的档案。
              </b>
            </p>
            <p>
              在本命盘上出现三次及以上的占星规则的组合，就是人生主题。人生主题可以帮助认识自我以及指明成长的方向。计算结果按照能量出现的次数
              <b>从高到低</b>
              排列。对本命盘的进一步分析应结合太阳、月亮、上升点等其他因素综合判断。
            </p>
          </div>
          <div>
            {isLifeThemeResultOpen && renderThemesContent(themes)}
          </div>
        </div>
      </>
    );
  }
}

function renderThemesContent(energies) {
  return energies.map((energy, index) => (
    <div key={index}>
      <hr />
      {renderEnergy(energy)}
    </div>
  ));
}

function renderEnergy(e) {
  return (
    <>
      <h3>主题：{e.name_cn}</h3>
      <p>
        <b>关键词（仅供参考，需要结合星盘全局分析）</b>：
        {renderEnergyKeywords(e.principle_kws_cn, e.principle_nums)}
      </p>
      {/* <p>
        <b>解读（仅供参考，需要结合星盘全局分析）</b>：<br />
        {e.interpretation_cn}
      </p> */}
      <p>
        <b>星盘中出现次数</b>：{e.patterns_cn.length}
      </p>
      <p>
        <b>星盘中表现形式</b>：
        <ul>
          {e.patterns_cn.map((pattern) => (
            <li>{pattern}</li>
          ))}
        </ul>
      </p>
    </>
  );
}

function renderEnergyKeywords(kws, p_nums) {
  if (kws.length === 1) {
    return (
      <>
        <br />
        {kws[0]}
      </>
    );
  } else {
    return (
      <>
        <ul>
          <li>
            {p_nums[0]}的能量包含：{kws[0]}
          </li>
          <li>
            {p_nums[1]}的能量包含：{kws[1]}
          </li>
        </ul>
      </>
    );
  }
}

function renderPlanetaryFocalizers(
  focalizers,
  isDominantPlanetResultOpen,
  toggleDominantPlanetResultOpen
) {
  if (focalizers.length === 0) {
    return (
      <>
        <div className="report_item">
          <h2>重点行星</h2>
          <p>似乎没有找到结果，请刷新或重试。</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="report_item">
          <h2>
            重点行星{" "}
            <button
              className="collapse-btn"
              onClick={toggleDominantPlanetResultOpen}
            >
              {isDominantPlanetResultOpen ? "-" : "+"}
            </button>
          </h2>
          <div className="report_item_summary">
            <p>
              重点行星是本命盘中能量强大的行星，对全局有较为突出的影响。对本命盘的进一步分析应结合太阳、月亮、上升点等其他因素综合判断。
            </p>
          </div>
          <div>
            {isDominantPlanetResultOpen &&
              renderFocalizersContent(focalizers)}
          </div>
        </div>
      </>
    );
  }
}

function renderFocalizersContent(focalizers) {
  const domScore = focalizers[0].score;
  const domPlanets = focalizers.filter((item) => item.score === domScore);
  return (
    <>
      <hr />
      <h3>重点行星：{concatenatePlanetNames(domPlanets)}</h3>
      <p>
        <b>解读（仅供参考，需要结合星盘全局分析）</b>：
        {domPlanets.length === 1 ? (
          <>
            <br />
            {domPlanets[0].interpretation_cn}
          </>
        ) : (
          <ul>
            {domPlanets.map((planet) => (
              <li key={planet.id}>{planet.interpretation_cn}</li>
            ))}
          </ul>
        )}
      </p>
      <hr />
      <h3>得分详情</h3>
      <p>
        <table className="planet_focialier_result_table">
          <thead>
            <tr>
              <th>行星</th>
              <th>得分</th>
              <th>星盘中表现形式</th>
            </tr>
          </thead>
          <tbody>
            {renderPlanetFocalizerTableRow(focalizers, domScore, "太阳")}
            {renderPlanetFocalizerTableRow(focalizers, domScore, "月亮")}
            {renderPlanetFocalizerTableRow(focalizers, domScore, "水星")}
            {renderPlanetFocalizerTableRow(focalizers, domScore, "金星")}
            {renderPlanetFocalizerTableRow(focalizers, domScore, "火星")}
            {renderPlanetFocalizerTableRow(focalizers, domScore, "木星")}
            {renderPlanetFocalizerTableRow(focalizers, domScore, "土星")}
            {renderPlanetFocalizerTableRow(focalizers, domScore, "天王星")}
            {renderPlanetFocalizerTableRow(focalizers, domScore, "海王星")}
            {renderPlanetFocalizerTableRow(focalizers, domScore, "冥王星")}
          </tbody>
        </table>
      </p>
    </>
  );
}

function concatenatePlanetNames(domPlanets) {
  if (domPlanets.length === 1) {
    return domPlanets[0].name_cn;
  } else {
    return domPlanets.map((item) => item.name_cn).join("、 ");
  }
}

function renderPlanetFocalizerTableRow(focalizers, domScore, name_cn) {
  const focalizer = focalizers.filter((item) => item.name_cn === name_cn)[0];
  return (
    <tr>
      <td>{name_cn}</td>
      <td>
        {focalizer.score === domScore ? (
          <b>{focalizer.score}</b>
        ) : (
          focalizer.score
        )}
      </td>
      <td className="focalizer_pattern_row">
        {focalizer.patterns_cn.join("；")}
      </td>
    </tr>
  );
}

export default Home;
