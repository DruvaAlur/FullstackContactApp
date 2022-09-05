import axios from "axios";
import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
function Login() {
  const navigation = new useNavigate();
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [loginStatus, updateLoginStatus] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await axios
      .post("http://localhost:8800/api/v1/login", {
        username,
        password,
      })
      .then((response) => {
        console.log(response.data.role);
        if (response.data.role == "admin") {
          console.log();
          navigation(`/adminDashboard/${response.data.credential.username}`);
        } else {
          navigation(
            `/userDashboard/createContacts/${response.data.credential.username}`
          );
        }
      })
      .catch((error) => {
        // console.log(error.response.status);
        if (error.response.status == 401) {
          updateLoginStatus(
            <Alert severity="error">Invalid Credentials!</Alert>
          );
        }
      });
  };
  return (
    <>
      <div id="loginform">
        <div class="one">
          <h1>Login</h1>
        </div>
        <div id="login">
          {" "}
          <div style={{ width: "auto", height: "auto" }}>
            <form onSubmit={handleSubmit} id="loginform">
              <br />
              <div>
                <label class="fw-bold">Username:&nbsp; </label>

                <br />

                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => updateUsername(e.target.value)}
                ></input>

                <br />

                <label class="fw-bold">Password:&nbsp;</label>
                <br />
                <input
                  required
                  type="password"
                  // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                  value={password}
                  onChange={(e) => updatePassword(e.target.value)}
                ></input>

                <br />

                <br />

                <button class="btn btn-primary button">Login</button>
                <br />
                <br />
                {loginStatus}
              </div>
            </form>
          </div>
          <br />
        </div>
      </div>
    </>
  );
}
export default Login;
