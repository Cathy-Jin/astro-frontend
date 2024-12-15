import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://astro-notebook.onrender.com/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password }),
                credentials: 'include'
            });

            if (response.status === 200) {
                const data = await response.json();
                sessionStorage.setItem('email', data.email); 
                sessionStorage.setItem('access_token', data.access_token);
                navigate('/'); // TODO: extend session
            } else {
                setError(
                    <div className="error">
                        邮箱或密码不正确，请重试或
                        <Link to="/signup">注册</Link>
                        新用户。
                    </div>
                );
            }
        } catch (error) {
            setError(
                <div className="error">
                    登录失败，请重试或
                    <Link to="/signup">注册</Link>
                    新用户。
                </div>
            );
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