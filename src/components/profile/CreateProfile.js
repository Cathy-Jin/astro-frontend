import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";

const CreateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    city: "",
    state: "",
    country: "中国",
    user_id: localStorage.getItem("user_id"),
  });
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setIsDisabled(true);
    //await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay
    try {
      const response = await fetch(
        "https://astro-notebook.onrender.com/profile",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (response.status === 201) {
        navigate("/profile");
      } else if (response.status === 400) {
        const result = await response.json();
        if (result.error.includes("Invalid input")) {
          setError(<div className="error">请确保所有时间都已正确填写。</div>);
        } else if (result.error.includes("Unable to find the coordinates")) {
          setError(
            <div className="error">
              无法找到地点，请确保地点信息都已正确填写。
            </div>
          );
        } else if (result.error.includes("Unable to find the timezone")) {
          setError(
            <div className="error">无法找到出生地时区，请刷新或重试。</div>
          );
        } else {
          setError(<div className="error">档案创建失败，请刷新或重试。</div>);
        }
      }
    } catch (error) {
      setError(<div className="error">档案创建失败，请刷新或重试。</div>);
    }
    setIsDisabled(false);
  };

  // Generate lists for each dropdown
  const currentYear = new Date().getFullYear(); // Get the current year dynamically
  const years = Array.from(
    { length: currentYear - 1920 + 1 },
    (_, i) => currentYear - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // TODO：improve UI
  return (
    <div className="create-profile">
      <NavBar />
      <div className="main-content">
        <h1>创建档案</h1>
        {error}
        <div className="info_collector">
          <form onSubmit={handleSubmit} disabled={isDisabled}>
            <div className="profile-name-row">
              <p>
                <b>档案名称</b>
                <br />
                <input
                  type="text"
                  name="name"
                  size="10"
                  placeholder="未命名档案"
                  value={formData.name}
                  onChange={handleChange}
                />
              </p>
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
            <button type="submit" disabled={isDisabled}>
              {isDisabled ? "正在创建……" : "创建档案"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateProfile;
