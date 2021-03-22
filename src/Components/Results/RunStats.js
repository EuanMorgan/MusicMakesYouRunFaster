import { CollapseMenu } from "../ReusableComponents/Collapse";
import { sort } from "../../Functions/MainApiCalls";
import { calcPercentIncDec, msToHMS } from "../../Common/CommonFunctions";
import { Redirect, Link } from "react-router-dom";
export const RunStats = (props) => {
  // FIND LIST OF FASTEST SONGS
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

  let bpm_order = [...props.run.run_map].sort(sort("heart_rate_bpm"));
  let speed_order = [...props.run.run_map].sort(sort("pace"));
  console.log(bpm_order);
  bpm_order.forEach((h) => {
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
    props.run.run_map.forEach((p) => {
      if (!p.song_playing) {
        not_listening_data.push(p.pace);
        data.push(null);
        not_listening_heartrates.push(p.heart_rate_bpm);
        heartrates.push(null);
        return;
      }
      if (typeof p.song_playing == "string" && p.song_playing == songid) {
        data.push(p.pace);
        not_listening_data.push(null);
        heartrates.push(p.heart_rate_bpm);
        not_listening_heartrates.push(null);
      } else if (p.song_playing.id == songid) {
        data.push(p.pace);
        not_listening_data.push(null);
        heartrates.push(p.heart_rate_bpm);
        not_listening_heartrates.push(null);
      } else {
        not_listening_data.push(p.pace);
        data.push(null);
        not_listening_heartrates.push(p.heart_rate_bpm);
        heartrates.push(null);
      }
    });

    return [data, not_listening_data, heartrates, not_listening_heartrates];
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
        `Your fastest speed when listening to this was: ${fastest_speeds[id]} m/s`,
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
    <div className="results">
      <h1>
        Run:{" "}
        {props.run.fastest_points[0].time.split("T")[0] +
          " " +
          props.run.fastest_points[0].time.split("T")[1].split(".")[0]}
      </h1>
      <p>Overall Stats</p>
      <div className="data-list-top-container">
        <div className="data-list-top">
          <p>
            <span className="data-list-title">You ran for:</span>{" "}
            {msToHMS(
              props.run.run_map[props.run.run_map.length - 1].epoch_ms -
                props.run.run_map[0].epoch_ms
            )}
          </p>
          <p>
            <span className="data-list-title">You travelled:</span>{" "}
            {props.run.run_map[props.run.run_map.length - 2].distance_meters}{" "}
            metres
          </p>
          <p>
            <span className="data-list-title">Average speed:</span>{" "}
            {props.run.avg_pace.toFixed(2)} m/s
          </p>
          <p>
            <span className="data-list-title">Average heartrate:</span>{" "}
            {props.run.avg_bpm.toFixed(0)} BPM
          </p>
        </div>

        <div className="data-list-top">
          <p>
            <span className="data-list-title">Peak speed:</span>{" "}
            {props.run.fastest_points[0].pace} m/s
          </p>
          <p>
            <span className="data-list-title">Slowest speed:</span>{" "}
            {speed_order[speed_order.length - 2].pace} m/s
          </p>
          <p>
            <span className="data-list-title">Peak heartrate:</span>{" "}
            {bpm_order[0].heart_rate_bpm} BPM
          </p>
          <p>
            <span className="data-list-title">Slowest heartrate:</span>{" "}
            {bpm_order[bpm_order.length - 1].heart_rate_bpm} BPM
          </p>
        </div>
      </div>
      <div style={{ paddingTop: "2rem" }}>
        <Link
          className="button"
          to={{
            pathname: "/runs",

            state: { load_run: props.run },
          }}
        >
          View run on map
        </Link>
      </div>

      <h1>The songs that made you run the fastest were: </h1>
      {fastest_song_ids.map((id) => {
        let [
          listeningData,
          notListeningData,
          heartrates,
          notListeningHeartrates,
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
            />
          </div>
        );
      })}
    </div>
  );
};
