import React from 'react';
import './Input.css';

const Input = ({ type = "text", placeholder, value, onChange, error }) => {
return (
    <div className="input-wrapper">
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'input-error' : ''}`}
    />
    
    {}
    {error && <span className="error-message">{error}</span>}
    </div>
);
};

export default Input;