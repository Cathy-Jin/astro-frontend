import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError(<div className="error">两次密码输入不一致，请重试。</div>);
            return;
        }
        try {
            // Create a new user with email and password
            await createUserWithEmailAndPassword(auth, email, password);

            navigate('/');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError(<div className="error">该邮箱已被注册。请<Link to='/signin'>登录</Link>或尝试新的邮箱。</div>);  
            } else if (err.code === 'auth/weak-password') {
                setError(<div className="error">密码必须不小于6位，请重试。</div>); 
            }
            else {
                setError(<div className="error">注册未成功，请重试。{err.message}</div>); 
            }
        }
    };

    return (
        <div>
            <h2>用户注册</h2>
            <form className="auth-form" onSubmit={handleSignUp}>
                <div className="auth-row">
                    <p>
                    {error}
                    <br />
                    邮箱：<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/> 
                    <br />
                    密码：<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <br />
                    确认密码：<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                    </p>
                </div>
                <button className="auth-button" type="submit">注册</button>
            </form>
        </div>
    );
};

export default Signup;