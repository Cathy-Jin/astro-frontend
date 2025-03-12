import React, { useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField, TimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import CircleGraph from "./content/LifeThemeDiagram";

const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [isDominantPlanetResultOpen, setIsDominantPlanetResultOpen] =
    useState(false);
  const [isLifeThemeResultOpen, setIsLifeThemeResultOpen] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());

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

  const handleDateChange = (date) => {
    if (date) {
      setDate(date);
      setFormData((prevData) => ({
        ...prevData,
        year: date.year(),
        month: date.month() + 1, // Month is 0-indexed in dayjs
        day: date.date(),
      }));
    }
  };

  const handleTimeChange = (time) => {
    if (time) {
      setTime(time);
      setFormData((prevData) => ({
        ...prevData,
        hour: time.hour(),
        minute: time.minute(),
      }));
    }
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
    if (isDisabled) return;
    setIsDominantPlanetResultOpen(false);
    setIsLifeThemeResultOpen(false);
    setLoading(true); // Start loading

    setIsDisabled(true);
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
    setIsDisabled(false);
  };

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
              <b>如何使用这个网站？</b>
              <br />
              如果你是一名现代占星爱好者，这个网站可以快速排盘，并总结出重点行星与互动能量，帮助你更轻松地解读星盘。
              如果你对自我认知感兴趣，这个网站可以提供一个新的视角，帮助你更深入地理解自身的能量和潜能。
              <br />
              <br />
              <b>是否支持夏令时？</b>
              <br />
              支持，且会自动换算，无需特别标注。
              <br />
              <br />
              <b>出生地如果在中国以外怎么办？</b>
              <br />
              网站支持外国出生地查询，且支持英文。只需将国家/地区一栏的中国改成出生地的国家/地区即可。
              <br />
              <br />
              <b>计算结果出现了好多人生主题，应该怎么看呢？</b>
              <br />
              计算结果是按照主题在星盘上出现的频率由高到低排的。理论上，出现频率越高的主题越重要。
              <br />
              <br />
              <b>关键词和解读似乎过于抽象了？</b>
              <br />
              网站主要用途为计算人生主题，关键词和解读仅供参考。个性化解读目前只对注册用户开放。对解读内容有具体改进建议的话，欢迎随时联系我。
              <br />
              <br />
              <b>占星规则是否等于宫位？</b>
              <br />
              宫位为占星规则的展现形式之一，但并不是等价的关系。举个例子，第十宫、摩羯座、和土星都展现了占星规则10的能量，但10的能量不仅仅只是第十宫。
            </p>
          )}
        </div>
        <div className="info_collector">
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-row">
              <h3>
                <b>出生时间</b>
              </h3>
              <p>
                日期（必填）:
                <br />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateField
                    defaultValue={dayjs("1970-03-31")}
                    format="YYYY-MM-DD"
                    value={date}
                    onChange={handleDateChange}
                    sx={{
                      width: "120px",
                      margin: "4px 0",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        border: "0.5px solid #999",
                        boxShadow: "none",
                        outline: "none",
                        backgroundColor: "#fff",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        fontFamily: "Microsoft YaHei, sans-serif",
                        textAlign: "center",
                        padding: "2px 8px",
                      },
                    }}
                  />
                </LocalizationProvider>
                <br />
                时间（必填）:
                <br />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeField
                    defaultValue={dayjs("1970-03-31T23:59")}
                    format="HH:mm"
                    value={time}
                    onChange={handleTimeChange}
                    sx={{
                      width: "80px",
                      margin: "4px 0",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        border: "0.5px solid #999",
                        boxShadow: "none",
                        outline: "none",
                        backgroundColor: "#fff",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        fontFamily: "Microsoft YaHei, sans-serif",
                        textAlign: "center",
                        padding: "2px 8px",
                      },
                    }}
                  />
                </LocalizationProvider>
              </p>
              {/* <br />  
                          <input type="checkbox" checked={formData.isDst} onChange={handleDSTChange} />是否是夏令时 */}
            </div>
            <div className="profile-row">
              <h3>
                <b>出生地点</b>
              </h3>
              <p>
                国家/地区：
                <input
                  className="profile-input"
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
                  className="profile-input"
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
                  className="profile-input"
                  type="text"
                  name="city"
                  size="10"
                  placeholder="苏州市"
                  value={formData.city}
                  onChange={handleChange}
                />
              </p>
            </div>
            <button type="submit" disabled={isDisabled}>
              生成结果
            </button>
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
      </div>
      <Footer />
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
          <CircleGraph relationships={getRelationships(themes)} />
          <div className="report_item_summary">
            <p>
              人生主题指在本命盘上出现三次及以上的占星规则交互。点击+展开后，计算结果按照能量出现的次数从高到低排列。对本命盘的进一步分析应结合太阳、月亮、上升点等其他因素综合判断。
            </p>
            <p>
              <b>
                如果你需要更细致更个性化的解读，请<Link to="/signin">登录</Link>
                或<Link to="/signup">注册</Link>
                并创建你的档案。
              </b>
            </p>
          </div>
          <div>{isLifeThemeResultOpen && renderThemesContent(themes)}</div>
        </div>
      </>
    );
  }
}

function getRelationships(themes) {
  const relationships = [];
  themes?.map((item) => {
    const matches = item.name_cn.match(/\d+/g);
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
    const domScore = focalizers[0].score;
    const domPlanets = focalizers.filter((item) => item.score === domScore);
    return (
      <>
        <div className="report_item">
          <h2>
            重点行星：{concatenatePlanetNames(domPlanets)}{" "}
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
              <br />
              <b>
                更多详情，请<Link to="/signin">登录</Link>或
                <Link to="/signup">注册</Link>
                并创建你的档案。
              </b>
            </p>
          </div>
          <div>
            {isDominantPlanetResultOpen && renderFocalizersContent(focalizers)}
          </div>
        </div>
      </>
    );
  }
}

function renderFocalizersContent(focalizers) {
  const domScore = focalizers[0].score;
  return (
    <>
      <hr />
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
    return domPlanets.map((item) => item.name_cn).join("、");
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
