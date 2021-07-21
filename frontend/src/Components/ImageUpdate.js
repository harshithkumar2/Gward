import React, { useEffect, useState } from "react";
import { Fab, Container, Button, Avatar } from "@material-ui/core";
import Navigation from "./Navigation";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { getUsers, logoutSuccess } from "../features/user/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import alertify from "alertifyjs";
import { useHistory } from "react-router";
var jwt = require("jsonwebtoken");

function ImageUpdate(props) {
  const logged_email = useSelector(getUsers);
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState(logged_email.email);
  const tokens = props.match.params.token;
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    const checkToken = (tokens) => {
      jwt.verify(tokens, "thisisgwardop", function (err, decoded) {
        if (err) {
          dispatch(logoutSuccess());
          alertify.error(err.message);
          history.push("/");
        }
      });
    };
    setInterval(() => {
      checkToken(tokens);
    }, 30000);
  }, [tokens]);

  const handleChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImage = () => {
    if (image !== null) {
      const fd = new FormData();
      fd.append("image", image);
      fd.append("email", email);

      axios
        .post(`/image_update?token=${tokens}`, fd)
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
      alertify.error("Please select image");
    }
  };
  return (
    <div>
      <Navigation />
      <Container>
        <div style={{ textAlign: "center" }}>
          {logged_email.img !== null ? (
            <Avatar
              id="profile_pic"
              alt={logged_email.name}
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              src={process.env.PUBLIC_URL + "/uploads/" + logged_email.img}
            />
          ) : (
            <Avatar
              id="profile_pic"
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              alt={logged_email.name}
            />
          )}

          <br />
          <label htmlFor="upload-photo">
            <input
              style={{ display: "none" }}
              id="upload-photo"
              name="upload-photo"
              type="file"
              onChange={handleChange}
              required
            />
            <Fab
              color="secondary"
              size="small"
              component="span"
              aria-label="add"
              variant="extended"
            >
              <AddIcon /> Upload photo
            </Fab>
          </label>
          <br />
          <br />

          <Button variant="contained" color="primary" onClick={handleImage}>
            Update
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default ImageUpdate;
