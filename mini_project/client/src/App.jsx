import React, {useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Book from './components/Book';
import Profile from './components/Profile';
import Nav from './components/Nav'
import axios from 'axios';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    axios.get('/api/user')
    .then(res => {
      if(res.data.user){
        setIsLoggedIn(true)
        setUserObj(res.data.user)
      }
    })
  }, [])

  return (
    <BrowserRouter>
      <Nav isLoggedIn={isLoggedIn} setUserObj={setUserObj} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        {isLoggedIn ? 
          <>
            <Route path='/' element={<Home isLoggedIn={isLoggedIn}/>} />
            <Route path='/login' element={
              <Login 
                setIsLoggedIn={setIsLoggedIn}
                setUserObj={setUserObj}
              />
            } />
            <Route path='/register' element={<Register />} />
            <Route path='/book' element={<Book isLoggedIn={isLoggedIn}/>} />
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
          <Route path='*' element={<Home isLoggedIn={isLoggedIn}/>} />
          </>
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
