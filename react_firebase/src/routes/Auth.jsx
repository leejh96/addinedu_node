import { authService, firebaseInstance } from 'fbase';
import React, { useState } from 'react'
function Auth() {
    const [input, setInput] = useState({
        email : '',
        password : ''
    })
    const [err, setErr] = useState('');
    const onSubmit = async(e) => {
        try {
            e.preventDefault();
            const { email, password } = input;
            let data;
            const { id } = e.target;
            if( id === 'LoginForm'){
                data = await authService.signInWithEmailAndPassword(email, password);
            }else if ( id === 'SignupForm'){
                data = await authService.createUserWithEmailAndPassword(email, password);
            }
        } catch (error) {
            setErr(error.message);
        }
    }

    const onChange = (e) => {
        //태그의 value를 넣어두면 onChange가 안됨
        const { name, value } = e.target;
        setInput({
            ...input,
            [name] : value
        })
    }

    const onSnsLogin = async (e) => {
        try {
            const { name } = e.target;
            let provider;
            if(name === 'google'){
                provider = new firebaseInstance.auth.GoogleAuthProvider();
            }else if(name === 'github'){
                provider = new firebaseInstance.auth.GithubAuthProvider();
            }
            //팝업창으로 로그인
            const data = await authService.signInWithPopup(provider);
            console.log(data);
        } catch (error) {
            setErr(error.message);
        }
        //sns 로그인을 위해 firebase 객체사용
    }
    return (
        <div>
            <h3>Login page</h3>
            {err && <p style={{ color: 'red' }}>{err}</p>}
            <h4>Login</h4>
            <form id='LoginForm' onSubmit={onSubmit}>
                <input type="email" name='email' placeholder='Email' onChange={onChange} />
                <br/>
                <input type="password" name='password' placeholder='password'  onChange={onChange} />
                <br/>
                <input type="submit" value="Log in"  />
            </form>
            <div>
                <button name="google" onClick={onSnsLogin}>Google Login</button>
                <button name="github" onClick={onSnsLogin}>Github Login</button>
            </div>
            <hr />
            <h4>Sign Up</h4>
            <form id='SignupForm' onSubmit={onSubmit}>
                이메일 : <input type="email" name='email' placeholder='Email'  onChange={onChange}/>
                <br/>
                비밀번호 : <input type="password" name='password' placeholder='Password'  onChange={onChange}/>
                <br/>
                <input type="submit" value="Sign up"  />
            </form>
        </div>
    )
}

export default Auth;
