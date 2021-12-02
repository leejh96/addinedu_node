import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function Register() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email : '',
        password : ''
    })
    const onClickRegister = () => {
        const { email, password } = input
        axios.post('/api/user/register', { email, password })
        .then(res => {
            navigate('/login');
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
        </section>
    )
}

export default Register
