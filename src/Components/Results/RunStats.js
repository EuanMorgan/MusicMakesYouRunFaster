import { CollapseMenu } from "../ReusableComponents/Collapse";

export const RunStats = (props) => {
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

  let labels = [];

  console.log(props);
  props.run.run_map.forEach((point) => {
    labels.push(point.elapsed_hhmmss);
  });

  const retrieveDataForSong = (songid) => {
    let data = [];
    let not_listening_data = [];
    props.run.run_map.forEach((p) => {
      if (!p.song_playing) {
        not_listening_data.push(p.pace);
        data.push(null);
        return;
      }
      if (typeof p.song_playing == "string" && p.song_playing == songid) {
        data.push(p.pace);
        not_listening_data.push(null);
      } else if (p.song_playing.id == songid) {
        data.push(p.pace);
        not_listening_data.push(null);
      } else {
        not_listening_data.push(p.pace);
        data.push(null);
      }
    });

    return [data, not_listening_data];
  };

  console.log(fastest_song_ids);
  console.log(props.run.songs);
  console.log(props.run);
  const formatText = (id) => {
    let fastest_sentences = [
      "Wow! This song had you flying!",
      "🤯This song really gets you moving🤯",
    ];
    return [
      `Your fastest speed when listening to this was: ${fastest_speeds[id]} m/s`,
      `That's ${(
        ((fastest_speeds[id] - props.run.avg_pace) / props.run.avg_pace) *
        100
      ).toFixed(0)}% above your average`,
    ];
  };
  return (
    <div className="results">
      <h1>
        Run:{" "}
        {props.run.fastest_points[0].time.split("T")[0] +
          " " +
          props.run.fastest_points[0].time.split("T")[1].split(".")[0]}
      </h1>
      <p>Average speed: {props.run.avg_pace.toFixed(2)} m/s</p>
      <p>Average heartrate: {props.run.avg_bpm.toFixed(0)} BPM</p>
      <h1>The songs that made you run the fastest were: </h1>
      {fastest_song_ids.map((id) => {
        let [listeningData, notListeningData] = retrieveDataForSong(id);
        return (
          <div>
            <CollapseMenu
              name={props.run.songs.filter((s) => s.id === id)[0]["name"]}
              data={formatText(id)}
              listeningData={listeningData}
              notListeningData={notListeningData}
              labels={labels}
            />
          </div>
        );
      })}
    </div>
  );
};
