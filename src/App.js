import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    city: '',
    state: '',
    country: '中国'
    // excluding DST at the moment isDst: false 
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for checkbox change (DST)
  // const handleDSTChange = (e) => {
  //   setFormData({ ...formData, isDst: e.target.checked });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://astro-notebook.onrender.com/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  // Generate lists for each dropdown
  const years = Array.from({ length: 2024 - 1920 + 1 }, (_, i) => 2024 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="App">
      <h1>人生主题计算器</h1>
      <div class="info_collector">
        <form onSubmit={handleSubmit}>
          <p>
            <h3><b>输入你的基本信息</b></h3>
            <div className="birth-time-row">
              <b>出生日期</b>
              <br />
              <select name="year" value={formData.year} onChange={handleChange}>
                <option value=""></option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              年
              <select name="month" value={formData.month} onChange={handleChange}>
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
              <select name="hour" value={formData.hour} onChange={handleChange}>
                <option value=""></option>
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
              ))}
              </select>
              时 
              <select name="minute" value={formData.minute} onChange={handleChange}>
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
            </div>
            <br />
            <div className="birth-location-row">
              <b>出生地点</b>
              <br />国家/地区：
              <input type="text" name="country" size="10" placeholder="中国" value={formData.country} onChange={handleChange} />
              <br />省份：
              <input type="text" name="state" size="10" placeholder="河南省" value={formData.state} onChange={handleChange} />
              <br />城市：
              <input type="text" name="city" size="10" placeholder="洛阳市" value={formData.city} onChange={handleChange} />
            </div>
          </p>
          <button type="submit">生成结果</button>
          </form>
      </div>
      
      {result && (<div className="result">{renderResult(result)}</div>)}
      <footer className="footer">
        <hr /><a href="mailto:cathyking716@gmail.com">Contact Me</a>
      </footer>
    </div>
  );
  
}

function renderResult(result) {
  // TODO: handle errors first
  if (typeof result === 'object' && result !== null && result.hasOwnProperty('error')) {
    if (result.error.includes("Invalid input: ")) {
      return (
        <>
          <div className="error">请确保所有时间都已正确填写。</div>
        </>
      )
    } else if (result.error.includes("Unable to find the coordinates.")) {
      return (
        <>
          <div className="error">无法找到地点，请确保地点信息都已正确填写。</div>
        </>
      )
    } else if (result.error.includes("Unable to find the timezone")) {
      return (
        <>
          <div className="error">无法找到出生地时区，请重试。</div>
        </>
      )
    } else {
      return (
        <>
          <div className="error">似乎没有找到结果，请重试。</div>
        </>
      )
    }
  } else if (Array.isArray(result)) {
    if (result.length === 0) {
      return (
        <> 
          <h2>计算结果</h2> 
          <p>似乎没有找到结果，请重试。</p>
        </>
      )
    } else {
      return (
        <> 
          <h2>计算结果</h2> 
          {renderEnergies(result)}
        </>
      )
    }
  } else {
    return (
      <>
        <div className="error">似乎没有找到结果，请重试。</div>
      </>
    )
  }
}

function renderEnergies(energies) {
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
          <p><b>关键词（仅供参考）</b>：{renderKeywords(e.principle_kws_cn, e.principle_nums)}</p>
          <p><b>星盘中出现次数</b>：{e.patterns_cn.length}</p>
          <p><b>星盘中表现形式</b>：
              <ul>
                  {e.patterns_cn.map(pattern => (
                      <li>{pattern}</li>
                  ))}
              </ul>
          </p>
      </>
  );
}

function renderKeywords(kws, p_nums) {
  if (kws.length === 1) {
    return (
      <>
        {kws[0]}
      </>
    )
  } else {
    return (
      <>
        <ul>
          <li>{p_nums[0]}的能量包含：{kws[0]}</li>
          <li>{p_nums[1]}的能量包含：{kws[1]}</li>
        </ul>
      </>
    )
  }
}


export default App;