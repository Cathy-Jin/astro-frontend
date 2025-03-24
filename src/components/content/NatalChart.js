import { useState, useEffect } from "react";
import {
  useLocation,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { toTwoDigits, convertToCardinal } from "../Util";
import LifeThemeReading from "./LifeTheme";

const NatalChart = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rateLimiting, setRateLimiting] = useState(false); // TODO: add rate limiting

  const [searchParams] = useSearchParams();
  const profile_id = searchParams.get("id") || "";
  const location = useLocation();
  const profile = location.state?.profile; // Get from router state

  const navigate = useNavigate();
  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchNatalChart = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://astro-notebook.onrender.com/natal-chart",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: localStorage.getItem("user_id"),
              name: profile.name,
              year: profile.year,
              month: profile.month,
              day: profile.day,
              hour: profile.hour,
              minute: profile.minute,
              lng: profile.lng,
              lat: profile.lat,
              tz: profile.tz,
            }),
            credentials: "include",
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setResult(data);
        } else if (response.status === 403 || response.status === 401 || response.status === 422) {
          localStorage.clear();
          setError(
            <div className="error">
              请重新<Link to="/signin">登录</Link>或
              <Link to="/signup">注册</Link>。
            </div>
          );
        } else {
          setError(
            <div className="error">
              哎呀，星盘生成出现了一些问题。请稍后再试。
            </div>
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(
          <div className="error">
            哎呀，星盘生成出现了一些问题。请稍后再试。
          </div>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNatalChart();
  }, [profile]);

  if (!profile || profile.id !== profile_id) {
    return (
      <div className="natal-chart">
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
    <div className="natal-chart">
      <NavBar />
      <div className="main-content">
        <div className="user-profile-expansion-item">
          <h2>{profile.name}</h2>
          <div>
            {result && (
              <>
                <span className="user-profile-tag-zodiac">
                  上升{result?.planet_info.asc.zodiac.slice(0, 2)}
                </span>
                <span className="user-profile-tag-zodiac">
                  太阳{result?.planet_info.sun.zodiac.slice(0, 2)}
                </span>
                <span className="user-profile-tag-zodiac">
                  月亮{result?.planet_info.moon.zodiac.slice(0, 2)}
                </span>
                {renderPlanetTags(result?.planet_focalizer_modern)}
              </>
            )}
          </div>
          <div>
            <p>
              {profile.year}-{toTwoDigits(profile.month)}-
              {toTwoDigits(profile.day)} {toTwoDigits(profile.hour)}:
              {toTwoDigits(profile.minute)}
            </p>
            <p>{profile.location}</p>
            <p>{convertToCardinal(profile.lat, profile.lng)}</p>
            <p>Placidus宫位制</p>
          </div>

          {/* <div className="user-profile-expansion-details-container">
            <button
              className="profile-button"
              onClick={() =>
                navigate("/life-theme?id=" + profile.id, {
                  state: { profile },
                })
              }
            >
              人生主题解读
            </button>
          </div> */}
        </div>
        {loading && (
          <div>
            <p>正在努力获取星盘，请稍后。。。</p>
          </div>
        )}
        {error}
        <div className="result">
          {result && (
            <>
              <Tabs>
                <TabList className="natal-chart-tablist">
                  <Tab
                    className="natal-chart-tab"
                    selectedClassName="natal-chart-tab--selected"
                  >
                    星盘信息
                  </Tab>
                  <Tab
                    className="natal-chart-tab"
                    selectedClassName="natal-chart-tab--selected"
                  >
                    重点行星（现代）
                  </Tab>
                  <Tab
                    className="natal-chart-tab"
                    selectedClassName="natal-chart-tab--selected"
                  >
                    人生主题
                  </Tab>
                </TabList>

                <TabPanel>{renderNatalChart(result)}</TabPanel>
                <TabPanel>
                  {renderPlanetFocalizer(
                    result.planet_focalizer_modern,
                    isExpanded,
                    toggleExpand
                  )}
                </TabPanel>
                <TabPanel>
                  <LifeThemeReading />
                </TabPanel>
              </Tabs>
            </>
          )}
        </div>
        <button className="profile-button" onClick={() => navigate("/profile")}>
          返回我的档案
        </button>
      </div>
      <Footer />
    </div>
  );
};

function renderNatalChart(result) {
  return (
    <>
      <div className="natal-chart-item-container">
        <div className="natal-chart-item">
          <SvgRenderer svgString={result.horoscope} width="100%" heigh="100%" />
        </div>
        <br />
        <div className="natal-chart-item">
          <h2>星体参数</h2>
          <table className="natal-chart-table">
            <thead>
              <tr>
                <th>
                  <p>星体</p>
                </th>
                <th>
                  <p>星座度数</p>
                </th>
                <th>
                  <p>宫位</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {renderPlanetInfoRow(result.planet_info?.sun, "sun", "太阳")}
              {renderPlanetInfoRow(result.planet_info?.moon, "moon", "月亮")}
              {renderPlanetInfoRow(
                result.planet_info?.mercury,
                "mercury",
                "水星"
              )}
              {renderPlanetInfoRow(result.planet_info?.venus, "venus", "金星")}
              {renderPlanetInfoRow(result.planet_info?.mars, "mars", "火星")}
              {renderPlanetInfoRow(
                result.planet_info?.jupiter,
                "jupiter",
                "木星"
              )}
              {renderPlanetInfoRow(
                result.planet_info?.saturn,
                "saturn",
                "土星"
              )}
              {renderPlanetInfoRow(
                result.planet_info?.uranus,
                "uranus",
                "天王星"
              )}
              {renderPlanetInfoRow(
                result.planet_info?.neptune,
                "neptune",
                "海王星"
              )}
              {renderPlanetInfoRow(
                result.planet_info?.pluto,
                "pluto",
                "冥王星"
              )}
              {renderPlanetInfoRow(
                result.planet_info?.true_node,
                "true_node",
                "北交点"
              )}
              {renderPlanetInfoRow(result.planet_info?.asc, "asc", "上升点")}
              {renderPlanetInfoRow(result.planet_info?.mc, "mc", "天顶")}
            </tbody>
          </table>
        </div>
        <div className="natal-chart-item">
          <h2>宫位参数</h2>
          <table className="natal-chart-table">
            <thead>
              <tr>
                <th>
                  <p>宫位</p>
                </th>
                <th>
                  <p>星座度数</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {result.house_info?.map((house) => (
                <tr>
                  <td>
                    <p>{house?.num}</p>
                  </td>
                  <td>
                    <p>
                      {house?.zodiac} {house?.degree}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="natal-chart-item">
          <h2>相位表</h2>
          <SvgRenderer svgString={result.aspect} width="100%" height="100%" />
        </div>
      </div>
    </>
  );
}

function renderPlanetFocalizer(focalizers, isExpanded, toggleExpand) {
  const domScore = focalizers[0].score;
  const domPlanets = focalizers.filter((item) => item.score === domScore);
  if (focalizers.length === 0) {
    return (
      <>
        <div className="planet-focalizer-item">
          <p>似乎没有找到结果，请刷新或重试。</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="planet-focalizer-item">
          <h2>重点行星：{concatenatePlanetNames(domPlanets)}</h2>
          <p>
            <b>解读仅供参考，需要结合星盘全局分析</b>
          </p>
          {domPlanets.length === 1 ? (
            <>
              <p>{domPlanets[0].interpretation_cn}</p>
            </>
          ) : (
            <ul>
              {domPlanets.map((planet) => (
                <li key={planet.name_cn}>
                  <p>{planet.interpretation_cn}</p>
                </li>
              ))}
            </ul>
          )}
          <br />
          <h3>计算详情</h3>
          <p
            onClick={toggleExpand}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            点击查看计算公式
          </p>
          {isExpanded && (
            <>
              <div>
                <p>
                  <b>星体势力</b>
                  <ul>
                    <li>入庙（Domicile） +4</li>
                    <li>擢升（Exaltation） +3</li>
                    <li>失势（Detriment） +2</li>
                    <li>落陷（Fall） +1</li>
                  </ul>
                </p>
                <p>
                  <b>星体落宫</b>
                  <ul>
                    <li>落于1宫或10宫 +1</li>
                    <li>落于守护的宫位 +1</li>
                  </ul>
                </p>
                <p>
                  <b>星体合轴</b>
                  <ul>
                    <li>落在上升/下降点 +5</li>
                    <li>落在天顶/天底 +3</li>
                  </ul>
                </p>
                <p>
                  <b>守护星</b>
                  <ul>
                    <li>命主星 +3</li>
                    <li>其他行星落座的守护星（除入庙外） +1</li>
                    <li>天顶落座的守护星 +1</li>
                  </ul>
                </p>
                <p>
                  <b>相位</b>
                  <ul>
                    <li>和其他行星形成合相（0°） +3</li>
                    <li>和其他行星形成四分相（90°）或对分相（180°） +2</li>
                    <li>和其他行星形成六分相（60°）或三分相（120°） +1</li>
                  </ul>
                </p>
              </div>
            </>
          )}
          <table className="natal-chart-table">
            <thead>
              <tr>
                <th>
                  <p>行星</p>
                </th>
                <th>
                  <p>得分</p>
                </th>
                <th>
                  <p>详情</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "太阳",
                "sun"
              )}
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "月亮",
                "moon"
              )}
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "水星",
                "mercury"
              )}
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "金星",
                "venus"
              )}
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "火星",
                "mars"
              )}
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "木星",
                "jupiter"
              )}
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "土星",
                "saturn"
              )}
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "天王星",
                "uranus"
              )}
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "海王星",
                "neptune"
              )}
              {renderPlanetFocalizerTableRow(
                focalizers,
                domScore,
                "冥王星",
                "pluto"
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

function renderPlanetInfoRow(planet_info_item, name, name_cn) {
  return (
    <tr>
      <td width="25%">
        <p>
          <img
            src={`symbol/planet/${name}.svg`}
            alt={name}
            height="16px"
            width="16px"
          />
          {name_cn}
        </p>
      </td>
      <td>
        <p>
          {planet_info_item?.zodiac} {planet_info_item?.degree}{" "}
          {planet_info_item?.rx ? <>Rx</> : <>&nbsp;&nbsp;&nbsp;&nbsp;</>}
        </p>
      </td>
      <td>
        <p>{planet_info_item?.house}</p>
      </td>
    </tr>
  );
}

const SvgRenderer = ({ svgString, width, height }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgString }}
      style={{ width: width, height: height }}
    />
  );
};

