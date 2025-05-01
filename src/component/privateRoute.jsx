import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthenticated } from '../api/auth';

export default function PrivateRoute({ children }) {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthenticated().then((result) => {
      setAuth(result);
      if (!result) navigate('/login');
    });
  }, [navigate]);

  if (auth === null) return <div>Loading...</div>;
  return auth ? children : null;
}
