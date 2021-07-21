import React, { useState, useEffect } from "react";
import {
  OutlinedInput,
  InputLabel,
  FormControl,
  Grid,
  Container,
  InputAdornment,
  IconButton,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Navigation from "./Navigation";
import clsx from "clsx";
import axios from "axios";
import { getUsers, logoutSuccess } from "../features/user/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import alertify from "alertifyjs";
import { useHistory } from "react-router-dom";
var jwt = require("jsonwebtoken");
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },

  withoutLabel: {},
  textField: {
    width: "29ch",
  },
}));
function ChangePassword(props) {
  const classes = useStyles();
  const [reEnterpassword, setReEnterPassword] = useState("");
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [values, setValues] = React.useState({
    showPassword: false,
    showPassword1: false,
    showPassword2: false,
  });
  const email = useSelector(getUsers);
  const dispatch = useDispatch();
  const tokens = props.match.params.token;
  const history = useHistory();
  const handleClickShowPassword = () => {
    setValues({ showPassword: !values.showPassword });
  };
  const handleClickShowPassword1 = () => {
    setValues({ showPassword1: !values.showPassword1 });
  };
  const handleClickShowPassword2 = () => {
    setValues({ showPassword2: !values.showPassword2 });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
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
    checkToken(tokens);
  }, [tokens]);

  const handleChange = (e) => {
    if (oldpassword !== "" && newpassword !== "" && reEnterpassword !== "") {
      if (newpassword !== reEnterpassword) {
        alertify.error("Passwords mismatch");
      } else {
        axios
          .put(`/changepassword?token=${tokens}`, {
            email: email.email,
            oldpassword: oldpassword,
            newpassword: newpassword,
            reEnterpassword: reEnterpassword,
          })
          .then((response) => {
            if (response.data.success) {
              dispatch(logoutSuccess());
              alertify.success(response.data.success);
              history.push("/login");
            } else {
              alertify.error(response.data.error);
            }
          })
          .catch((err) => {
            alertify.error(err.response.status);
          });
      }
    } else {
      alertify.error("Fields cannot be empty");
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
            <h3 style={{ textAlign: "center" }}>CHANGE PASSWORD</h3>
            <form onSubmit={handleChange}>
              <br />
              <FormControl className={clsx(classes.textField)}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Current Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  value={oldpassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  type={values.showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
              <br />
              <br />
              <FormControl className={clsx(classes.textField)}>
                <InputLabel htmlFor="outlined-adornment-password">
                  New Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password1"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={values.showPassword1 ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword1}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
              <br />
              <br />
              <FormControl className={clsx(classes.textField)}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Re-Enter Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password2"
                  value={reEnterpassword}
                  onChange={(e) => setReEnterPassword(e.target.value)}
                  type={values.showPassword2 ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
              <br />
              <br />
              <Button variant="contained" color="primary" type="submit">
                Change
              </Button>
            </form>
          </div>
        </Grid>
      </Container>
    </div>
  );
}

export default ChangePassword;
