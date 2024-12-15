import React, { useState } from "react";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://astro-notebook.onrender.com/forget-password', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email}),
                credentials: 'include'
            });

            if (response.status === 200) {
                setMessage(<p>若该用户存在，重置密码邮件已发送，请前往您的邮箱查看。</p>);
                setError(""); 
            } else {
                setMessage("")
                setError(<div className="error">重置密码邮件发送未成功，请重试。</div>);
            }
        } catch (error) {
            setMessage("")
                setError(<div className="error">重置密码邮件发送未成功，请重试。</div>);
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