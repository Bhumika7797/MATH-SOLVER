// src/components/MathSolver.jsx
import React, { useState } from 'react';
import axios from 'axios';

const MathSolver = () => {
  const [phoneNumber, setphoneNumber] = useState('');
  const [file, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handlephoneNumberChange = (e) => {
    setphoneNumber(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !file) {
      setMessage('Please enter phone number and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('phoneNumber', phoneNumber);
    formData.append('file', file);

    try {
      setMessage('Sending your math problem...');
      // Replace URL below with your backend endpoint
      const response = await axios.post('http://localhost:5000/api/problems', formData);
      if (response.status === 200) {
        setMessage('Solution sent to your WhatsApp number!');
        setphoneNumber('');
        setImage(null);
        e.target.reset();
      } else {
        setMessage('Failed to send solution. Please try again.');
      }
    } catch (error) {
      setMessage('Error sending request. Please check your number and try again.');
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Submit Your Math Problem</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            phoneNumber Number (with country code, e.g., +91XXXXXXXXXX)
          </label>
          <input
            type="tel"
            id="phone"
            className="form-control"
            placeholder="+91XXXXXXXXXX"
            value={phoneNumber}
            onChange={handlephoneNumberChange}
            required
            pattern="^\+\d{10,15}$"
          />
          <div className="form-text">Make sure WhatsApp is active on this number.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Upload Math Problem Image
          </label>
          <input
            type="file"
            id="image"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
      {message && (
        <div className="alert alert-info mt-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default MathSolver;
