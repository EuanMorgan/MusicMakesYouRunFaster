import React, { useEffect, useState } from "react";
import { average, retrieveDataForSong } from "../../Common/CommonFunctions";
import { split } from "../../Functions/MainApiCalls";
import { Speed } from "./Graphs/Speed";
const SongSpeeds = (props) => {
  console.log(props.data);
  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    const graph_data = [];

    let songSpeedList = props.data.fastestSongs.map((song) => {
      //get array of run objects, each object contains an array of points across the run that the song was playing
      let currentSongData = retrieveDataForSong(
        song.id,
        props.data.allData,
        true
      );

      currentSongData.forEach((run) => {
        //for every run calculate average for each quarter of the song
        let quarter = Math.ceil(run.data.length / 4);

        //Group into four arrays, each 1/4 of the song
        let groups = split(run.data, quarter);

        //this is the data to go in the graph.
        let quarter_avg_speeds = groups.map((q) => average(q));

        graph_data.push({
          title: song.name,
          data: quarter_avg_speeds,
          date: run.title,
        });
        console.log(song.name);
        console.log(props.data.fastestSongs);
      });
    });

    console.log(graph_data);
    setGraphData(graph_data);
  }, [props.data]);

  return (
    <div>
      <h1>Speed per song</h1>

      <Speed data={graphData} />
    </div>
  );
};

export default SongSpeeds;
