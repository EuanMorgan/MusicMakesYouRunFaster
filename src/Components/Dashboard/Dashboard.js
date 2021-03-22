import React, { useState, useEffect } from "react";
import Welcome from "../ReusableComponents/Welcome";
import {
  pullRuns,
  pullSongs,
  parseSongsAndRun,
} from "../../Functions/MainApiCalls";
// import { run, songs } from "../../TestData";
import { useHistory } from "react-router-dom";
const Dashboard = (props) => {
  const history = useHistory();
  if (props.currentUser == null) {
    return <h1>Hi There! Please sign in</h1>;
  }
  if (props.userData == null) {
    props.fetchData(props.currentUser.uid);
    return <h1>fetching...</h1>;
  }

  if (props.userData.spotifyRefreshToken == "") {
    history.push("/continue-setup");
  }

  const fetchRecentRun = async () => {
    props.setLoading(true);
    //incase the refresh token has changed...
    await props.fetchData(props.currentUser.uid);
    let map = await pullRuns(props.userData.fitbitRefreshToken);
    console.log(map);

    let songs = await pullSongs(props.userData.spotifyRefreshToken);
    console.log(songs);
    try {
      let x = await parseSongsAndRun(songs, map, props.currentUser.uid);
      if (x === -255) {
        props.toast.info(
          "Most recent run not fetched because we already have it 😎"
        );
      } else {
        props.toast.success("🦄 run fetched successfully!");
      }
    } catch (error) {
      console.log(error);
      props.toast.error("😢 there has been an error");
    }

    props.setLoading(false);
  };
  return (
    <div style={{ alignContent: "center", alignItems: "center" }}>
      <Welcome currentData={props.userData} />
      <div className="dashboard-text">
        {" "}
        <p
          style={{
            fontSize: "1rem",
          }}
        >
          NOTE: Due to an idiosyncrasy with the Spotify API, your songs will
          only show up if you 'complete' the song. i.e. you listen to the last
          second and the song ends. If you want to skip a song half-way through,
          please scrub to the last few seconds instead of clicking 'skip'
          otherwise this app won't be able to see it in your history. Hopefully
          Spotify will fix this soon 🤞
        </p>
      </div>

      <button onClick={fetchRecentRun}>Pull most recent run</button>
      <button
        onClick={() => {
          history.push("/runs");
        }}
      >
        Replay runs
      </button>
      <button
        onClick={() => {
          history.push("/results");
        }}
      >
        View results
      </button>
      <button
        onClick={() => {
          history.push("/delete");
        }}
      >
        Delete runs
      </button>
      {/* <button
        onClick={async () => {
          let x = await pullSongs(props.userData.spotifyRefreshToken);
          console.log(x);
        }}
      >
        test pull
      </button> */}
      {/* <button
        onClick={async () => {
          console.log(
            await parseSongsAndRun(songs, run.run_map, "7LZHNM", true)
          );
        }}
      >
        TEST
      </button> */}
    </div>
  );
};

export default Dashboard;
