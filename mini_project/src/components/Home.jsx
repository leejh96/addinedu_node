import React from 'react'
import { useNavigate } from 'react-router-dom';
import layout from '../css/home.module.css'
function Home({ isLoggedIn }) {
    const navigate = useNavigate();
    const onClickRoute = (e) => {
        const { name } =e.target;
        if(name === 'login'){
            return navigate('/login');
        }else if(name === 'register'){
            return navigate('/register');
        }else{
            return;
        }
    }
    return (
        <>
        {
            isLoggedIn ?            
            <div className={layout.wrap}>
                <button type='button' name='login' onClick={onClickRoute}>로그인</button>
                <button type='button' name='register' onClick={onClickRoute}>회원가입</button>
            </div>
        :
            <div>
                <button type='button'>로그아웃</button>
            </div>
        }
        </>
    )
}

export default Home
