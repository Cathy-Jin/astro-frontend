import React, { useEffect, useState, useRef } from "react";
import {
  useLocation,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { formatLocalTimeWithDayjs, displayAstroDiceRollsCN } from "../Util";

const Note = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteNoteDisabled, setIsDeleteNoteDisabled] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isCreateCommentDisabled, setIsCreateCommentDisabled] = useState(false);
  const [createCommentError, setCreateCommentError] = useState("");

  const [isDeleteCommentDisabled, setIsDeleteCommentDisabled] = useState([]);
  const [deleteCommentErrors, setDeleteCommentErrors] = useState({});

  const [searchParams] = useSearchParams();
  const note_id = searchParams.get("id") || "";
  const location = useLocation();
  const note = location.state?.note; // Get from router state
  const textareaRef = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewComment(e.target.value);
    textareaRef.current.style.height = "auto"; // Reset height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
  };

  // Handle note deletion
  const deleteNote = async (id) => {
    if (isDeleteNoteDisabled) return;

    setError("");
    setIsDeleteNoteDisabled(true);

    try {
      const response = await fetch("https://astro-notebook.onrender.com/general-reading", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          user_id: localStorage.getItem("user_id"),
        }),
        credentials: "include",
      });

      if (response.status === 201) {
        navigate("/notebook");
      } else {
        setError(<div className="error">删除失败，请刷新或重试。</div>);
      }
    } catch (error) {
      setError(<div className="error">删除失败，请刷新或重试。</div>);
    }
    setIsDeleteNoteDisabled(false);
  };

  // Handle comment creation
  const addComment = async () => {
    if (isCreateCommentDisabled) return;

    if (newComment.length === 0) {
      setCreateCommentError(<div className="error">请输入你的想法。</div>);
      return;
    }

    setCreateCommentError("");
    setIsCreateCommentDisabled(true);
    try {
      const response = await fetch(
        "https://astro-notebook.onrender.com/general-reading-comment",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: newComment,
            user_id: localStorage.getItem("user_id"),
            reading_id: note_id,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNewComment("");
        setComments([data, ...comments]);
        
      } else {
        setCreateCommentError(<div className="error">添加失败，请重试。</div>);
      }
    } catch (error) {
        setCreateCommentError(<div className="error">添加失败，请重试。</div>);
    }
    setIsCreateCommentDisabled(false);
  };

  // Handle comment deletion
  const deleteComment = async (id) => {
    if (isDeleteCommentDisabled[id]) return;

    setIsDeleteCommentDisabled((prev) => ({
      ...prev,
      [id]: true,
    }));
    try {
      const response = await fetch(
        "https://astro-notebook.onrender.com/general-reading-comment",
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            user_id: localStorage.getItem("user_id"),
          }),
          credentials: "include",
        }
      );

      if (response.status === 201) {
        // Remove the deleted comment from the list
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        );
        setDeleteCommentErrors((prevError) => ({ ...prevError, [id]: null })); // Clear error for the profile
      } else {
        setDeleteCommentErrors((prevError) => ({
          ...prevError,
          [id]: <div className="error">删除失败，请重试。</div>,
        }));
      }
    } catch (error) {
        setDeleteCommentErrors((prevError) => ({
        ...prevError,
        [id]: <div className="error">删除失败，请重试。</div>,
      }));
    }
    setIsDeleteCommentDisabled((prev) => ({
      ...prev,
      [id]: false,
    }));
  }

  useEffect(() => {
      const fetchComments = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            "https://astro-notebook.onrender.com/general-reading-comment?user_id=" + localStorage.getItem("user_id") + "&reading_id=" + note_id,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
                contentType: "application/json;charset=UTF-8"
              },
              credentials: "include",
            }
          );
          if (response.status === 200) {
            const data = await response.json();
            setComments(data?.comments);
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
                哎呀，复盘笔记加载出现了一些问题。请稍后再试。
              </div>
            );
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
          setError(
            <div className="error">
              哎呀，复盘笔记加载出现了一些问题。请稍后再试。
            </div>
          );
        } finally {
          setLoading(false);
        }
      };
  
      fetchComments();
    }, [note_id]);

  if (!note || note.id !== note_id) {
    return (
      <div className="note">
        <NavBar />
        <div className="main-content">
          <p>无法找到笔记信息，请重试。</p>

          <button
            className="profile-button"
            onClick={() => navigate("/notebook")}
          >
            返回我的笔记
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="note">
      <NavBar />
      <div className="main-content">
        <div className="note-header">
          <p>
            <Link
              to="/notebook"
              style={{ textDecoration: "none", color: "var(--shadow-gray)" }}
            >
              我的笔记
            </Link>{" "}
            /{" "}
            <Link
              to="/astro-dice"
              style={{ textDecoration: "none", color: "var(--shadow-gray)" }}
            >
              占星骰子
            </Link>
          </p>
          <h2>{note?.question}</h2>
          <p style={{ color: "var(--shadow-gray-50)" }}>
            创建于 {formatLocalTimeWithDayjs(note?.created_at)}
          </p>
          <br />
          <p>
            <b>骰子结果</b>
          </p>
          {displayAstroDiceRollsCN(note?.outcomes)}
        </div>
        <br />
        <div className="note-input-collector">
          <textarea
            ref={textareaRef}
            className="general-reading-input"
            type="text"
            name="comment"
            maxLength="5000"
            placeholder="输入你此时的想法。"
            value={newComment}
            onChange={handleChange}
            required
          />
          <div style={{ textAlign: "right" }}>
            {createCommentError}{" "}
            <button
              className="image-button"
              onClick={() => addComment()}
              disabled={isCreateCommentDisabled}
            >
              <img src="icon/add.png" alt="添加" className="button-image" />
            </button>
          </div>
        </div>
        {comments &&
          comments.map((comment) => {
            return (
              <div className="note-comment">
                <hr />
                <div className="note-comment-header">
                  <p style={{ color: "var(--shadow-gray-50)" }}>
                    {formatLocalTimeWithDayjs(comment?.last_modified_at)}
                    &nbsp;&nbsp;&nbsp;&nbsp;我
                  </p>
                  {deleteCommentErrors[comment?.id]}
                  <button
                    className="deletion-button"
                    onClick={() => deleteComment(comment?.id)}
                    disabled={isDeleteCommentDisabled[comment.id]}
                  >
                    <img
                      src="icon/trash.png"
                      alt="删除"
                      className="deletion-button-image"
                    />
                  </button>
                </div>
                <p>{comment?.comment}</p>
              </div>
            );
          })}
        {note?.output && (
          <div className="note-comment">
            <hr />
            <p style={{ color: "var(--shadow-gray-50)" }}>
              {formatLocalTimeWithDayjs(note?.created_at)}
              &nbsp;&nbsp;&nbsp;&nbsp;星迹档案（解读仅供参考）
            </p>
            <p>{note?.output}</p>
          </div>
        )}
        {loading && <p>正在加载复盘历史……</p>}
        {error}
        <div className="note-bottom-button-container">
          <button onClick={() => navigate("/notebook")}>返回</button>{" "}
          <button
            onClick={() => deleteNote(note.id)}
            disabled={isDeleteNoteDisabled}
          >
            删除笔记
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Note;
