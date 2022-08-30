import "./GetAllContacts.css";
import NavBar from "../userDashboard/navigationBar/NavBar";
import { useParams } from "react-router-dom";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
function GetAllContacts() {
  const username = useParams();
  const navigation = new useNavigate();
  const [isLoggedIn, updateIsLoggedIn] = useState("");
  const [allContacts, updateAllContacts] = useState([]);
  const [allContactsCount, updateAllContactsCount] = useState(0);
  const [pageNumber, updatePageNumber] = useState(1);
  const [limit, updateLimit] = useState(5);
  useEffect(() => {
    axios
      .post(
        `http://localhost:8800/api/v1/isUserLoggedIn/${username.username}`,
        {}
      )
      .then((resp) => {
        updateIsLoggedIn(true);
      })
      .catch((error) => {
        updateIsLoggedIn(false);
      });
    getContacts();
    getAllContactCount();
  }, [pageNumber, limit]);
  const handleUpdateContact = (u) => {
    navigation(`/userDashboard/UpdateContacts/${username.username}`, {
      state: u,
    });
  };
  async function getAllContactCount() {
    axios
      .get(
        `http://localhost:8800/api/v1/getAllContactsCount/${username.username}`
      )
      .then((resp) => {
        updateAllContactsCount(parseInt(resp.data));
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }
  async function getContacts() {
    axios
      .post(`http://localhost:8800/api/v1/getContacts/${username.username}`, {
        limit,
        pageNumber,
      })
      .then((resp) => {
        updateAllContacts(resp.data);
        console.log(resp.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }
  const handleGetContactDetail = (u) => {
    navigation(`/userDashboard/getContactDetail/${username.username}`, {
      state: u,
    });
  };
  const handleCreateContactDetail = (fullname) => {
    navigation(`/userDashboard/createContactDetail/${username.username}`, {
      state: fullname,
    });
  };
  const toogleActiveFlag = (e) => {
    const fullname = e.target.id;
    axios
      .post(`http://localhost:8800/api/v1/toggleContact/${username.username}`, {
        fullname,
      })
      .then((resp) => {
        // updateAllContacts(getContacts());
        getContacts();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let rowOfContact;
  if (allContacts != null) {
    rowOfContact = Object.values(allContacts).map((u) => {
      return (
        <tr id={u.contactId}>
          <td> </td>
          <td style={{ width: "20%" }}>{u.fname}</td>
          <td style={{ width: "20%" }}>{u.lname}</td>
          <td style={{ width: "20%" }}>{u.fullname}</td>
          <td style={{ width: "10%" }}>
            <button
              class="btn btn-primary button"
              onClick={() => {
                handleCreateContactDetail(u.fullname);
              }}
            >
              CreateContactDetail
            </button>
          </td>
          <td style={{ width: "10%" }}>
            <button
              class="btn btn-primary button"
              onClick={() => handleGetContactDetail(u)}
            >
              getContactDetail
            </button>
          </td>

          <td style={{ width: "10%" }}>
            <button
              class="btn btn-primary button"
              onClick={() => handleUpdateContact(u)}
            >
              update
            </button>
          </td>

          <td id={u.contactId} style={{ width: "10%" }}>
            <button
              class="btn btn-primary button"
              id={u.fullname}
              onClick={toogleActiveFlag}
            >
              Delete
            </button>
            {/* <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={u.isActive}
                    onChange={toogleActiveFlag}
                    id={u.fullname}
                  />
                }
              />
            </FormGroup> */}
          </td>
        </tr>
      );
    });
  }

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
      <NavBar username={username.username} />
      <div className="pagination">
        <label class="fw-bold">limit:</label>
        <select
          id="role"
          name="role"
          onChange={(e) => {
            updateLimit(e.target.value);
            updatePageNumber(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>
      <div className="pagination">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(allContactsCount / limit)}
            color="primary"
            onChange={(e, value) => updatePageNumber(value)}
          />
        </Stack>
      </div>
      <div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col"> </th>
              <th scope="col">FirstName</th>
              <th scope="col">LastName</th>
              <th scope="col">FullName</th>
              <th scope="col">Create Contact Details</th>
              <th scope="col">Get Contact Details</th>
              <th scope="col">update Contact</th>
              <th scope="col">IsActive</th>
            </tr>
          </thead>
          <tbody>{rowOfContact}</tbody>
        </table>
      </div>
    </>
  );
}
export default GetAllContacts;
