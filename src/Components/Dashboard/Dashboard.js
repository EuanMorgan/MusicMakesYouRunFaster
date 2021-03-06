import React, { useState, useEffect } from "react";
import Welcome from "../ReusableComponents/Welcome";
import {
  pullRuns,
  pullSongs,
  parseSongsAndRun,
  DeleteAccount,
  updateData,
} from "../../Functions/MainApiCalls";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { run, songs } from "../../AllTestData";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth";
import { firebaseApp } from "../../firebase/firebase";
import { Collapser } from "../ReusableComponents/Collapser";
const Dashboard = (props) => {
  ////console.log(props);

  const history = useHistory();
  const { currentUser, fetchUserData, userData } = useAuth();
  ////console.log(currentUser, userData);

  if (userData == null) {
    fetchUserData(currentUser.uid);
    return <h1>fetching...</h1>;
  }

  if (userData.spotifyRefreshToken == "") {
    history.push("/continue-setup");
  }

  const fetchRecentRun = async () => {
    props.setLoading(true);
    //incase the refresh token has changed...
    await fetchUserData(currentUser.uid);
    let map = await pullRuns(userData.fitbitRefreshToken);
    if (map === -1) {
      props.toast.error(
        "Unfortunately, we were unable to find a recent run 😭"
      );
      props.setLoading(false);
      return;
    } else if (map === "oops") {
      props.toast.error(
        "There has been an error communicating with FitBit (the sods), please refresh the page and try again 👍"
      );
      props.setLoading(false);
      return;
    }
    ////console.log(map);

    let songs = await pullSongs(userData.spotifyRefreshToken);
    ////console.log(songs);
    try {
      let x = await parseSongsAndRun(songs, map, currentUser.uid);
      console.log(x);
      if (x === -255) {
        props.toast.info(
          "Most recent run not fetched because we already have it 😎"
        );
      } else if (x === -500) {
        props.toast.error("No songs found for most recent run 😭😭😭");
      } else if (x === -1000) {
        props.toast.error(
          "Error writing additional data, please delete run and try again"
        );
      } else if (x === -21) {
        props.toast.error(
          "Error finding songs, you may have overwritten them in your play history of 50 songs 😢"
        );
      } else {
        props.toast.success("🦄 run fetched successfully!");
      }
      ////console.log(x);
    } catch (error) {
      ////console.log(error);
      props.toast.error("😢 there has been an error");
    }

    props.setLoading(false);
  };
  return (
    <div style={{ alignContent: "center", alignItems: "center" }}>
      <Welcome currentData={userData} />
      <div
        className="dashboard-text"
        style={{ marginBottom: "-1%", marginTop: "-1%" }}
      >
        <Collapser>
          <p className="tiny-text">
            NOTE: Due to an idiosyncrasy with the Spotify API, your songs will
            only show up if you 'complete' the song. i.e. you listen to the last
            second and the song ends. If you want to skip a song half-way
            through, please scrub to the last few seconds instead of clicking
            'skip' otherwise this app won't be able to see it in your history.
            Hopefully Spotify will fix this soon 🤞
          </p>
        </Collapser>
      </div>
      <div className="dashbord-buttons">
        <div className="btn-row">
          <button
            id="fetch-run"
            onClick={fetchRecentRun}
            className="btn btn-success"
          >
            Pull most recent run
          </button>
        </div>

        <div className="btn-row">
          <button
            className="btn btn-primary"
            onClick={() => {
              history.push("/runs");
            }}
          >
            Replay runs
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              history.push("/results");
            }}
          >
            View results
          </button>
        </div>
        <div className="btn-row">
          <button
            className="btn btn-danger"
            onClick={() => {
              history.push("/delete");
            }}
          >
            Delete runs
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              confirmAlert({
                title: "Confirm to submit",
                message:
                  "Are you sure to do this? Your account and all your data will be deleted, this cannot be undone. NOTE: After deletion you will be redirected to Spotify, you will need to click 'revoke access' on Music Makes You Run Faster here because Spotify provides no way for us to do this for you. We will revoke Fitbit access for you automatically.",
                buttons: [
                  {
                    label: "Confirm Deletion",
                    onClick: () =>
                      DeleteAccount(
                        firebaseApp.auth().currentUser.uid,
                        props.toast,
                        userData.fitbitRefreshToken,
                        false
                      ),
                  },
                  {
                    label: "Cancel",
                  },
                ],
              });
            }}
          >
            Delete account
          </button>
        </div>
      </div>

      {/* <button
        onClick={async () => {
          let x = await pullSongs(props.userData.spotifyRefreshToken);
          ////console.log(x);
        }}
      >
        test pull
      </button> */}
      {/* <button
        onClick={async () => {
          // console.log(
          // await parseSongsAndRun(songs, run.run_map, "7LZHNM", true)
          // );

          // await updateData();
        }}
      >
        TEST
      </button> */}
    </div>
  );
};

export default Dashboard;
