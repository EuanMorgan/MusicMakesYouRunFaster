import React, { useEffect, useState } from "react";
import { db, firebaseApp } from "../../firebase/firebase";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import "./RunsMap.css";
import "../../Styles/app.scss";
import Player from "../Player/Player";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { useHistory } from "react-router-dom";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import { retrieveRuns } from "../../Functions/RetrieveRuns";
import { RunStats } from "./RunStats";
import { Overall } from "./Overall";

const M = ReactMapboxGl({
  //TODO: Hide api keys
  accessToken: process.env.REACT_APP_MAPBOX_KEY,
});

const Results = (props) => {
  const history = useHistory();
  const [runIdList, setRunIdList] = useState();
  const [runList, setRunList] = useState();
  const [run, setRun] = useState();
  let spotifyToken;
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

    await retrieveRuns(props, setStates, history);
  }, [props.userData]);

  const selectRunFromMenu = (id) => {
    setRun(runList[id]);
  };

  if (run == undefined) {
    return <h1>Map</h1>;
  }
  return (
    <div>
      <BurgerMenu items={runIdList} menuClicked={selectRunFromMenu} />
      {run &&
      run.run_map &&
      run.songs &&
      run.fastest_points &&
      run.highest_heart_points &&
      run.avg_pace &&
      run.avg_bpm ? (
        <div>
          <RunStats run={run} />
          {/* <Overall run={run} /> */}
        </div>
      ) : (
        <h1>Please select a different run</h1>
      )}
    </div>
  );
};

export default Results;
