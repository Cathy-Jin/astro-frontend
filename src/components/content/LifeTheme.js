import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";

const LifeThemeGPT = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "未命名档案";

  const navigate = useNavigate();

  return (
    <div className="life-theme-gpt">
      <NavBar />
      <div className="main-content">
        <p>
          专属于<b>{name}</b>的人生主题解读正在开发中，敬请期待。
        </p>
        <button className="auth-button" onClick={() => navigate("/")}>
          返回首页
        </button>
      </div>
    </div>
  );
};

export default LifeThemeGPT;
