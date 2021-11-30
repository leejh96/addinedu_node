import { authService } from 'fbase';
import React from 'react'
import { Link } from 'react-router-dom';
function Nav({ isLoggedIn }) {
    return (
        <>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/profile">profile</Link></li>
                    <li><Link to="/edit">Edit profile</Link></li>
                    {isLoggedIn && 
                        <li>
                            <button
                                onClick={() => { authService.signOut()}}
                            >
                                Logout
                            </button>
                        </li>
                    }
                </ul>
        </>
    )
}

export default Nav
