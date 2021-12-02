import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function Login({ setIsLoggedIn, setUserObj }) {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email : '',
        password : ''
    })
    const onClickLogin = () => {
        const { email, password } = input
        axios.post('/api/user', { email, password })
        .then(res => {
            setUserObj(res.data.user);
            setIsLoggedIn(true);
            navigate('/');
        })
    }
    const onChangeInput = (e) => {
        const { name, value } = e.target
        setInput({
            ...input,
            [name] : value
        })
    }
    return (
        <section>
            <input type="text" name="email" id="email" onChange={onChangeInput}/>
            <input type="password" name="password" id="password"  onChange={onChangeInput}/>
            <button type="button" onClick={onClickLogin}>로그인</button>
            <button type="button">구글로그인</button>
        </section>
    )
}

export default Login
