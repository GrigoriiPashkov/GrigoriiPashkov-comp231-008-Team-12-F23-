import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import "../styles/navbar.css";
import userPr from "../img/user.png";

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
        <ul className="nav-links">
          <li>
            <NavLink to="/home" activeclassname="active-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/events" activeclassname="active-link">
              My Events
            </NavLink>
          </li>
          <li>
            <NavLink to="/create" activeclassname="active-link">
              Create Event
            </NavLink>
          </li>
          <li>
            <NavLink to="/rules" activeclassname="active-link">
              Rules Page
            </NavLink>
          </li>
          <li>
            <a href="/" onClick={logoutHandler}>
              Log Out
            </a>
          </li>
          <li>
            <NavLink to="/profile" className="user-image">
              <img className="user-image" src={userPr} alt="User Profile" />
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
