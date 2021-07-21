import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import store from "./app/store";

import "alertifyjs/build/css/alertify.css";
import "alertifyjs/build/css/themes/default.min.css";
import "./Components/Loader.css";

const App = React.lazy(() => import("./App"));
const Home = React.lazy(() => import("./Components/Home"));
const Login = React.lazy(() => import("./Components/Login"));
const Signup = React.lazy(() => import("./Components/Singup"));
const Dashboard = React.lazy(() => import("./Components/Dashboard"));
const Profile = React.lazy(() => import("./Components/Profile"));
const ImageUpdate = React.lazy(() => import("./Components/ImageUpdate"));
const ChangePassword = React.lazy(() => import("./Components/ChangePassword"));
const History_Dash = React.lazy(() => import("./Components/History_Dash"));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense
        fallback={
          <div className="container">
            <div className="spinner">
              <div className="inner one"></div>
              <div className="inner two"></div>
              <div className="inner three"></div>
            </div>
          </div>
        }
      >
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={App} />
            <Route path="/dash" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/Dashboard/:token" component={Dashboard} />
            <Route path="/Profile/:token" component={Profile} />
            <Route path="/Image/:token" component={ImageUpdate} />
            <Route path="/ChangePassword/:token" component={ChangePassword} />
            <Route path="/History/:token" component={History_Dash} />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
