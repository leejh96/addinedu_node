import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
// import Nav from './components/Nav'
import { authService, dbService } from './fbase';
import Chat from './components/Chat'
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    //로그인 한 유저의 정보 가져오기
    authService.onAuthStateChanged(user => {
      if(user){
        setIsLoggedIn(user);
        setUserObj(user);
      }else{
        setIsLoggedIn(false);
      }
    })
  }, [])

  return (
    <BrowserRouter>
      {/* <Nav isLoggedIn={isLoggedIn} setUserObj={setUserObj} setIsLoggedIn={setIsLoggedIn} /> */}
      <Routes>
        {isLoggedIn ?
          <>
            <Route path='/' element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path='/login' element={
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setUserObj={setUserObj}
              />
            } />
            <Route path='/register' element={<Register />} />
            <Route path="/chat" element={<Chat />} /> 
            <Route path='/profile' element={<Profile />} />
          </>
          :
          <>
            <Route path='/login' element={
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setUserObj={setUserObj}
              />
            } />
            <Route path='/register' element={<Register />} />
            <Route path='*' element={<Home isLoggedIn={isLoggedIn} />} />
          </>
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App
