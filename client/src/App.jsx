// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import MathSolver from './components/MathSolver.jsx';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="container my-5 min-vh-75">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solve" element={<MathSolver />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
