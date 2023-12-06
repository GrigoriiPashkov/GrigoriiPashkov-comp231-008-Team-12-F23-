import React, { useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import "../styles/authPage.css";
import { AuthContext } from "../context/AuthContext";
export const AuthPage = () => {
  const message = useMessage();
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const { loading, error, request, clearError } = useHttp();
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      message(data.message);
    } catch (e) {}
  };
  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      auth.login(data.token, data.userId);
    } catch (e) {}
  };
  const toggleMode = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div className="auth-body">
      <div
        className={`container ${isLogin ? "" : "right-panel-active"}`}
        id="container"
      >
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Create Account</h1>

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={changeHandler}
              value={form.firstName}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={changeHandler}
              value={form.lastName}
            />
            <input
              type="date"
              name="dateOfBirth"
              onChange={changeHandler}
              value={form.dateOfBirth}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={changeHandler}
              value={form.email}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={changeHandler}
              value={form.password}
            />
            <button
              className="auth-button"
              onClick={registerHandler}
              disabled={loading}
            >
              Create Account
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign In</h1>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={changeHandler}
              value={form.email}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={changeHandler}
              value={form.password}
            />
            {/* <a href="#">Forgot your password?</a>*/}
            <button
              className="auth-button"
              onClick={loginHandler}
              disabled={loading}
            >
              Log In
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div
              className={`overlay-panel overlay-${isLogin ? "right" : "left"}`}
            >
              <h1>White Board</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="auth-button-ghost" onClick={toggleMode}>
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
