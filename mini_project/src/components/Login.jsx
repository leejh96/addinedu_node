import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService, firebaseInstance } from '../fbase';
import layout from '../css/login.module.css'
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
            navigate('/chat');
        })
        .catch((error) => {
            console.log(error);
            setErr(error.message);
        });
    }

    const onClickGoogle = async() => {
        try {
            const provider = new firebaseInstance.auth.GoogleAuthProvider();
            await authService.signInWithPopup(provider);
            navigate('/chat');
        } catch (error) {
            setErr(error.message);
        }
    }

    const onChangeInput = (e) => {
        const { name, value } = e.target
        setInput({
            ...input,
            [name] : value
        })
    }
    return (
        <section className={layout.wrap}>
            <h1 className={layout.title}> 로그인</h1>
            <div className={layout['email-input']}>
                <input type="text" name="email" className={layout.email} placeholder="email" onChange={onChangeInput}/>
            </div>
            <div className={layout['password-input']}>
                <input type="password" name="password" className={layout.password} placeholder="password"  onChange={onChangeInput}/>
            </div>
            <div className={layout['login-button']}>
                <button type="button" className={layout.login} onClick={onClickLogin}>로그인</button>
            </div>
            <div className={layout['google-button']}>
                <button type="button" className={layout.google} onClick={onClickGoogle}>Google Login</button>
            </div>
            <div className={layout['home-button']}>
                <button type="button" className={layout.home} onClick={() => (navigate('/'))}>홈으로</button>
            </div>
            <div className={layout.error}>{err}</div>
        </section>
    )
}

export default Login
