import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../fbase';
function Nav({ isLoggedIn, setIsLoggedIn, setUserObj }) {
    const navigate = useNavigate();
    const onClickLogout = () => {
        authService.signOut()
        navigate('/');
    }
    return (
        <nav>
            <ul>
                <li><Link to='/'>홈</Link></li>
                <li><Link to='/book'>책검색</Link></li>
                <li><Link to='/like'>좋아요리스트</Link></li>
                <li><Link to='/profile'>프로필</Link></li>
            </ul>
            {
                isLoggedIn?
            <ul>
                <li><span onClick={onClickLogout}>로그아웃</span></li>
            </ul>
            :
            <ul>
                <li><Link to='/login'>로그인</Link></li>
                <li><Link to='register'>회원가입</Link></li>
            </ul>
            }
        </nav>
    )
}

export default Nav
