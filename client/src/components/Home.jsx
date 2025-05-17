// src/components/Home.jsx
import React from 'react';
import mathGif from '../assets/math-animation.gif';

const Home = () => (
  <div className="text-center">
    <h1 className="mb-4 animate-fade-in">Welcome to MathSolver</h1>
    <p className="lead mb-5 animate-slide-up">
      Upload your math problem as an image and get the solution delivered via WhatsApp.
    </p>
    <img
      src={mathGif}
      alt="Math Animation"
      className="img-fluid mx-auto d-block animate-zoom-in"
      style={{ maxWidth: '400px' }}
    />
  </div>
);

export default Home;
