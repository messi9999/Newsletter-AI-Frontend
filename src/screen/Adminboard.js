import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import axios from "axios";
import { useEffect } from "react";
import { ReactComponent as EditIcon } from "../img/edit-button-svgrepo-com.svg";
import { ReactComponent as DeleteIcon } from "../img/icons8-delete.svg";

const BASE_URL = process.env.REACT_APP_BASEURL;

export default function Adminboard() {
  const [show, setShow] = useState(false);
  const [userID, setUserID] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [expiredate, setExpiredate] = useState();
  const [role, setRole] = useState();

  const handleClose = () => setShow(false);

  const [users, setUsers] = useState([]);

  const handleEdit = (
    userId,
    userName,
    userEmail,
    userExpireDate,
    userRole
  ) => {
    // Logic to handle the edit action for the user with the specified ID
    setUserID(userId);
    setUsername(userName);
    setEmail(userEmail);
    setExpiredate(userExpireDate);
    setRole(userRole);

    setShow(true);
    console.log(`Editing user with ID: ${userID}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BASE_URL + "/all"); // Replace '/api/users' with your API endpoint
        console.log("~~~~~~~~~~~~~~~~~~~~~~", response.data);
        setUsers(response.data); // Assuming the response contains an array of users
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (userId) => {
    // Logic to handle the delete action for the user with the specified ID
    const res = await axios.delete(BASE_URL + `/delete/${userId}`);
    console.log(`Deleting user with ID: ${userId}`);
    window.location.reload();
  };

  const handleSaveChanges = async () => {
    const body = {
      username: username,
      email: email,
      roles: [role],
      expiredate: expiredate
    };
    const res = await axios.put(BASE_URL + `/update/${userID}`, body);
    setShow(false);
    window.location.reload();
  };

  const { user: currentUser } = useSelector((state) => state.auth);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (!currentUser.roles[0]) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="home-main bg-black mb-0 bg-gradient py-3">
      <div style={{ height: "18vh" }}>
        <Header />
        <div style={{ marginTop: "20vh" }}>
          <h2>User Administration</h2>
          <div>
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>ExpireDate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.expiredate}</td>
                    <td className="d-flex flex-column justify-content-center, align-content-center">
                      <div
                        onClick={() =>
                          handleEdit(
                            user.id,
                            user.username,
                            user.email,
                            expiredate
                          )
                        }
                      >
                        <EditIcon style={{ width: "25px", height: "auto" }} />
                      </div>
                      <div onClick={() => handleDelete(user.id)}>
                        <DeleteIcon style={{ width: "25px", height: "auto" }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {/* <UserAdminTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          /> */}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{userID}</Form.Label>
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>ExpireDate</Form.Label>
              <Form.Control
                type="date"
                value={expiredate}
                onChange={(e) => setExpiredate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
