import "./createContactDetail.css";
import NavBar from "../userDashboard/navigationBar/NavBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
function CreateContactDetail() {
  const currentUser = useParams();
  const navigation = new useNavigate();

  const [type, updateType] = useState("");
  const [value, updateValue] = useState("");
  const [status, updateStatus] = useState("");
  const [isLoggedIn, updateIsLoggedIn] = useState("");
  const location = useLocation();
  let fullname = location.state;
  if (fullname != null) {
    window.sessionStorage.setItem("fullname", fullname);
  }
  fullname = window.sessionStorage.getItem("fullname");
  useEffect(() => {
    axios
      .post(
        `http://localhost:8800/api/v1/isUserLoggedIn/${currentUser.username}`,
        {}
      )
      .then((resp) => {
        updateIsLoggedIn(true);
      })
      .catch((error) => {
        updateIsLoggedIn(false);
      });
  }, []);
  const handleCreateContactDetail = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `http://localhost:8800/api/v1/createContactDetail/${currentUser.username}`,
        {
          type,
          value,
          fullname,
        }
      )
      .then((resp) => {
        updateStatus(<Alert severity="success">Contact Detail Created!</Alert>);
      })
      .catch((error) => {
        updateStatus(<Alert severity="error">{error.response.data}</Alert>);
      });
  };
  //   const handleCreateContact = async (e) => {
  //     e.preventDefault();
  //     await axios
  //       .post(`http://localhost:8800/api/v1/createContact/${username.username}`, {
  //         fname,
  //         lname,
  //       })
  //       .then((resp) => {
  //         updateStatus("Contact Created");
  //       })
  //       .catch((error) => {
  //         updateStatus(error.response.data);
  //       });
  //   };
  if (!isLoggedIn) {
    return (
      <>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            flexDirection: "column",
          }}
        >
          <p style={{ color: "red", fontSize: "20px" }}>
            User not logged in please login by clicking below
          </p>

          <button
            onClick={() => navigation("/")}
            class="btn btn-secondary button"
          >
            login
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <NavBar username={currentUser.username} />
      <div
        style={{
          height: "100vh",
          width: "100vw",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div id="admindashboardform">
          <form id="formadmin" onSubmit={handleCreateContactDetail}>
            <label class="fw-bold">Type:</label>
            <input
              required
              type="text"
              value={type}
              onChange={(e) => updateType(e.target.value)}
            ></input>
            <br />
            <label class="fw-bold">Value:</label>

            <input
              required
              type="text"
              value={value}
              onChange={(e) => updateValue(e.target.value)}
            ></input>
            <br />
            <button class="btn btn-primary">Create Contact Detail</button>
            <br />
            <br />
            {status}
          </form>
        </div>
      </div>
    </>
  );
}
export default CreateContactDetail;
