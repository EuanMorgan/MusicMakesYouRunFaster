export const RunStats = (props) => {
  let fastest_song_ids = [];
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
    }
    console.log(fastest_song_ids);
  });
  console.log(fastest_song_ids);
  console.log(props.run.songs);
  return (
    <div>
      <h1>The songs that made you run the fastests were: </h1>
      {fastest_song_ids.map((id) => (
        <p
          key={id}
          style={{ cursor: "pointer" }}
          onClick={() => {
            alert(
              `Your heartrate at this point was ${Math.floor(
                Math.random() * 220
              )}\nYour speed was ${Math.floor(Math.random() * 5)} m/s`
            );
          }}
        >
          {props.run.songs.filter((s) => s.id === id)[0]["name"]}
        </p>
      ))}
    </div>
  );
};
