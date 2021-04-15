import React, { useEffect, useState } from "react";

import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import "./RunsMap.css";
import "../../Styles/app.scss";
import Player from "../Player/Player";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { useHistory, Link } from "react-router-dom";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import { retrieveRuns } from "../../Functions/RetrieveRuns";
import { RunStats } from "./RunStats";
import { Overall } from "./Overall";
import { useAuth } from "../../Contexts/Auth";

const Results = (props) => {
  const { userData, fetchUserData, currentUser } = useAuth();
  const history = useHistory();
  const [runIdList, setRunIdList] = useState();
  const [runList, setRunList] = useState();
  const [run, setRun] = useState();
  let spotifyToken;
  const setStates = (vals) => {
    setRunIdList(vals[0]);
    setRunList(vals[1]);
    spotifyToken = vals[2];
    let runData = vals[1][0];
    //console.log(runData);
    setRun(runData);
  };

  useEffect(async () => {
    if (userData == null) {
      await fetchUserData(currentUser.uid);

      return;
    }

    await retrieveRuns(props, userData, setStates, history);
  }, [userData]);
  useEffect(() => {}, []);
  const selectRunFromMenu = (id) => {
    setRun(runList[id]);
  };

  if (run == undefined) {
    return <h1>Loading</h1>;
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
          <h1>Individual Run Stats</h1>
          <p>
            Looking for overall stats?{" "}
            <Link to="/overall-results">Click here</Link>
          </p>
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