function concatenatePlanetNames(domPlanets) {
  if (domPlanets.length === 1) {
    return domPlanets[0].name_cn;
  } else {
    return domPlanets.map((item) => item.name_cn).join("、 ");
  }
}

function renderPlanetFocalizerTableRow(focalizers, domScore, name_cn, name) {
  const focalizer = focalizers.filter((item) => item.name_cn === name_cn)[0];
  return (
    <tr>
      <td width="25%">
        <p> 
          <img
            src={`symbol/planet/${name}.svg`}
            alt={name}
            height="16px"
            width="16px"
          />
          {focalizer.score === domScore ? <b>{name_cn}</b> : name_cn}
        </p>
      </td>
      <td>
        <p>
          {focalizer.score === domScore ? (
            <b>{focalizer.score}</b>
          ) : (
            focalizer.score
          )}
        </p>
      </td>
      <td>
        <p>
          {focalizer.patterns_cn?.map((pattern, index) => (
            <>
              {pattern}
              <br />
            </>
          ))}
        </p>
      </td>
    </tr>
  );
}

function renderPlanetTags(focalizers) {
  const domScore = focalizers[0].score;
  const domPlanets = focalizers.filter((item) => item.score === domScore);

  return (
    <>
      {domPlanets.map((item) => (
        <>
          <span className="user-profile-tag-planet">{item.name_cn}</span>
        </>
      ))}
    </>
  );
}

export default NatalChart;
