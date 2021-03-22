import React, { useEffect, useState } from "react";
import { db, firebaseApp } from "../firebase/firebase";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import "./RunsMap.css";
import "../Styles/app.scss";
import Player from "./Player/Player";
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import { useHistory } from "react-router-dom";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import { retrieveRuns } from "../Functions/RetrieveRuns";
import { deleteRun } from "../Functions/MainApiCalls";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
const M = ReactMapboxGl({
  //TODO: Hide api keys
  accessToken: process.env.REACT_APP_MAPBOX_KEY,
});

const DeleteRun = (props) => {
  const [runIdList, setRunIdList] = useState();

  const [run, setRun] = useState();

  const setStates = (vals) => {
    setRunIdList(vals[0]);
    let runData = vals[1][vals[1].length - 1];
    console.log(runData);
    setRun(runData);
  };

  const start = async () => {
    if (props.userData == null) {
      await props.fetchData(firebaseApp.auth().currentUser.uid);

      return;
    }

    await retrieveRuns(props, setStates);
  };
  useEffect(() => {
    start();
  }, [props.userData]);

  if (run == undefined) {
    return <h1>Map</h1>;
  }

  const attemptDelete = async (id) => {
    props.setLoading(true);
    await deleteRun(id, firebaseApp.auth().currentUser.uid, props.toast);
    await start();
    props.setLoading(false);
  };
  return (
    <div>
      {runIdList.map((run) => (
        <p
          onClick={() => {
            confirmAlert({
              title: "Confirm to submit",
              message: "Are you sure to do this.",
              buttons: [
                {
                  label: "Yes",
                  onClick: () => attemptDelete(run),
                },
                {
                  label: "No",
                },
              ],
            });
          }}
          style={{ background: "#282828", cursor: "pointer" }}
        >
          {run.split("T")[0]}
          <br />
          {run.split("T")[1].split(".")[0]}
        </p>
      ))}
    </div>
  );
};

export default DeleteRun;
