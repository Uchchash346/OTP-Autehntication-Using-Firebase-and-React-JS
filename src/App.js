import React from 'react';
import { auth } from './firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './Login';
import Mainpage from './Main';

function App() {
  const [user] = useAuthState(auth);
  return (
    user ? <Mainpage /> : <Login />
  );
}

export default App;
