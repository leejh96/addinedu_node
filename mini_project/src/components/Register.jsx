import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService }from '../fbase';
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
        <section>    
            <input type="text" name="email" id="email" onChange={onChangeInput} />
            <input type="password" name="password" id="password" onChange={onChangeInput}/>
            <button type="button" onClick={onClickRegister}>회원가입</button>
            <div>{err}</div>
        </section>
    )
}

export default Register
