import React, { useEffect, useState } from "react";
import "../../Styles/app.scss";
import { retrieveRuns } from "../../Functions/RetrieveRuns";
import { useAuth } from "../../Contexts/Auth";
import { useHistory, Link } from "react-router-dom";
import {
  msToHMS,
  average,
  sortDescending,
  generateColor,
} from "../../Common/CommonFunctions";
import OverallStats from "../Results/Components/OverallStats";
import AllSongs from "../Results/Components/AllSongs";
import SongSimilarity from "./SongSimilarity";
import { Frequency } from "./Graphs/Frequency";
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

    let fastest_songs = [];

    data.forEach((i, index) => {
      totalDistance += i.run_map[i.run_map.length - 1].distance_meters;
      totalTime += i.run_map[i.run_map.length - 1].elapsed_sec;
      i.run_map.forEach((p) => {
        allHeartRates.push(p.heart_rate_bpm);
        allSpeeds.push(p.pace);
      });
      songs.push(...i.songs);

      let fastest_song_ids = [];
      i.fastest_points.forEach((p) => {
        // find fastest songs
        if (p.song_playing === undefined) {
          return;
        }

        //find id of song playing
        let song_playing =
          typeof p.song_playing == "string"
            ? p.song_playing
            : p.song_playing.id;

        if (!fastest_song_ids.includes(song_playing)) {
          let song = i.songs.filter((song) => song.id === song_playing)[0];

          song.color = generateColor();

          fastest_songs.push(song);
          fastest_song_ids.push(song.id);
        }
      });
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
      fastestSongs: fastest_songs,
    });

    console.log(fastest_songs);
  };

  const setStates = (vals) => {
    if (vals[0].length < 3) {
      history.push("/results");
      props.toast.error(
        "Whoops 😲 this feature unlocks once you have logged at least 3 runs"
      );
      return <div></div>;
    }

    setRunIdList(vals[0]);
    setRunList(vals[1]);

    basicAggregateDataFormat(vals[1]);

    spotifyToken = vals[2];
    let runData = vals[1][vals[1].length - 1];
    //console.log(runData);
  };

  const findRepeatOccurences = (songs) => {
    let tempIDArray = songs.map((song) => song.id);

    let tempCount = {};

    tempIDArray.forEach((id) => {
      let ref = songs.filter((song) => song.id === id)[0].name;
      if (!tempCount[ref]) {
        tempCount[ref] = 1;
      } else {
        tempCount[ref]++;
      }
    });

    let duplicateValues = {};

    Object.keys(tempCount).forEach((key) => {
      if (tempCount[key] > 1) {
        duplicateValues[key] = tempCount[key];
      }
      console.log(duplicateValues);
      console.log(tempCount[key]);
    });

    console.log(duplicateValues);

    let returnVal =
      Object.keys(duplicateValues).length > 0 ? (
        <div>
          <p>Songs that appear more than once</p>
          <Frequency data={duplicateValues} />
          {/* {duplicates.map((id) => (
            <p>{songs.filter((song) => song.id === id)[0].name}</p>
          ))} */}
        </div>
      ) : (
        <p>
          You have a diverse music taste, you never listened to the same song
          twice!
        </p>
      );

    console.log(returnVal);
    return returnVal;
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
        Over the last <span className="red-text"> {runIdList.length} runs</span>{" "}
        you travelled{" "}
        <span className="red-text">{combinedData.totalDistance} metres</span> in{" "}
        {msToHMS(combinedData.totalTime, true)}
      </p>
      <OverallStats combinedData={combinedData} />

      <AllSongs songs={combinedData.songs} />
      {findRepeatOccurences(combinedData.songs)}

      {/* {combinedData.songs} */}
      {/* <Frequency /> */}

      <SongSimilarity
        songs={combinedData.songs}
        fastest_songs={combinedData.fastestSongs}
      />
    </div>
  );
};

export default OverallResults;
