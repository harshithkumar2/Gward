import React, { useState } from "react";
import { Container, Fab, Button, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Navigation from "./Navigation";
import axios from "axios";
import { getUsers } from "../features/user/UserSlice";
import { useSelector } from "react-redux";
import alertify from "alertifyjs";

function GarbageImg() {
  const [image, setImage] = useState(null);
  const [weight, setWeight] = useState("");
  const users_details = useSelector(getUsers);
  const handleChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImage = (e) => {
    if (image !== null && weight !== "") {
      const fd = new FormData();
      fd.append("image", image);
      fd.append("weight", weight);
      fd.append("email", users_details.email);
      axios
        .post("/garbage_img", fd)
        .then((response) => {
          if (response.data.success) {
            alertify.success(response.data.success);
          } else {
            alertify.error(response.data.error);
          }
        })
        .catch((err) => console.log(err.response));
      e.preventDefault();
    } else {
      alertify.error("Fields cannot be empty");
    }
  };
  return (
    <div>
      <Navigation />
      <Container>
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          {/* {logged_email.img !== null ? (
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
            <Avatar id="profile_pic" alt={logged_email.name} />
          )} */}

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
              <AddIcon /> Upload Image
            </Fab>
          </label>
          <br />
          <br />
          <TextField
            type="number"
            id="outlined-basicc"
            label="weight in gms"
            value={weight}
            variant="outlined"
            onChange={(e) => setWeight(e.target.value)}
          />
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={handleImage}>
            Upload
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default GarbageImg;
