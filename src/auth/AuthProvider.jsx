import { createContext, useContext, useEffect, useState } from 'react';
import { checkAuth } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    checkAuth()
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false));
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {authenticated === null ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
