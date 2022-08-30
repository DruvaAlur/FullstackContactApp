import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import NavBar from "../userDashboard/navigationBar/NavBar";
function GetContactDetail() {
  const [isLoggedIn, updateIsLoggedIn] = useState("");
  const [contact, updateContact] = useState();
  const currentUser = useParams();
  const location = useLocation();
  const navigation = new useNavigate();
  let u = location.state;

  console.log(u);
  if (u != null) {
    u = location.state.fullname;
    window.sessionStorage.setItem("u", u);
  }
  u = window.sessionStorage.getItem("u");
  // u = JSON.parse(u);
  // console.log(u[0]);
  const fullname = u;
  useEffect(() => {
    console.log(currentUser.username);
    axios
      .post(
        `http://localhost:8800/api/v1/isUserLoggedIn/${currentUser.username}`
      )
      .then((resp) => {
        updateIsLoggedIn(true);
        // fullname = u;
        getContact();
      })
      .catch((error) => {
        updateIsLoggedIn(false);
        console.log(error);
      });
  }, []);
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
  const handleDeleteContactDetail = async (e) => {
    e.preventDefault();
    const type = e.target.id;
    await axios
      .post(
        `http://localhost:8800/api/v1/deleteContactDetail/${currentUser.username}`,
        {
          fullname,
          type,
        }
      )
      .then((resp) => {
        console.log(resp.data);
        // updateContact();
        getContact();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
  async function getContact() {
    await axios
      .post(
        `http://localhost:8800/api/v1/getContactDetail/${currentUser.username}`,
        {
          fullname,
        }
      )
      .then((resp) => {
        updateContact(resp.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }
  console.log(u);
  // useEffect(() => {
  //   console.log("in getcontsact");
  //   getContact();
  // }, []);
  console.log(currentUser.username);

  // console.log(contact);

  let rowOfContactDetail;
  if (contact != null) {
    // console.log(contact.contactDetails);
    rowOfContactDetail = Object.values(contact).map((c) => {
      return (
        <>
          <tr>
            <td>{c.type}</td>
            <td>{c.value}</td>
            <td>
              <button
                class="btn btn-primary"
                onClick={() => {
                  navigation(
                    `/userDashboard/updateContactDetail/${currentUser.username}`,
                    { state: { fullname: fullname, type: c.type } }
                  );
                }}
              >
                Update Contact Detail
              </button>
            </td>
            <td>
              <button
                class="btn btn-primary"
                onClick={handleDeleteContactDetail}
                id={c.type}
              >
                Delete
              </button>
            </td>
          </tr>
        </>
      );
    });
  }
  return (
    <>
      <NavBar username={currentUser.username} />
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">type</th>
            <th scope="col">value</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>{rowOfContactDetail}</tbody>
      </table>
    </>
  );
}
export default GetContactDetail;
