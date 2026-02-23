import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

export default function Navigation() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🌸</span>
          <span className="logo-text">SakuraCycle</span>
        </Link>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/schedule"
            className={`nav-link ${isActive('/schedule') ? 'active' : ''}`}
          >
            Schedule
          </Link>
          <Link
            to="/awareness"
            className={`nav-link ${isActive('/awareness') ? 'active' : ''}`}
          >
            Awareness
          </Link>
          <Link
            to="/exercises"
            className={`nav-link ${isActive('/exercises') ? 'active' : ''}`}
          >
            Exercises
          </Link>
          <Link
            to="/games"
            className={`nav-link ${isActive('/games') ? 'active' : ''}`}
          >
            Games
          </Link>
          <Link
            to="/companion"
            className={`nav-link ${isActive('/companion') ? 'active' : ''}`}
          >
            Companion
          </Link>
        </div>
      </div>
    </nav>
  )
}
