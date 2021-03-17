import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const Player = (props) => {
  const [key, setKey] = useState();

  useEffect(() => {
    setKey(Math.random());
  }, [props.uri]);
  return (
    <SpotifyPlayer
      token={props.token}
      uris={props.uri}
      autoPlay={props.play}
      play={props.play}
      styles={{ height: "2.2rem" }}
    />
  );
};

export default Player;
