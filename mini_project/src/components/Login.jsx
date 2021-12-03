import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService } from '../fbase';
function Login({ setIsLoggedIn, setUserObj }) {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email : '',
        password : ''
    })
    const [err, setErr] = useState('');

    const onClickLogin = () => {
        const { email, password } = input
        authService.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            setIsLoggedIn(true)
            setUserObj(userCredential.user);
            navigate('/');
        })
        .catch((error) => {
            setErr(error.message);
        });
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
            <div>{err}</div>
        </section>
    )
}

export default Login
