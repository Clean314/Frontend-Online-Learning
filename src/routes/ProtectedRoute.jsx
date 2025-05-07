import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (!auth || auth.authenticated === null) {
    return <div>Loading...</div>;
  }

  if (auth.authenticated === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
