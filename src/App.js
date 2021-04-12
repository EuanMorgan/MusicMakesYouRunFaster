import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./Components/Home/Home";
import Faq from "./Components/Faq/Faq";
import Nav from "./Components/Nav/Nav";
import Dashboard from "./Components/Dashboard/Dashboard";
import ContinueSetup from "./Components/ContinueSetup/ContinueSetup";
import React, { useState } from "react";
import { AuthProvider } from "./Contexts/Auth";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import LoadingSpinner from "./Components/ReusableComponents/LoadingSpinner";
import RunsMap from "./Components/RunsMap/RunsMap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Results from "./Components/Results/Results";
import DeleteRun from "./Components/DeleteRun";
import MoreInfo from "./Components/MoreInfo/MoreInfo";
import OverallResults from "./Components/OverallResults/OverallResults";
const App = () => {
  const [loading, setLoading] = useState(false); //passed down to other components as props, a boolean which toggles the loading spinner overlay
  const history = useHistory();

  return (
    <AuthProvider>
      <BrowserRouter>
        <LoadingSpinner active={loading} text={"Loading..."}>
          <div className="App">
            <Nav toast={toast} />

            <Switch>
              <Route
                path="/"
                exact
                component={Home}
                toast={toast}
                setLoading={setLoading}
              />
              <Route path="/fitbit">
                <Home fitbitAuth={true} toast={toast} setLoading={setLoading} />
              </Route>
              <PrivateRoute
                path="/continue-setup"
                component={ContinueSetup}
                toast={toast}
              />

              <Route path="/faq" component={Faq} />
              <PrivateRoute
                path="/dashboard"
                component={Dashboard}
                setLoading={setLoading}
                toast={toast}
              />
              <PrivateRoute
                path="/runs"
                component={RunsMap}
                setLoading={setLoading}
                toast={toast}
              />
              <PrivateRoute
                path="/results"
                component={Results}
                setLoading={setLoading}
                toast={toast}
              />
              <PrivateRoute
                path="/delete"
                component={DeleteRun}
                setLoading={setLoading}
                toast={toast}
              />
              <Route path="/more-info" component={MoreInfo} />
              <PrivateRoute
                path="/overall-results"
                component={OverallResults}
                setLoading={setLoading}
                toast={toast}
              />
            </Switch>
            <ToastContainer />
          </div>
        </LoadingSpinner>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
