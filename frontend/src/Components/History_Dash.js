import React, { useEffect } from "react";
import Navigation from "./Navigation";
import History from "./History";
import alertify from "alertifyjs";
import { logoutSuccess } from "../features/user/UserSlice";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
var jwt = require("jsonwebtoken");

function History_Dash(props) {
  const tokens = props.match.params.token;
  const history = useHistory();
  const dispatch = useDispatch();
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
  return (
    <div>
      <Navigation />
      <History />
    </div>
  );
}

export default History_Dash;
