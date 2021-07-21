import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { getUsers } from "../features/user/UserSlice";
import { useSelector } from "react-redux";
import { Container } from "@material-ui/core";
import alertify from "alertifyjs";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function History(props) {
  //   const dispatch = useDispatch();
  const classes = useStyles();
  //   const history = useHistory();
  const [details, setDetails] = useState([]);
  var id = 1;
  const users = useSelector(getUsers);
  //   const tokens = props.match.params.token;
  //   useEffect(() => {
  //     const checkToken = (tokens) => {
  //       jwt.verify(tokens, "thisisgwardop", function (err, decoded) {
  //         if (err) {
  //           dispatch(logoutSuccess());
  //           alertify.error(err.message);
  //           history.push("/");
  //         }
  //       });
  //     };
  //     checkToken(tokens);
  //   }, [tokens]);
  useEffect(() => {
    axios
      .get("/History", { params: { email: users.email } })
      .then((response) => {
        if (response.data.data) {
          alertify.success("Data fetched successfully");
          setDetails(response.data.data);
        } else {
          alertify.error(response.data.error);
        }
      })
      .catch((err) => {
        alertify.error(err.response.status);
      });
  }, []);
  return (
    <Container>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Images</TableCell>
              <TableCell align="right">Weight(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((row) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {id++}
                </TableCell>
                <TableCell align="right">
                  <img
                    style={{ maxWidth: "40px", borderRadius: "50%" }}
                    src={
                      process.env.PUBLIC_URL + "/uploads_garbage/" + row.images
                    }
                    alt={row.images}
                  />
                </TableCell>
                <TableCell align="right">{row.weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
