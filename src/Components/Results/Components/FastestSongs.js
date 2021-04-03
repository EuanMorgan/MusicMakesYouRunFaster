import React from "react";
import { sort } from "../../../Functions/MainApiCalls";
import { CollapseMenu } from "../../ReusableComponents/Collapse";
import { calcPercentIncDec } from "../../../Common/CommonFunctions";
const FastestSongs = (props) => {
  let fastest_song_ids = [];
  let fastest_speeds = {};
  props.run.fastest_points.forEach((p) => {
    if (p.song_playing === undefined) {
      return;
    }

    let song_playing =
      typeof p.song_playing == "string" ? p.song_playing : p.song_playing.id;

    if (!fastest_song_ids.includes(song_playing)) {
      fastest_song_ids.push(song_playing);
      fastest_speeds[song_playing] = p.pace;
    }
  });
  // FIND LIST OF HIGHEST HEART BPM
  let highest_heart_ids = [];
  let highest_hearts = {};

  console.log(props.bpm_order);
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
    let percentSpeed = calcPercentIncDec(
      props.run.avg_pace,
      fastest_speeds[id]
    ).toFixed(0);
    let speed_highlow =
      props.run.avg_pace > fastest_speeds[id] ? "lower" : "higher";
    return {
      speed_sentences: [
        `Fastest speed when listening: ${fastest_speeds[id]} m/s`,
        `That's ${percentSpeed}% ${speed_highlow} than your average`,
        ,
      ],
      heart_sentences: [
        `Your highest heartrate when listening to this was: ${highest_hearts[id]}`,
        `That's ${percentBPM}% ${bpm_highlow} than your average`,
      ],
    };
  };

  return (
    <div>
      <h1>The songs that made you run the fastest were: </h1>
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
              data={formatText(id)}
              listeningData={listeningData}
              notListeningData={notListeningData}
              labels={labels}
              heartrateData={heartrates}
              notListeningHeartrates={notListeningHeartrates}
              audioFeatures={
                props.run.songs.filter((s) => s.id === id)[0]["audio_features"]
              }
              listeningMap={listening_map}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FastestSongs;
