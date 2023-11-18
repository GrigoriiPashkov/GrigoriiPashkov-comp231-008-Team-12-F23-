import React, { useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";
export const AuthPage = () => {
  const message = useMessage();
  const auth = useContext(AuthContext);
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
  return (
    /*Change this form if you need but DO NOT CHANGE AND DELETE names
    You can change buttons but ADD onClick={handlers}*/
    <div>
      <form>
        <div>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            onChange={changeHandler}
          ></input>
          <label htmlFor="email"></label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={changeHandler}
          ></input>
          <label htmlFor="password"></label>
          <input
            type="text"
            id="firstname"
            name="firstName"
            placeholder="First Name"
            onChange={changeHandler}
          ></input>
          <label htmlFor="firstName"></label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            onChange={changeHandler}
          ></input>
          <label htmlFor="lastName"></label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            placeholder="Date Of Birth"
            onChange={changeHandler}
          ></input>
          <label htmlFor="dateOfBirth"></label>
        </div>
        <button onClick={registerHandler} disabled={loading}>
          Sign In
        </button>
        <button onClick={loginHandler} disabled={loading}>
          Log In
        </button>
      </form>
    </div>
  );
};
