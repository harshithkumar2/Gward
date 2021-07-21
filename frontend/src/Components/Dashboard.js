import React, { useEffect } from "react";
import GarbageImg from "./GarbageImg";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logoutSuccess } from "../features/user/UserSlice";
import alertify from "alertifyjs";
var jwt = require("jsonwebtoken");

function Dashboard(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const tokens = props.match.params.token;
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

  return (
    <div style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}>
      <GarbageImg />
    </div>
  );
}

export default Dashboard;
