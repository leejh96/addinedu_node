import Router from "./Router";
import React, { useState, useEffect } from 'react';
import { authService, dbService, storageService} from 'fbase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  useEffect(() => {
    //로그인 한 유저의 정보 가져오기
    authService.onAuthStateChanged(user => {
      if(user){
        setIsLoggedIn(user);
      }else{
        setIsLoggedIn(false);
      }
    })
    return () => {
      setIsLoggedIn(authService.currentUser);
    }
  }, [])
  return (
    <Router isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
  );
}
export default App;
