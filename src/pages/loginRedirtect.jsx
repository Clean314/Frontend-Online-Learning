// src/pages/LoginRedirect.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthenticated } from '../api/auth';
import Login from './login';

export default function LoginRedirect() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthenticated().then((result) => {
      setIsAuth(result);
      setAuthChecked(true);
      if (result) navigate('/');
    });
  }, [navigate]);

  if (!authChecked) return <div>Loading...</div>;
  return isAuth ? null : <Login />;
}
