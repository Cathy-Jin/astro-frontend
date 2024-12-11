import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../../firebase';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence);
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to the home page on success
        } catch (err) {
            if (err.code === 'auth/invalid-credential') {
                setError(
                    <div className="error">
                        邮箱或密码不正确，请重试或
                        <Link to="/signup">注册</Link>
                        新用户。
                    </div> // TODO: reset password
                );
            } else {
                setError(<div className="error">{err.message}</div>); // TODO: render other errors
            }

        }
    };

    return (
        <div>
            <h2>用户登录</h2>
            <form className="auth-form" onSubmit={handleLogin}>
                <div className="auth-row">
                    <p>
                        {error}
                        <br />
                        邮箱：<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <br />
                        密码：<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <br />
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />记住我
                        <br />
                        <Link to="/forget-password">忘记密码？</Link>
                    </p>
                </div>
                <button className="auth-button" type="submit">登录</button>
            </form>
            
        </div>
    );
};

export default Signin;