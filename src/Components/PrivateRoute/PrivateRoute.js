import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth";
export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
  console.log(rest);
  return (
    <Route
      render={(props) => {
        return currentUser ? <Component {...rest} /> : <Redirect to="/" />;
      }}
    ></Route>
  );
}
