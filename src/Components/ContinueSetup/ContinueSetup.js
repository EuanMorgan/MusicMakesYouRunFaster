import React, { useEffect, useState } from "react";
import Welcome from "../ReusableComponents/Welcome";
import "./continueSetup.css";
import { getCodeFromURL, isProduction } from "../../Common/CommonFunctions";
import { firebaseApp, db } from "../../firebase/firebase";
import { useHistory } from "react-router-dom";
const ContinueSetup = (props) => {
  const history = useHistory();

  console.log(props.currentUser);

  const fetchUserData = async () => {
    console.log("Trying it", props.currentUser);
    if (!props.currentUser) return;
    console.log("Attempting to retrieve user data...");
    console.log(props);
    props.fetchData(props.currentUser.uid);
  };
  useEffect(async () => {
    let code = getCodeFromURL();
    if (code != null) {
      await getSpotifyAccessToken(code);
    }
  }, []);

  if (props.userData) {
    //may need changed
    if (props.userData.spotifyRefreshToken != "") {
      history.push("/dashboard");
    }
  }

  const getSpotifyAccessToken = async (code) => {
    console.log("sending code to backend", code);
    let uri = isProduction()
      ? "https://europe-west2-musicmakesyourunfaster.cloudfunctions.net/app/api/spotify/user-auth"
      : "http://localhost:5000/musicmakesyourunfaster/europe-west2/app/api/spotify/user-auth";
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code, userId: props.currentUser.uid }),
    });
    try {
      let x = await response.json();
      console.log(x);
      if (x.error) {
        props.toast.error(
          `Server returned error message: ${x.error_description}`
        );
        return;
      }
    } catch (error) {}

    props.toast.success("Spotify linked successfully! 🥳🎉");

    props.fetchData(props.currentUser.uid);
  };
  if (props.currentUser == null) {
    return <h1>Hi There! Please sign in</h1>;
  }
  if (props.userData == null) {
    fetchUserData();
    return <h1>Fetching user data...</h1>;
  }
  return (
    <div className={"ContinueSetup"}>
      <Welcome currentData={props.userData} />
      <p>
        In order to continue, please click the button to connect your music
        streaming service account.
      </p>
      <button
        // production http://musicmakesyourunfaster.firebaseapp.com/continue-setup
        // debug http://localhost:3000/continue-setup
        onClick={() => {
          let uri = isProduction()
            ? "https://accounts.spotify.com/authorize?client_id=07333755bcb145f691d3bcb5477b47e4&response_type=code&redirect_uri=https://musicmakesyourunfaster.firebaseapp.com/continue-setup&scope=streaming%20user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played"
            : "https://accounts.spotify.com/authorize?client_id=07333755bcb145f691d3bcb5477b47e4&response_type=code&redirect_uri=http://localhost:3000/continue-setup&scope=streaming%20user-read-private%20user-read-email%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played";
          window.open(uri, "_current");
        }}
      >
        Authorise Spotify API
      </button>
    </div>
  );
};

export default ContinueSetup;
