import React from "react";
import { sort } from "../../../Functions/MainApiCalls";
import { CollapseMenu } from "../../ReusableComponents/Collapse";
import { calcPercentIncDec } from "../../../Common/CommonFunctions";
import { generateColor } from "../../../Common/CommonFunctions";
import { LineGraph } from "../Graphs/Line";
import { useWindowSize } from "../../../Hooks/useWindowSize";

const FastestSongs = (props) => {
  const size = useWindowSize();
  let fastest_song_ids = [];
  let fastest_speeds = {};
  let fastest_song_audio_features = [];
  props.run.fastest_points.forEach((p) => {
    if (p.song_playing === undefined) {
      return;
    }

    let song_playing =
      typeof p.song_playing == "string" ? p.song_playing : p.song_playing.id;

    if (!fastest_song_ids.includes(song_playing)) {
      let song = props.run.songs.filter((song) => song.id === song_playing)[0];
      fastest_song_ids.push(song_playing);
      ////console.log(song);
      let audioFeatures = song.audio_features;
      ////console.log(audioFeatures);
      audioFeatures[0].name = song.name;
      audioFeatures[0].color = generateColor();
      fastest_song_audio_features.push(audioFeatures[0]);
      fastest_speeds[song_playing] = p.pace;
    }
  });
  // FIND LIST OF HIGHEST HEART BPM
  let highest_heart_ids = [];
  let highest_hearts = {};

  ////console.log(props.bpm_order);
  props.bpm_order.forEach((h) => {
    if (h.song_playing === undefined) {
      return;
    }

    let song_playing =
      typeof h.song_playing == "string" ? h.song_playing : h.song_playing.id;

    if (!highest_heart_ids.includes(song_playing)) {
      highest_heart_ids.push(song_playing);
      highest_hearts[song_playing] = h.heart_rate_bpm;
    } else {
      if (highest_hearts[song_playing] < h.heart_rate_bpm) {
        highest_heart_ids.push(song_playing);
        highest_hearts[song_playing] = h.heart_rate_bpm;
      }
    }
  });

  let labels = [];

  props.run.run_map.forEach((point) => {
    labels.push(point.elapsed_hhmmss);
  });
  const retrieveDataForSong = (songid) => {
    let data = [];
    let not_listening_data = [];

    let heartrates = [];
    let not_listening_heartrates = [];
    let listening_map = [];
    props.run.run_map.forEach((p) => {
      if (!p.song_playing) {
        // NOT LISTENING
        not_listening_data.push(p.pace);
        data.push(null);
        not_listening_heartrates.push(p.heart_rate_bpm);
        heartrates.push(null);
        return;
      }
      if (
        (typeof p.song_playing == "string" && p.song_playing == songid) ||
        p.song_playing.id == songid
      ) {
        // listening
        data.push(p.pace);
        not_listening_data.push(null);
        heartrates.push(p.heart_rate_bpm);
        not_listening_heartrates.push(null);
        listening_map.push([p.longitude, p.latitude]);
      } else {
        // not listening
        not_listening_data.push(p.pace);
        data.push(null);
        not_listening_heartrates.push(p.heart_rate_bpm);
        heartrates.push(null);
      }
    });

    return [
      data,
      not_listening_data,
      heartrates,
      not_listening_heartrates,
      listening_map,
    ];
  };

  const formatText = (id) => {
    let fastest_sentences = [
      "Wow! This song had you flying!",
      "🤯This song really gets you moving🤯",
    ];

    let percentBPM = calcPercentIncDec(
      props.run.avg_bpm,
      highest_hearts[id]
    ).toFixed(0);
    let bpm_highlow =
      props.run.avg_bpm > highest_hearts[id] ? "lower" : "higher";
    //console.log(props.run.avg_bpm.toFixed(0), highest_hearts[id]);
    let percentSpeed = calcPercentIncDec(
      props.run.avg_pace,
      fastest_speeds[id]
    ).toFixed(0);
    let speed_highlow =
      props.run.avg_pace > fastest_speeds[id] ? "lower" : "higher";
    return {
      speed_sentences: [
        `Fastest speed when listening: ${fastest_speeds[id]} m/s`,
        percentSpeed === "0"
          ? "That's the same as your average for the whole run"
          : `That's ${percentSpeed}% ${speed_highlow} than your average`,
        ,
      ],
      heart_sentences: [
        `Your highest heartrate when listening to this was: ${highest_hearts[id]}`,
        percentBPM === "0"
          ? "That's the same as your average for the whole run."
          : `That's ${percentBPM}% ${bpm_highlow} than your average`,
      ],
    };
  };

  const speedGraph = (
    <LineGraph
      speeds={props.run.run_map.map((point) => point.pace)}
      labels={labels}
      legendTitle={"Speed (m/s)"}
      show={true}
    />
  );

  const bpmGraph = (
    <LineGraph
      speeds={props.run.run_map.map((point) => point.heart_rate_bpm)}
      labels={labels}
      legendTitle={"Heart Rate (BPM)"}
      show={true}
      isHeartrate={true}
    />
  );

  if (fastest_song_ids.length === 0) {
    return (
      <div>
        <p>
          We found no songs during this run that had a major impact on your
          speed
        </p>
        <h1>Overall Speed Graph</h1>
        <div
          style={{
            width: size.width < 1200 ? "100vw" : "69vw",
            margin: "auto",
          }}
        >
          {speedGraph}
        </div>
        <h1>Overall Heart Rate Graph</h1>
        <div
          style={{
            width: size.width < 1200 ? "100vw" : "69vw",
            margin: "auto",
            paddingBottom: "3%",
          }}
        >
          {bpmGraph}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Overall Speed graph</h1>
      <div style={{ width: "69%", margin: "auto", paddingBottom: "3%" }}>
        {speedGraph}
      </div>
      <h1>You ran the fastest whilst listening to these songs: </h1>
      {fastest_song_ids.map((id) => {
        let [
          listeningData,
          notListeningData,
          heartrates,
          notListeningHeartrates,
          listening_map,
        ] = retrieveDataForSong(id);

        return (
          <div>
            <CollapseMenu
              name={props.run.songs.filter((s) => s.id === id)[0]["name"]}
              id={id}
              data={formatText(id)}
              listeningData={listeningData}
              notListeningData={notListeningData}
              labels={labels}
              heartrateData={heartrates}
              notListeningHeartrates={notListeningHeartrates}
              audioFeatures={[...fastest_song_audio_features]}
              listeningMap={listening_map}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FastestSongs;
