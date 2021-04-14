import React, { useEffect, useState } from "react";
import "../../Styles/app.scss";
import { retrieveRuns } from "../../Functions/RetrieveRuns";
import { useAuth } from "../../Contexts/Auth";
import { useHistory, Link } from "react-router-dom";
import { msToHMS, average, sortDescending } from "../../Common/CommonFunctions";
import OverallStats from "../Results/Components/OverallStats";
import AllSongs from "../Results/Components/AllSongs";

const OverallResults = (props) => {
  const { userData, fetchUserData, currentUser } = useAuth();
  const [runIdList, setRunIdList] = useState();
  const [runList, setRunList] = useState();
  const [combinedData, setCombinedData] = useState();
  let spotifyToken;
  const history = useHistory();

  const basicAggregateDataFormat = (data) => {
    let totalDistance = 0;
    let totalTime = 0;
    let allHeartRates = [];
    let allSpeeds = [];
    let songs = [];
    data.forEach((i, index) => {
      totalDistance += i.run_map[i.run_map.length - 1].distance_meters;
      totalTime += i.run_map[i.run_map.length - 1].elapsed_sec;
      i.run_map.forEach((p) => {
        allHeartRates.push(p.heart_rate_bpm);
        allSpeeds.push(p.pace);
      });
      songs.push(...i.songs);
    });

    let sortedSpeeds = allSpeeds.sort(sortDescending);
    let sortedHeart = allHeartRates.sort(sortDescending);
    setCombinedData({
      ...combinedData,
      totalDistance: totalDistance.toFixed(2),
      totalTime: totalTime,
      averageHeartRate: average(allHeartRates).toFixed(0),
      averageSpeed: average(allSpeeds).toFixed(2),
      highestHeart: sortedHeart[0],
      highestSpeed: sortedSpeeds[0],
      lowestHeart: sortedHeart[sortedHeart.length - 1],
      lowestSpeed: sortedSpeeds[sortedSpeeds.length - 1],
      songs: songs,
    });
  };

  const setStates = (vals) => {
    setRunIdList(vals[0]);
    setRunList(vals[1]);

    basicAggregateDataFormat(vals[1]);

    spotifyToken = vals[2];
    let runData = vals[1][vals[1].length - 1];
    //console.log(runData);
  };

  useEffect(async () => {
    if (userData == null) {
      await fetchUserData(currentUser.uid);

      return;
    }

    await retrieveRuns(props, userData, setStates, history);
  }, [userData]);

  if (combinedData === undefined) {
    return <h1>Loading</h1>;
  }
  return (
    <div>
      <h1>Overall</h1>

      <p>
        Over the last {runIdList.length} runs you travelled{" "}
        {combinedData.totalDistance} metres in{" "}
        {msToHMS(combinedData.totalTime, true)}
      </p>
      <OverallStats combinedData={combinedData} />
      <p>You listened to </p>

      <AllSongs songs={combinedData.songs} />

      <h1>Note: this page is under construction</h1>
    </div>
  );
};

export default OverallResults;
