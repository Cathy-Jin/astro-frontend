import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { formatLocalTimeWithDayjs} from "../Util";

const Notebook = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(null);
  const [start, setStart] = useState(0);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState({}); // To track errors for each profile
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingMoreError, setLoadingMoreError] = useState("");

  const navigate = useNavigate();

  // Handle load more notes
  const loadMoreNotes = async() => {
    setLoadingMore(true);
    setLoadingMoreError("");
    try {
      const response = await fetch(
        "https://astro-notebook.onrender.com/astro-dice?start=" + start + "&count=20&user_id=" + localStorage.getItem("user_id"),
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            contentType: "application/json;charset=UTF-8"
          },
          credentials: "include", // Include cookies in the request
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setNotes([...notes, ...data?.history])
        setStart(data?.next_start);
      } else if (response.status === 403 || response.status === 401 || response.status === 422) {
        localStorage.clear();
        setUser(null);
        setNotes(null);
        setStart(0);
      } else {
        setLoadingMoreError(
          <div className="error">无法找到笔记信息，请重试。</div>
        );
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoadingMore(false);
    }
  };


  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://astro-notebook.onrender.com/astro-dice?start=0&count=20&user_id=" + localStorage.getItem("user_id"),
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
              contentType: "application/json;charset=UTF-8"
            },
            credentials: "include", // Include cookies in the request
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setUser({ email: localStorage.getItem("email") });
          setNotes(data?.history);
          setStart(data?.next_start)
        } else if (response.status === 403 || response.status === 401 || response.status === 422) {
          localStorage.clear();
          setUser(null);
          setNotes(null);
          setStart(0);
        } else {
          setUser({ email: localStorage.getItem("email") });
          setNotes(null);
          setStart(0);
          setGeneralError(
            <div className="error">无法找到笔记信息，请重试。</div>
          );
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  if (!user) {
    return (
      <div className="notebook">
        <NavBar />
        <div className="main-content">
          {loading ? (
            <p>正在获取笔记，请稍后。。。</p>
          ) : (
            <p>
              请重新<Link to="/signin">登录</Link>或
              <Link to="/signup">注册</Link>。
            </p>
          )}

          <button className="profile-button" onClick={() => navigate("/")}>
            返回首页
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // TODO: add date & type selection
  return (
    <div className="notebook">
      <NavBar />
      <div className="main-content">
        <h1>我的笔记</h1>
        {loading && (
          <div>
            <p>正在获取笔记，请稍后。。。</p>
          </div>
        )}
        {generalError}
        <div className="result">
          {notes?.map((note) => (
            <div className="notebook-item" key={note.id}>
              
              <h4>
                {note.question.slice(0, 35)}
                {note.question.length > 35 ? <>……</> : <></>}
              </h4>
              <div className="notebook-details-container">
                <div className="notebook-details">
                  <p style={{color: "var(--hunter-green-50)"}}>占星骰子</p>
                  <p>{formatLocalTimeWithDayjs(note.created_at)}</p>
                </div>

                <button
                  className="next-button"
                  onClick={() => navigate("/note?id=" + note.id, {
                    state: { note: note },
                  })}
                >
                  <img
                    src="icon/next.png"
                    alt="查看"
                    className="next-button-image"
                  />
                </button>
              </div>
              {errors[note.id]}
            </div>
          ))}
        </div>
        {start % 20 === 0 && (
          <>
            <button className="profile-button" onClick={() => loadMoreNotes()}>
              查看更多笔记
            </button>
            {loadingMore && (
              <div>
                <p>正在获取笔记，请稍后。。。</p>
              </div>
            )}
            {loadingMoreError}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}


export default Notebook;
