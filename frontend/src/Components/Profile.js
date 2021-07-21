import React, { useState, useEffect } from "react";
import { Container, Grid, TextField, Button } from "@material-ui/core";
import Navigation from "./Navigation";
import { getUsers, logoutSuccess } from "../features/user/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import "./Profile.css";
import alertify from "alertifyjs";
import { useHistory } from "react-router-dom";
import axios from "axios";
var jwt = require("jsonwebtoken");

function Profile(props) {
  const users = useSelector(getUsers);

  const token = props.match.params.token;
  const [name, setName] = useState(users.name);
  const [email, setEmail] = useState(users.email);
  const points = users.points;

  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    const checkToken = (token) => {
      jwt.verify(token, "thisisgwardop", function (err, decoded) {
        if (err) {
          dispatch(logoutSuccess());
          alertify.error(err.message);
          history.push("/");
        }
      });
    };
    checkToken(token);
  }, [token]);

  const handleUpdate = (e) => {
    if (name !== "") {
      axios
        .put(`/profile_update?token=${token}`, {
          name: name,
          email: email,
        })
        .then((response) => {
          if (response.data.success) {
            alertify.success(response.data.success);
          } else {
            alertify.error(response.data.error);
          }
        })
        .catch((err) => {
          alertify.error(err.response.status);
        });
    } else {
      alertify.error("Name cannot be empty");
    }
    e.preventDefault();
  };

  return (
    <div>
      <Navigation />
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <div>
            <h3 style={{ textAlign: "center" }}>UPDATE</h3>
            <form onSubmit={handleUpdate}>
              <br />
              <TextField
                id="outlined-basic"
                label="Email"
                value={email}
                variant="outlined"
                disabled
              />

              <br />
              <br />

              <TextField
                id="outlined-basicc"
                label="Name"
                value={name}
                variant="outlined"
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <br />
              <TextField
                helperText="Will be updated shortly"
                id="outlined-basicc"
                label="Points"
                value={points}
                variant="outlined"
                disabled
              />

              <br />
              <br />
              <Button variant="contained" color="primary" type="submit">
                Update
              </Button>
            </form>
          </div>
        </Grid>
      </Container>
    </div>
  );
}

export default Profile;
