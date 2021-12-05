import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService }from '../fbase';
import layout from '../css/register.module.css';
function Register() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email : '',
        password : ''
    })
    const [err, setErr] = useState('');

    const onClickRegister = () => {
        const { email, password } = input
        authService.createUserWithEmailAndPassword(email, password)
        .then(() => {
            navigate('/login');
        })
        .catch(err => {
            setErr(err.message)
        })
    }
    const onChangeInput = (e) =>{
        const { name, value } = e.target
        setInput({
            ...input,
            [name] : value
        })
    }
    return (
        <section className={layout.wrap}>
            <h1 className={layout.title}>회원가입</h1>
            <div className={layout['email-input']}>
                <input type="text" name="email" className={layout.email} placeholder="email" onChange={onChangeInput} />
            </div>
            <div className={layout['password-input']}>
                <input type="password" name="password" className={layout.password} placeholder="password" onChange={onChangeInput}/>
            </div>
            <div className={layout['register-button']}>
                <button type="button" className={layout.register} onClick={onClickRegister}>회원가입</button>
            </div>
            <div className={layout['home-button']}>
                <button type="button" className={layout.home} onClick={() => navigate('/')}>홈으로</button>    
            </div>    
            <div className={layout.error}>{err}</div>
        </section>
    )
}

export default Register
