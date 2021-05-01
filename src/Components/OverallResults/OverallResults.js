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
import FastestSongs from "../Results/Components/FastestSongs";
import {
  Paragraph,
  ParagraphContainer,
  ParagraphLarger,
} from "../../Constants/Styled";
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

        if (fastest_songs.length == 15) {
          //if overflowing song limit, remove oldest song
          fastest_songs.splice(0, 1);
        }

        //console.log(fastest_songs);
        //console.log(fastest_songs.length, "didnt return");
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

    let nonFastestSongs = [...songs];

    fastest_songs.forEach((song) => {
      nonFastestSongs.splice(nonFastestSongs.indexOf(song), 1);
    });
    let repeats = findRepeatOccurences(songs);

    let fastestRepeats = findRepeatOccurences(fastest_songs, repeats);

    let nonFastestRepeats = findRepeatOccurences(nonFastestSongs, repeats);

    //console.log(fastest_songs);
    //console.log(nonFastestSongs);

    //console.log(fastestRepeats);
    //console.log(nonFastestRepeats);

    let genres = [];
    let artists = [];
    let allSongs = [];
    songs.forEach((song) => {
      genres.push(...song.artist_data.genres);
      artists.push(song.artist_data.id);
      allSongs.push(song.id);
      //console.log(artists);
    });

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
      repeatOccurences: repeats,
      fastestRepeats: fastestRepeats,
      nonFastestRepeats: nonFastestRepeats,
      nonFastestSongs: nonFastestSongs,
      uniqueGenres: [...new Set(genres)],
      uniqueArtists: [...new Set(artists)],
      uniqueSongs: [...new Set(allSongs)],
      allData: data,
    });

    //console.log(songs);

    //console.log(fastest_songs);
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
    ////console.log(runData);
  };

  const findRepeatOccurences = (songs, repeats = []) => {
    let tempIDArray = songs.map((song) => song.id);
    //console.log(songs);
    let tempCount = {};

    tempIDArray.forEach((id) => {
      let ref = songs.filter((song) => song.id === id)[0].name;
      if (!tempCount[ref]) {
        tempCount[ref] = 1;
      } else {
        tempCount[ref]++;
      }
    });
    //console.log(tempCount);
    let duplicateValues = {};

    Object.keys(tempCount).forEach((key) => {
      if (tempCount[key] > 1 || repeats[key]) {
        duplicateValues[key] = tempCount[key];
      }
      //console.log(duplicateValues);
      //console.log(tempCount[key]);
    });

    //console.log(duplicateValues);
    if (Object.keys(duplicateValues).length > 0) {
      return duplicateValues;
    }

    return null;
  };

  const showRepeatOccurences = () => {
    //console.log(combinedData.repeatOccurences);
    if (combinedData.repeatOccurences === null) {
      return;
    }

    //console.log(combinedData.fastestRepeats, combinedData.nonFastestRepeats);
    let returnVal =
      Object.keys(combinedData.repeatOccurences).length > 0 ? (
        <div>
          <p>Songs that appear more than once</p>
          <Frequency
            fastest={combinedData.fastestRepeats}
            nonFastest={combinedData.nonFastestRepeats}
          />
          {Object.keys(combinedData.repeatOccurences).map((song) => {
            let fastest = combinedData.fastestRepeats[song];
            let notfastest = combinedData.nonFastestRepeats[song];
            return fastest && notfastest ? (
              <ParagraphContainer>
                <Paragraph>
                  <span className="red-text">{song}</span> has appeared{" "}
                  <span className="red-text">
                    {fastest} {fastest > 1 ? "times" : "time"}
                  </span>{" "}
                  when running fast, and{" "}
                  <span className="red-text">
                    {notfastest} {notfastest > 1 ? "times" : "time"}{" "}
                  </span>
                  when running slower.
                  <br />
                  {notfastest === fastest
                    ? "Since it has shown up when in your fastest and not fastest points, perhaps the speed was caused by external factors (e.g. running down a hill)"
                    : notfastest > fastest
                    ? "Since it shows up more often when running slower, perhaps it wasn't the song that influenced your speed in the other cases."
                    : "Since it shows up more often when you're going faster, perhaps the slower times were a fluke."}
                </Paragraph>
              </ParagraphContainer>
            ) : null;
          })}
        </div>
      ) : (
        <p>
          You have a diverse music taste, you never listened to the same song
          twice!
        </p>
      );

    //console.log(returnVal);
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

  //console.log(combinedData);
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
      {showRepeatOccurences()}

      <SongSimilarity
        songs={combinedData.songs}
        fastest_songs={combinedData.fastestSongs}
        non_fastest_songs={combinedData.nonFastestSongs}
        all={combinedData}
        spotifyToken={spotifyToken}
      />
    </div>
  );
};

export default OverallResults;
