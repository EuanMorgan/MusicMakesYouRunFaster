import { CollapseMenu } from "../ReusableComponents/Collapse";

export const RunStats = (props) => {
  let fastest_song_ids = [];
  let fastest_speeds = {};
  props.run.fastest_points.forEach((p) => {
    if (p.song_playing === undefined) {
      return;
    }
    console.log(p);
    let song_playing =
      typeof p.song_playing == "string" ? p.song_playing : p.song_playing.id;
    console.log(p.song_playing);
    if (!fastest_song_ids.includes(song_playing)) {
      fastest_song_ids.push(song_playing);
      fastest_speeds[song_playing] = p.pace;
    }
    console.log(fastest_song_ids);
  });

  console.log(fastest_song_ids);
  console.log(props.run.songs);
  const formatText = (id) => {
    return [
      `Your fastest speed when listening to this was: ${fastest_speeds[id]} m/s`,
      `That's ${(
        ((fastest_speeds[id] - props.run.avg_pace) / props.run.avg_pace) *
        100
      ).toFixed(0)}% above your average`,
    ];
  };
  return (
    <div>
      <h1>
        Run:{" "}
        {props.run.fastest_points[0].time.split("T")[0] +
          " " +
          props.run.fastest_points[0].time.split("T")[1].split(".")[0]}
      </h1>
      <p>Average speed: {props.run.avg_pace.toFixed(2)} m/s</p>
      <p>Average heartrate: {props.run.avg_bpm.toFixed(0)} BPM</p>
      <h1>The songs that made you run the fastest were: </h1>
      {fastest_song_ids.map((id) => (
        <div>
          <CollapseMenu
            name={props.run.songs.filter((s) => s.id === id)[0]["name"]}
            data={formatText(id)}
          />
        </div>
      ))}
    </div>
  );
};
