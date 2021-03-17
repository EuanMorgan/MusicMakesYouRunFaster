import React, { useContext, useEffect, useState } from "react";

import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../Auth";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  //Redirect user if not authorised
  return currentUser ? (
    <Route
      // !!!TODO: Route
      route="/continue-setup"
      render={() => <RouteComponent currentUser={currentUser} {...rest} />}
    />
  ) : (
    <Redirect to="/" />
  );
};

export default PrivateRoute;
