import React from 'react'
import { Link } from 'react-router-dom';
function Nav() {
    return (
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">profile</Link></li>
            <li><Link to="/edit">Edit profile</Link></li>

        </ul>
    )
}

export default Nav
