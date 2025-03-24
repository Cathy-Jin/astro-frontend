import seedrandom from "seedrandom";
import dayjs from 'dayjs';


const PLANETS_CN_TO_EN = {
  太阳: "sun",
  月亮: "moon",
  水星: "mercury",
  金星: "venus",
  火星: "mars",
  木星: "jupiter",
  土星: "saturn",
  天王星: "uranus",
  海王星: "neptune",
  冥王星: "pluto",
  北交点: "true_node",
};

const ZODIAC_CN_TO_EN = {
  白羊: "aries",
  金牛: "taurus",
  双子: "gemini",
  巨蟹: "cancer",
  狮子: "leo",
  处女: "virgo",
  天秤: "libra",
  天蝎: "scorpio",
  射手: "sagittarius",
  摩羯: "capricorn",
  水瓶: "aquarius",
  双鱼: "pisces"
}

export function toTwoDigits(num) {
    return num.toString().padStart(2, "0");
}

export function formatLocalTimeWithDayjs(timestamp) {
  // Parse the GMT timestamp and convert to local time by default
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm');
}

export function convertToCardinal(latitude, longitude) {
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
    const latitudeStr = `${toTwoDigits(latDMS.degrees)}°${toTwoDigits(latDMS.minutes)}'${toTwoDigits(latDMS.seconds)}"${latDirection}`;
    const longitudeStr = `${toTwoDigits(lonDMS.degrees)}°${toTwoDigits(lonDMS.minutes)}'${toTwoDigits(lonDMS.seconds)}"${lonDirection}`;
  
    return `${latitudeStr} ${longitudeStr}`;
  };


  export function getSeededRNG(range, input, userId, timestamp = Date.now()) {
    const seed = `${input}-${timestamp}-${userId}`;
    const prng = seedrandom(seed, { entropy: true });
    return Math.floor(prng() * range);
  }


  export function displayAstroDiceRolls(rolls) {
    const PLANETS = [
        "太阳",
        "月亮",
        "水星",
        "金星",
        "火星",
        "木星",
        "土星",
        "天王星",
        "海王星",
        "冥王星",
        "南交点",
        "北交点",
      ];
      const ZODIACS = [
        "白羊",
        "金牛",
        "双子",
        "巨蟹",
        "狮子",
        "处女",
        "天秤",
        "天蝎",
        "射手",
        "摩羯",
        "水瓶",
        "双鱼",
      ];
      const HOUSES = [
        "1宫",
        "2宫",
        "3宫",
        "4宫",
        "5宫",
        "6宫",
        "7宫",
        "8宫",
        "9宫",
        "10宫",
        "11宫",
        "12宫",
      ];
    return (
      <>
        <table className="astro-dice-table">
          <thead>
            <tr>
              <th>
                <p>星体</p>
              </th>
              <th>
                <p>星座</p>
              </th>
              <th>
                <p>宫位</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {rolls.map((roll) => {
              const arr = roll.split("x");
              return (
                <tr>
                  <td>
                    <p>{getPlanetSymbol(PLANETS[arr[0]])}{PLANETS[arr[0]]}</p>
                  </td>
                  <td>
                    <p>{getZodiacSymbol(ZODIACS[arr[1]])}{ZODIACS[arr[1]]}</p>
                  </td>
                  <td>
                    <p>{HOUSES[arr[2]]}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
}

export function displayAstroDiceRollsCN(rolls) {
  return (
    <>
      <table className="astro-dice-table">
        <thead>
          <tr>
            <th>
              <p>星体</p>
            </th>
            <th>
              <p>星座</p>
            </th>
            <th>
              <p>宫位</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {rolls.map((roll) => {
            const arr = roll.split(", ");
            return (
              <tr>
                <td>
                  <p>{getPlanetSymbol(arr[0])}{arr[0]}</p>
                </td>
                <td>
                  <p>{getZodiacSymbol(arr[1])}{arr[1]}</p>
                </td>
                <td>
                  <p>{arr[2]}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}


export function getPlanetSymbol(name_cn) {
  if (name_cn === "南交点") {
    return (<><img
      src={`symbol/planet/true_node.svg`}
      alt="south_node"
      height="16px"
      width="16px"
      style={{transform: "rotate(180deg)"}}
    /></>)
  } else {
    return (<><img
      src={`symbol/planet/${PLANETS_CN_TO_EN[name_cn]}.svg`}
      alt={PLANETS_CN_TO_EN[name_cn]}
      height="16px"
      width="16px"
    /></>)
  }
}

export function getZodiacSymbol(name_cn) {
  return (<><img
    src={`symbol/zodiac/${ZODIAC_CN_TO_EN[name_cn]}.svg`}
    alt={ZODIAC_CN_TO_EN[name_cn]}
    height="16px"
    width="16px"
  /></>)
}