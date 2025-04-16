import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
        role,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      navigate(decoded.role === 'admin' ? '/admin' : '/profile');
    } catch (err) {
      setError(err.response?.data.error || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="container-fluid">
        <div className="content-card">
          <h2>Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-label="Username"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                aria-label="Role"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;