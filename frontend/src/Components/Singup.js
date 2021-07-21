import { Container } from "@material-ui/core";
import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { InputLabel } from "@material-ui/core";
import { OutlinedInput } from "@material-ui/core";
import { InputAdornment } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { FormControl } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Navigation from "./Navigation";
import { useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { setLoginDetails, getUsers } from "../features/user/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import alertify from "alertifyjs";
var jwt = require("jsonwebtoken");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },

  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "29ch",
  },
}));

function Singup() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    showPassword: false,
  });
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClickShowPassword = () => {
    setValues({ showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const user_data = useSelector(getUsers);
  const responseGoogle = (respons) => {
    axios
      .post("/GoogleData", respons.profileObj)
      .then((response) => {
        if (response.data.token) {
          jwt.verify(
            response.data.token,
            "thisisgwardop",
            function (err, decoded) {
              if (err) {
                alertify.error(err.message);
              } else {
                dispatch(
                  setLoginDetails({
                    user: decoded,
                    token: response.data.token,
                  })
                );
                alertify.success(`Hello ${decoded.name}!`);
                history.push(`/Dashboard/${response.data.token}`);
              }
            }
          );
        } else {
          alertify.error("Invalid Credentials!");
        }
      })
      .catch((err) => console.log(err.response.status));
  };
  const handleSubmit = (e) => {
    if (email !== "" && password !== "" && name !== "") {
      axios
        .post("login_data", {
          email: email,
          password: password,
          name: name,
        })
        .then((response) => {
          if (response.data.success) {
            alertify.success("Signup Successful!");
            history.push("/login");
          } else {
            alertify.error(response.data.error);
          }
        })
        .catch((err) => {
          alertify.error(err.response);
        });
    } else {
      alertify.error("Fields cannot be empty!");
    }
    e.preventDefault();
  };
  useEffect(() => {
    user_data === null ? history.push("/signup") : history.push("/");
  }, []);
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
            <h3 style={{ textAlign: "center" }}>SIGNUP</h3>
            <form onSubmit={handleSubmit}>
              <br />
              <TextField
                id="outlined-basic"
                label="Email"
                value={email}
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
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
              <FormControl className={clsx(classes.textField)}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  labelWidth={60}
                />
              </FormControl>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Signup
              </Button>
            </form>
            <br />
            <br />
            <p style={{ textAlign: "center" }}>OR</p>
            <br />

            <div style={{ textAlign: "center" }}>
              <GoogleLogin
                clientId="926928480075-0afqj43ihqv0rd5qsabtmf9s5ishs03p.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          </div>
        </Grid>
      </Container>
    </div>
  );
}

export default Singup;
