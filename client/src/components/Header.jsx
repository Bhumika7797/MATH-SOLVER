// src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">MathSolver</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={"nav-link " + (location.pathname === "/" ? "active" : "")} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={"nav-link " + (location.pathname === "/solve" ? "active" : "")} to="/solve">Solve Math</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
