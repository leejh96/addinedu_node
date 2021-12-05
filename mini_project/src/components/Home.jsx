import React from 'react'
import { useNavigate } from 'react-router-dom';
import layout from '../css/home.module.css'
import { authService } from '../fbase';
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
        <section className={layout.wrap}>
            <h1 className={layout.title}>채팅 프로젝트</h1>
            {
                !isLoggedIn ?
                <div>            
                    <div className={layout.btnWrap}>
                        <button type='button' name='login' className={layout.loginBtn} onClick={onClickRoute}>로그인</button>
                    </div>
                    <div className={layout.btnWrap}>
                        <button type='button' name='register' className={layout.registerBtn} onClick={onClickRoute}>회원가입</button>
                    </div>
                </div>
            :
                <div>
                    <div className={layout.btnWrap}>
                        <button type='button' className={layout.logoutBtn} onClick={() => authService.signOut()}>로그아웃</button>
                    </div>
                    <div className={layout.btnWrap}>
                        <button type='button' className={layout.chatGoBtn} onClick={() => navigate('/chat')}>채팅방 입장</button>
                    </div>
                </div>
            }
            
        </section>
    )
}

export default Home
