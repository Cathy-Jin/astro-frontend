import { useState, useEffect } from "react";
import {
  useLocation,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";

const NatalChat = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimiting, setRateLimiting] = useState(false); // TODO: add rate limiting

  const [searchParams] = useSearchParams();
  const profile_id = searchParams.get("id") || "";
  const location = useLocation();
  const profile = location.state?.profile; // Get from router state

  const navigate = useNavigate();

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
        } else if (response.status === 403 || response.status === 401) {
          localStorage.clear();
          setError(
            <div className="error">
              未登录，请重新<Link to="/signin">登录</Link>或
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
    <div className="natal-chart">
      <NavBar />
      <div className="main-content">
        <h1>档案详情</h1>
        <div className="user-profile-item">
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
          <p>
            <b>经纬度：</b>
            {convertToCardinal(profile.lat, profile.lng)}
          </p>
          <p>
            <b>宫位制：</b>普拉西度 Placidus
          </p>
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
              <div className="natal-chart-item">
                <SvgRenderer
                  svgString={result.horoscope}
                  width="100%"
                  heigh="100%"
                />
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
                    {renderPlanetInfoRow(
                      result.planet_info?.sun,
                      "sun",
                      "太阳"
                    )}
                    {renderPlanetInfoRow(
                      result.planet_info?.moon,
                      "moon",
                      "月亮"
                    )}
                    {renderPlanetInfoRow(
                      result.planet_info?.mercury,
                      "mercury",
                      "水星"
                    )}
                    {renderPlanetInfoRow(
                      result.planet_info?.venus,
                      "venus",
                      "金星"
                    )}
                    {renderPlanetInfoRow(
                      result.planet_info?.mars,
                      "mars",
                      "火星"
                    )}
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
                    {renderPlanetInfoRow(
                      result.planet_info?.asc,
                      "asc",
                      "上升点"
                    )}
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
                <SvgRenderer
                  svgString={result.aspect}
                  width="100%"
                  height="100%"
                />
              </div>
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

function renderPlanetInfoRow(planet_info_item, name, name_cn) {
  return (
    <tr>
      <td>
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
      style={{ width: width, height: height, textAlign: "center" }}
    />
  );
};

const convertToCardinal = (latitude, longitude) => {
  // Determine latitude direction
  const latDirection = latitude >= 0 ? "N" : "S";
  const absLat = Math.abs(latitude);

  // Determine longitude direction
  const lonDirection = longitude >= 0 ? "E" : "W";
  const absLon = Math.abs(longitude);

  // Convert to degrees, minutes, and seconds
  const decimalToDMS = (decimalValue) => {
    const degrees = Math.floor(decimalValue);
    const minutesFull = (decimalValue - degrees) * 60;
    const minutes = Math.floor(minutesFull);
    const seconds = Math.round((minutesFull - minutes) * 60);
    return { degrees, minutes, seconds };
  };

  const latDMS = decimalToDMS(absLat);
  const lonDMS = decimalToDMS(absLon);

  // Format the result
  const latitudeStr = `${latDMS.degrees}°${latDMS.minutes}'${latDMS.seconds}"${latDirection}`;
  const longitudeStr = `${lonDMS.degrees}°${lonDMS.minutes}'${lonDMS.seconds}"${lonDirection}`;

  return `${latitudeStr} ${longitudeStr}`;
};

export default NatalChat;
