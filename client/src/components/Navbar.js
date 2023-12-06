import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import "../styles/navbar.css";

export const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    navigate("/");
  };
  return (
    <nav>
      <div className="nav-wrapper">
        <a href="/" className="brand-logo">
          Your Logo
        </a>
        <ul className="nav-links">
          <li>
            <NavLink to="/home" activeClassName="active-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/create" activeClassName="active-link">
              Create Event
            </NavLink>
          </li>
          <li>
            <a href="/" onClick={logoutHandler}>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
