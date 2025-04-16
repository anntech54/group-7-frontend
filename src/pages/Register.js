import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/users/register', {
        username,
        email: email || null,
        password,
        role,
      });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data.error || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <div className="container-fluid">
        <div className="content-card">
          <h2>Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleRegister}>
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
                type="email"
                className="form-control"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
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
                aria-label="Role"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;