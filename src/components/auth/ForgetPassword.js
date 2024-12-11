import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage(<p>重置密码邮件已发送，请前往您的邮箱查看。</p>);
            setError(""); // Clear any previous errors
        } catch (err) {
            setMessage(""); // Clear any previous messages
            switch (err.code) {
                case "auth/user-not-found":
                    setError(<div className="error">找不到该邮箱注册的用户，请重试。</div>);
                    break;
                case "auth/invalid-email":
                    setError(<div className="error">请确保邮箱输入正确。</div>);
                    break;
                default:
                    setError(<div className="error">重置密码邮件发送未成功，请重试。</div>);
            }
        }
    };

    return (
        <div>
            <h2>忘记密码？</h2>
            <form className="auth-form" onSubmit={handleForgetPassword}>
                <div className="auth-row">
                    <p>
                        {error}
                        <br />
                        邮箱：<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </p>
                </div>
                <button className="auth-button" type="submit">重置密码</button>
            </form>
            <br />
            {message}
        </div>
    );
};

export default ForgetPassword;