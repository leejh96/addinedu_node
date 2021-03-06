import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react'
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Auth from 'routes/Auth';
import EditProfile from 'routes/EditProfile';
import Nav from './Nav';
function Router({ isLoggedIn, userObj }) {
    return (
        <BrowserRouter>
            <Nav isLoggedIn={isLoggedIn}/>
            <Routes>
                {
                    isLoggedIn ? 
                    <>
                        <Route path='/' element={<Home userObj={userObj} />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/edit' element={<EditProfile />} />
                    </>
                    :
                    <Route path='*' element={<Auth />}/>
                }
            </Routes>
        </BrowserRouter>
    )
}

export default Router
