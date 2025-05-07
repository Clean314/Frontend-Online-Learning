import { useState } from 'react';
import { login } from '../api/auth';
import useAuth from '../auth/useAuth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthenticated } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); 
      setAuthenticated(true);
      window.location.href = '/';
    } catch (err) {
      alert('로그인 실패');
      setAuthenticated(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginPage;