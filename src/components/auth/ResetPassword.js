import React, { useState } from "react";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const oobCode = searchParams.get("oobCode"); // Extract code from URL

        if (!oobCode) {
            setError(<div className="error">网址有误，请重试或返回<Link to="/signin">登录</Link>页面。</div>);
            return;
        }

        if (password !== confirmPassword) {
            setError(<div className="error">两次密码输入不一致，请重试。</div>);
            return;
        }

        try {
            // Verify the code
            await verifyPasswordResetCode(auth, oobCode);

            // Confirm the new password
            await confirmPasswordReset(auth, oobCode, password);

            setSuccess(<p>密码重置成功，正在跳转至<Link to="/signin">登录</Link>页面……</p>);
            setError("");
            setTimeout(() => navigate("/signin"), 3000); // Redirect after success
        } catch (err) {
            switch (err.code) {
                case "auth/expired-action-code":
                    setError(<div className="error">网址信息已过期，请重试或返回<Link to="/signin">登录</Link>页面。</div>);
                    break;
                case "auth/invalid-action-code":
                    setError(<div className="error">网址信息有误，请重试或返回<Link to="/signin">登录</Link>页面。</div>);
                    break;
                case "auth/weak-password":
                    setError(<div className="error">密码必须不小于6位，请重试。</div>); 
                    break
                default:
                    setError(<div className="error">密码重置不成功，请重试或返回<Link to="/signin">登录</Link>页面。</div>);
            }
            setSuccess("");
        }
    };

    return (
        <div>
            <h2>重置密码</h2>
            <form className="auth-form" onSubmit={handlePasswordReset}>
                <div className="auth-row">
                    <p>
                        {error}
                        <br />
                        新的密码：<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <br />
                        确认密码：<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </p>
                </div>
                <button className="auth-button" type="submit">重置密码</button>
            </form>
            <br />
            {success}
        </div>
    );
};

export default ResetPassword;