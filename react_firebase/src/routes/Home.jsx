import { authService } from 'fbase'
import React from 'react'

function Home() {
    const logout = async(e) => {
        try {
            await authService.signOut();
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            <h3>Home page</h3>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Home
