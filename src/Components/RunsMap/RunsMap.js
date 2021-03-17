import React, { useEffect, useState } from "react";
import { db, firebaseApp } from "../../firebase/firebase";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./RunsMap.css";
import "../../Styles/app.scss";
import Player from "../Player/Player";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { useHistory } from "react-router-dom";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";

import { retrieveRuns } from "../../Functions/RetrieveRuns";
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
const M = ReactMapboxGl({
  //TODO: Hide api keys
  accessToken: process.env.REACT_APP_MAPBOX_KEY,
});

let replayCounter = 0;
const keys = [
  "C",
  "C#/Db",
  "D",
  "D#/Eb",
  "E",
  "F",
  "F#/Gb",
  "G",
  "G#/Ab",
  "A",
  "A#/Bb",
  "B",
];
const mode = ["Minor", "Major"];
let runInterval;
let spotifyToken;
const RunsMap = (props) => {
  const history = useHistory();
  const [currentlyPlaying, setCurrentlyPlaying] = useState({
    name: "",
    artists: "item.track.artists",
    href: "",
    id: "",
    played_at: "",
    duration: "",
    rough_started_at: "",
    cover_art: "",
    uri: "",
    audio_features: [{ tempo: "", key: "", energy: "" }],
  });
  const [play, setPlay] = useState(true); //used to start/stop the song player

  const [replayToggle, setReplayToggle] = useState(false); //is the run replay active?

  const [key, setKey] = useState(0); //used only to force a rerender
  const [runIdList, setRunIdList] = useState(); //list of the runids to dispaly in hamburger menu
  const [runList, setRunList] = useState(); //list of the runs corresponding to the above ids
  const [run, setRun] = useState(); //the currently selected run
  const [zoom, setZoom] = useState(17.6); //the current zoom level
  const [center, setCenter] = useState(null); //current center of the map
  const [isFollowing, setIsFollowing] = useState(true); //is the map currently following the point?
  const [currentPointData, setCurrentPointData] = useState({
    //the data from the current point on the map during the replay
    heartRate: "--",
    distanceMeters: "--",
    elapsed: "--",
    pace: "--",
    time: "--",
    greenPoint: null,
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  let clicked_point = null; //used to stop onclick on overlapping points

  const updatePointData = () => {
    setCurrentPointData({
      heartRate: run.run_map[replayCounter].heart_rate_bpm,
      distanceMeters: run.run_map[replayCounter].distance_meters.toFixed(2),
      elapsed: run.run_map[replayCounter].elapsed_hhmmss,
      pace: run.run_map[replayCounter].pace
        ? run.run_map[replayCounter].pace
        : null,
      time: run.run_map[replayCounter].time,
      greenPoint: (
        <Feature
          coordinates={[
            run.run_map[replayCounter]["longitude"],
            run.run_map[replayCounter]["latitude"],
          ]}
          properties={{ name: Math.random() }}
          style={{ cursor: "default" }}
        />
      ),
    });
    if (run.run_map[replayCounter].song_playing) {
      if (run.run_map[replayCounter].song_playing.cover_art) {
        stopRun();
        setCurrentlyPlaying(run.run_map[replayCounter].song_playing);
        console.log(run.run_map[replayCounter].song_playing.audio_features);
        replayRun();
      }
    }
    clicked_point = null;
    replayCounter++;
    // console.log(replayCounter, run.length);
    if (replayCounter == run.run_map.length) {
      replayCounter = 0;
      stopRun();
    }
  };

  const replayRun = () => {
    setPlay(true);
    setReplayToggle(true);
    runInterval = setInterval(() => {
      updatePointData();
    }, 1000);
  };

  const stopRun = () => {
    clearInterval(runInterval);
    setReplayToggle(false);
    setKey(Math.random());
    setPlay(false);
  };
  useEffect(() => {
    // reset counter on component mount, stop interval on unmount
    replayCounter = 0;
    return () => {
      console.log("cleaning up...");
      stopRun();
      window.removeEventListener(
        "resize",
        setWindowWidth(window.innerWidth),
        false
      );
    };
  }, []);

  const setStates = (vals) => {
    setRunIdList(vals[0]);
    setRunList(vals[1]);
    spotifyToken = vals[2];
    let runData = vals[1][vals[1].length - 1];
    console.log(runData);
    setRun(runData);
  };

  useEffect(async () => {
    if (props.userData == null) {
      await props.fetchData(firebaseApp.auth().currentUser.uid);

      return;
    }

    window.addEventListener("resize", function () {
      setWindowWidth(window.innerWidth);
    });

    await retrieveRuns(props, setStates);

    replayCounter = 0;
  }, [props.userData]);

  if (run == undefined) {
    return <h1>Map</h1>;
  }
  const selectRunFromMenu = (id) => {
    stopRun();
    replayCounter = 0;
    setRun(runList[id]);
  };

  return (
    <div className="MapArea">
      <BurgerMenu items={runIdList} menuClicked={selectRunFromMenu} />
      <M
        onDragEnd={(z) => {
          setIsFollowing(false);
          setCenter(z.getCenter());
        }}
        onZoomEnd={(z, event) => {
          if (!event.originalEvent) return;
          setZoom(z.getZoom());
          setCenter(z.getCenter());
        }}
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: windowWidth > 1600 ? "50vh" : "38vh",
          width: "100vw",
        }}
        center={
          !isFollowing
            ? center
            : [
                run.run_map[replayCounter]["longitude"],
                run.run_map[replayCounter]["latitude"],
              ]
        }
        zoom={[zoom]}
      >
        {/* using mapbox react version 4.8.6 because most recent just doesnt work */}

        <Layer
          circle="circle"
          type="circle"
          paint={{
            "circle-color": "#ff5200",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
            "circle-stroke-opacity": 1,
          }}
        >
          {run.run_map.map((p) => (
            <Feature
              key={p.seq}
              coordinates={[p["longitude"], p["latitude"]]}
              properties={{ name: Math.random() }}
              style={{ cursor: "default" }}
              onClick={(event) => {
                //return if any other ids have been clicked
                if (!clicked_point) clicked_point = p.seq;

                if (clicked_point != p.seq) return;
                console.log(p.seq);
                let wasReplaying = replayToggle;

                replayCounter = p.seq;
                if (!wasReplaying) updatePointData();
              }}
            />
          ))}
        </Layer>
        <Layer
          circle="circle"
          type="circle"
          paint={{
            "circle-color": "#00ff00",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
            "circle-stroke-opacity": 1,
          }}
        >
          {currentPointData.greenPoint}
        </Layer>
      </M>
      <div className="DataContainer">
        <div className="DataArea">
          <p className="Data">Heart rate: {currentPointData.heartRate}</p>
          <p className="Data">
            Speed (Meter per second): {currentPointData.pace}
          </p>
          <p className="Data">
            Distance (meters): {currentPointData.distanceMeters}
          </p>
          <p className="Data">Elapsed: {currentPointData.elapsed}</p>
          <p className="Data">
            Time:{" "}
            {currentPointData.time == "--"
              ? null
              : currentPointData.time.split("T")[1].split(".")[0]}
          </p>
          <p className="Data">Date: {currentPointData.time.split("T")[0]}</p>
        </div>
        <div className="AlbumArtArea">
          <img
            src={currentlyPlaying.cover_art.url}
            className={replayToggle ? "doRotation" : ""}
          />
        </div>
        <div className="DataArea">
          <p className="Data">Song Name: {currentlyPlaying.name}</p>
          <p className="Data">
            Artist Name: {currentlyPlaying.artists[0].name}
          </p>
          <p className="Data">
            Tempo: {currentlyPlaying.audio_features[0].tempo} BPM
          </p>
          <p className="Data">
            Key: {keys[currentlyPlaying.audio_features[0].key]}
          </p>
          <p className="Data">
            Energy: {currentlyPlaying.audio_features[0].energy}
          </p>
          <p className="Data">
            This song is in a {mode[currentlyPlaying.audio_features[0].mode]}{" "}
            key
          </p>
        </div>
      </div>
      {replayToggle ? (
        <button className="ReplayButton" onClick={stopRun} key={key}>
          Stop replay
        </button>
      ) : (
        <button className="ReplayButton" onClick={replayRun} key={key}>
          Replay run
        </button>
      )}
      <button
        className="ReplayButton"
        onClick={() => {
          stopRun();
          setIsFollowing(true);
          setZoom(17.6);
          replayRun();
        }}
      >
        Center Map
      </button>
      {currentlyPlaying.uri != "" ? (
        <div
          style={{
            bottom: 0,
            position: "fixed",
            width: "100%",
            marginTop: "2rem",
          }}
        >
          <Player
            uri={[currentlyPlaying.uri]}
            token={spotifyToken}
            play={play}
          />
        </div>
      ) : null}
    </div>
  );
};

export default RunsMap;
