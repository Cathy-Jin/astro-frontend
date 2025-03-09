import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField, TimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";

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
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="create-profile">
      <NavBar />
      <div className="main-content">
        
        <div className="info_collector">
          <form
            className="profile-form"
            onSubmit={handleSubmit}
            disabled={isDisabled}
          >
            <div className="profile-row">
              <h2>新档案</h2>
              <p>名称 <br />
              <input
                className="profile-input"
                type="text"
                name="name"
                placeholder="未命名档案"
                value={formData.name}
                onChange={handleChange}
              /></p>
            </div>
            <div className="profile-row">
              <h3>出生时间</h3>
              <p>
                日期:
                <br />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateField
                    defaultValue={dayjs("1970-03-31")}
                    format="YYYY-MM-DD"
                    value={date}
                    onChange={handleDateChange}
                    sx={{
                      width: "105px",
                      margin: "4px 0",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        border: "0.5px solid #999",
                        boxShadow: "none",
                        outline: "none",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        fontFamily: "Microsoft YaHei, sans-serif",
                        textAlign: "center",
                        padding: "2px 4px",
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
                      width: "60px",
                      margin: "4px 0",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        border: "0.5px solid #999",
                        boxShadow: "none",
                        outline: "none",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        fontFamily: "Microsoft YaHei, sans-serif",
                        textAlign: "center",
                        padding: "2px 4px",
                      },
                    }}
                  />
                </LocalizationProvider>
              </p>
              {/* <br />  
              <input type="checkbox" checked={formData.isDst} onChange={handleDSTChange} />是否是夏令时 */}
            </div>
            <div className="profile-row">
              <h3>出生地点</h3>
              <p>
                国家/地区：
                <input className="profile-input"
                  type="text"
                  name="country"
                  size="10"
                  placeholder="中国"
                  value={formData.country}
                  onChange={handleChange}
                />
                <br />
                省份：
                <input className="profile-input"
                  type="text"
                  name="state"
                  size="10"
                  placeholder="江苏省"
                  value={formData.state}
                  onChange={handleChange}
                />
                <br />
                城市：
                <input className="profile-input"
                  type="text"
                  name="city"
                  size="10"
                  placeholder="苏州市"
                  value={formData.city}
                  onChange={handleChange}
                /></p>
            </div>
            <button type="submit" disabled={isDisabled}>
              {isDisabled ? "正在创建……" : "创建档案"}
            </button>
            {error}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateProfile;
