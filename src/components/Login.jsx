import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../firebase/auth';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginUser(email, password);
    if (res.success) {
      navigate('/crop-selection');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-container animate-fade">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon" style={{ margin: '0 auto 1rem auto' }}>
            <svg viewBox="0 0 32 32" width="40" height="40" fill="none">
              <circle cx="16" cy="16" r="15" stroke="#46b464" strokeWidth="1.5" />
              <path d="M16 8 C12 8 9 11 9 15 C9 19 12 21 16 21 C20 21 23 19 23 15" stroke="#46b464" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M16 21 L16 26" stroke="#46b464" strokeWidth="2" strokeLinecap="round"/>
              <path d="M13 24 L19 24" stroke="#46b464" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Iniciar sesión</h2>
          <p>Bienvenido de nuevo a Agrosmart</p>
        </div>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input 
                type="email" 
                placeholder="nombre@finca.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>Contraseña</label>
              <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-divider">
          <span>O ingresa con</span>
        </div>

        <div className="social-login">
          <button className="btn btn-secondary social-btn">Google</button>
          <button className="btn btn-secondary social-btn">Facebook</button>
        </div>

        <div className="login-footer" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          ¿No tienes una cuenta? <Link to="/register" className="accent-link">Regístrate gratis</Link>
        </div>
      </div>
    </div>
  );
}
