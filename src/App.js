import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./Components/Home/Home";
import Faq from "./Components/Faq/Faq";
import Nav from "./Components/Nav/Nav";
import Dashboard from "./Components/Dashboard/Dashboard";
import ContinueSetup from "./Components/ContinueSetup/ContinueSetup";
import React, { useState } from "react";
import { AuthProvider } from "./Components/Auth";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import { db, firebaseApp } from "./firebase/firebase";
import LoadingSpinner from "./Components/ReusableComponents/LoadingSpinner";
import RunsMap from "./Components/RunsMap/RunsMap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { mdiProgressUpload } from "@mdi/js";
import Results from "./Components/Results/Results";
const App = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); //passed down to other components as props, a boolean which toggles the loading spinner overlay
  const history = useHistory();
  const fetchData = async () => {
    //Fetch user data from database and store in app state
    let uid = firebaseApp.auth().currentUser.uid;
    const usersRef = db.collection("users").doc(uid);
    const doc = await usersRef.get();
    if (!doc.exists) {
      toast.error("User data error: user not found");
      firebaseApp.auth().signOut();
      history.push("/");
    } else {
      console.log("Doc data: ", doc.data());
      let data = doc.data();

      try {
        setUserData({
          ...userData,

          name: data.fitbit.user_name,
          profilePicUrl: data.fitbit.profile_pic_url,
          fitbitId: uid,
          fitbitRefreshToken: data.fitbit.refresh_token,
          spotifyRefreshToken: data.spotify ? data.spotify.refresh_token : "",
        });
      } catch (error) {
        toast.error(
          "There has been an error with your user data, signing you out..."
        );
        firebaseApp.auth().signOut();
      }
    }
  };

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
                fetchData={fetchData}
                userData={userData}
                setLoading={setLoading}
              />
              <Route path="/fitbit">
                <Home
                  fitbitAuth={true}
                  toast={toast}
                  fetchData={fetchData}
                  userData={userData}
                  setLoading={setLoading}
                />
              </Route>
              <PrivateRoute
                path="/continue-setup"
                component={ContinueSetup}
                userData={userData}
                fetchData={fetchData}
                toast={toast}
              />

              <Route path="/faq" component={Faq} />
              <PrivateRoute
                path="/dashboard"
                component={Dashboard}
                userData={userData}
                fetchData={fetchData}
                setLoading={setLoading}
                toast={toast}
              />
              <PrivateRoute
                path="/runs"
                component={RunsMap}
                userData={userData}
                fetchData={fetchData}
                setLoading={setLoading}
                toast={toast}
              />
              <PrivateRoute
                path="/results"
                component={Results}
                userData={userData}
                fetchData={fetchData}
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
