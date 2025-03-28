import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './Register.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ error: '', success: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { first_name, last_name, email, password, phone, address, confirmPassword } = formData;

        // Basic Validation
        if (!first_name || !last_name || !email || !password || !phone || !address || !confirmPassword) {
            setMessage({ error: 'All fields are required.', success: '' });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ error: 'Passwords do not match.', success: '' });
            return;
        }

        if (password.length < 6) {
            setMessage({ error: 'Password must be at least 6 characters long.', success: '' });
            return;
        }

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    email,
                    password,
                    phone,
                    address
                }),
            });

            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Account successfully created!', error: ''});
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    phone: '',
                    address: '',
                    confirmPassword: ''
                });
                navigate('/login');
            } else {
                setMessage({error: data.message || 'Registration failed.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };

    return (
        <div className="register-page">
            <div className="form">
                <h1>Create an Account</h1>
                <form onSubmit={handleRegister}>
                    {['first_name', 'last_name', 'email', 'password', 'phone', 'address', 'confirmPassword'].map((field, index) => (
                        <div className="field-wrap" key={index}>
                            <input
                                type={field.includes('password') ? 'password' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={formData[field]}
                                onChange={handleChange}
                                className={formData[field] ? 'filled' : ''}
                            />
                            <label className={formData[field] ? 'active' : ''}>
                                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}<span className="req">*</span>
                            </label>
                        </div>
                    ))}
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <button type="submit" className="button button-block">Register</button>
                </form>
                <p className="already-registered">Already have an account? <Link to={'/login'}>Login</Link></p>
            </div>
        </div>
    );
}

export default Register;