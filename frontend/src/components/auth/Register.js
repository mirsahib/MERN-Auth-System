import React, { useState, useContext } from "react";
import userContext from "../../context/user.context";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import ErrorNotice from "../misc/errorNotification";

export default function Register() {
  const { setUserData } = useContext(userContext);
  const { errorState, setErrorState } = useState();
  const history = useHistory();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [userName, setUsername] = useState();

  const submit = async (e) => {
    try {
      e.preventDefault();
      const newUser = { email, password, passwordCheck, userName };
      await Axios.post("http://localhost:5000/users/register", newUser);
      const loginRes = await Axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/");
    } catch (error) {
      error.response.data.msg && setErrorState(error.response.data.msg);
    }
  };

  return (
    <div className="page">
      <h2>Register</h2>
      {errorState && (
        <ErrorNotice
          message={errorState}
          clearError={() => {
            setErrorState(undefined);
          }}
        />
      )}
      <form className="form" onSubmit={submit}>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Verify password"
          onChange={(e) => {
            setPasswordCheck(e.target.value);
          }}
        />

        <label htmlFor="register-display-name">User name</label>
        <input
          id="register-display-name"
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />

        <input type="submit" value="Register" />
      </form>
    </div>
  );
}
