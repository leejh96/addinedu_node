import Router from "components/Router";
import React, { useState, useEffect } from 'react';
import { authService} from 'fbase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
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
    return () => {
      setIsLoggedIn(authService.currentUser);
    }
  }, [])
  return (
    <Router 
      isLoggedIn={isLoggedIn}
      userObj={userObj}  
    />
  );
}
export default App;
