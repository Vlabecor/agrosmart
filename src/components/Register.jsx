import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerFullUser } from '../firebase/auth';
import useAgroStore from '../store/useAgroStore';
import './Login.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    finca: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Try to use initAuth immediately on load or assume App handles it

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await registerFullUser(formData);
    
    if (res.success) {
      // Zustand should pick it up automatically via onAuthStateChanged
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
          <h2>Registro Agrosmart</h2>
          <p>Crea tu cuenta para comenzar a monitorear tu finca</p>
        </div>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" required />
            </div>
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nombre@finca.com" required />
            </div>
          </div>

          <div className="form-group">
            <label>Nombre de la Finca (Opcional)</label>
            <div className="input-wrapper">
              <span className="input-icon">🏡</span>
              <input type="text" name="finca" value={formData.finca} onChange={handleChange} placeholder="Finca La Esperanza" />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required minLength="6" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="login-footer">
          ¿Ya tienes cuenta? <Link to="/login" className="accent-link">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
}
