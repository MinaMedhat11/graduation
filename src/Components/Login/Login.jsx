import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Shared/auth.module.css';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login, error: authError, message } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const wrapperStyle = {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    zIndex: '0',
  };

  const diagonalStyle = {
    backgroundColor: '#e0f1f4',
    height: '50%',
    clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 100%)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: '2',
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const { success, message } = await login(formData);
        if (success) {
          toast.success(message);
          navigate('/');
        }
      } catch (error) {
        toast.error(error.message);
        setErrors({
          general: error.message
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div style={wrapperStyle}>
        <div
          style={{
            position: 'absolute',
            content: '""',
            top: '10px',
            left: '10px',
            right: 0,
            height: '500px',
            backgroundColor: '#000',
            opacity: '0.05',
            clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)',
            zIndex: '1',
          }}
        ></div>

        <div style={diagonalStyle}></div>

        <div className="background-balls">
          <div className={styles.bottomRightBall}></div>
          <div className={styles.middleBall}></div>
          <div className={styles.bottomLeftBall}></div>
          <div className={styles.topRightBall}></div>
          <div className={styles.topLeftBall}></div>
        </div>

        <div className={`${styles.formContainer} container d-flex align-items-center justify-content-center`}>
          <div className="row w-100">
            <div className="col-md-6">
              <img
                src={require('./../../Images/pngwing.com.png')}
                className="w-25 pt-5"
                alt="LMS Logo"
              />
              <h3 className={`${styles.signinto} pt-5`}>Sign in to</h3>
              <h2 className={styles.headline}>Learning Management System</h2>
            </div>
            <div className="col-md-6">
              <h2 className={`${styles.welcome} text-center pt-5`}>Welcome back</h2>

              <form onSubmit={handleSubmit} className="pt-5 w-75 mt-5 m-auto bg-white rounded-5 p-4">
                <div className="row">
                  <div className="col-md-7">
                    <h5>Welcome to <span className={styles.LMS}>LMS</span></h5>
                    <h2 className={`${styles.signin} pb-4`}>Sign In</h2>
                  </div>
                  <div className="col-md-5">
                    <h6 style={{fontSize:"15px"}}>No Account?</h6>
                    <Link className={`${styles.authLink} text-decoration-none`} to="/signup">
                      Sign Up
                    </Link>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="my-2" htmlFor="email">
                    Enter your username or email address
                  </label>
                  <input 
                    placeholder="User name or email" 
                    type="email" 
                    id="email" 
                    className={`form-control m-auto rounded-3 ${styles.formInput} ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="my-2" htmlFor="password">
                    Enter Your Password
                  </label>
                  <input 
                    placeholder="Password" 
                    type="password" 
                    id="password" 
                    className={`form-control m-auto rounded-3 ${styles.formInput} ${errors.password ? 'is-invalid' : ''}`}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <h6 className={`text-end pt-2 ${styles.authLink}`}
                  style={{ cursor: 'pointer' }}
                >
                  Forgot Password?
                </h6>

                <button 
                  type="submit" 
                  className={`btn btn-outline-success w-100 mt-4 m-auto ${styles.submitButton}`}
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
