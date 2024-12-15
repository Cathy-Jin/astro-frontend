import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        console.log('useEffect triggered');
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://astro-notebook.onrender.com/profile', {  // TODO: replace url
                    method: 'GET',
                    headers: {
                        // 'X-CSRF-TOKEN': document.cookie.match(/csrf_token=([^;]+)/)[1]
                    },
                    credentials: 'include'  // Include cookies in the request
                });
                if (response.status === 200) {
                    const data = await response.json();
                    const email = sessionStorage.getItem('email');
                    if (email === data.email) {
                        setUser({ email: email });
                    } else {
                        sessionStorage.clear();
                    }
                } else {
                    sessionStorage.clear();
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div><p>正在获取档案，请稍后。。。</p></div>;
    }

    if (!user) {
        return <div><p>未登录，请<Link to="/signin">登录</Link>或<Link to="/signup">注册</Link>。</p></div>;
    }

    return (
        <div className="user-profile">
            <p>你好，{user.email}</p>
            <p>专属于你的人生主题解读正在开发中，敬请期待。</p>
            <button className="auth-button" onClick={() => navigate("/")}>返回首页</button>
        </div>
    );  //TODO: reservation link
};

export default Profile;